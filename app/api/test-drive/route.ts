/**
 * POST /api/test-drive
 *
 * SERVER ONLY — never import this file or anything it imports into a client
 * component. Both ANTHROPIC_API_KEY and SUPABASE_SERVICE_ROLE_KEY are
 * consumed here and must never appear in the client bundle.
 *
 * ─── Wire contract (SSE) ─────────────────────────────────────────────────────
 *
 * The response is a Server-Sent Events stream (Content-Type: text/event-stream).
 * Every event is terminated by a blank line (\n\n). Task 7's UI reads this stream.
 *
 * During a live model run, one or more text-chunk events arrive:
 *   event: chunk
 *   data: <JSON-encoded string — a single text delta from the model>
 *
 * On successful completion (live run or cache hit), a single done event closes
 * the stream:
 *   event: done
 *   data: {"cached":false,"usage":{"inputTokens":1234,"outputTokens":456,"estimatedCostUsd":0.034}}
 *
 * On any failure, a single error event closes the stream:
 *   event: error
 *   data: {"code":"<code>","message":"<user-facing message>","retryAt":"<ISO string, optional>"}
 *
 * Error codes and their Section 8 states:
 *   validation-error  → 400-level client error (bad request shape / answers)
 *   feature-off       → feature flag is off; no test-drive entry point renders
 *   session-cap       → quota-exhausted (per-token daily cap)
 *   ip-cap            → quota-exhausted (per-IP daily cap)
 *   global-budget     → budget-busy ("test-drives are busy right now")
 *   setup-not-found   → 404
 *   setup-refused     → setup is not curated + approved
 *   input-cap         → compiled prompt is over the 8k-token limit
 *   model-error       → provider error or timeout; retry button shown
 *
 * For a cache hit there are no chunk events — only the done event (cached:true).
 *
 * ─── Request body ────────────────────────────────────────────────────────────
 *
 *   { slug: string, answers: Record<string, unknown>, scenarioId: string }
 *
 * ─── Auth / metering ─────────────────────────────────────────────────────────
 *
 * The route issues/reads the armory_td httpOnly cookie as the anon-session
 * identity token and uses the salted IP hash for the per-IP cap. All
 * test-drive tables are accessed with the service-role key.
 */

import { type NextRequest } from 'next/server';
import { getOrIssueAnonToken, createSupabaseAnonTokenDataSource, type CookieOptions } from '@/lib/testdrive/anonToken';
import { saltIp, createSupabaseMeterDataSource } from '@/lib/testdrive/meter';
import { createFlagChecker, createSupabaseFlagsDataSource } from '@/lib/testdrive/flags';
import { createSupabaseCacheDataSource } from '@/lib/testdrive/cache';
import { createSupabaseDataSource } from '@/lib/catalog/repository';
import { runTestDrive } from '@/lib/testdrive/runner';
import { createAnthropicModelClient } from '@/lib/testdrive/anthropicClient';
import { getSessionUser } from '@/lib/supabase/server';
import { createSupabaseServiceClient } from '@/lib/supabase/serviceClient';
import { createSupabaseTestDriveHistoryStore } from '@/lib/saved/testDriveHistory';

// ─── SSE helpers ─────────────────────────────────────────────────────────────

function sseEvent(eventName: string, data: unknown): string {
  return `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<Response> {
  // Parse request body.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(
      sseEvent('error', { code: 'validation-error', message: 'Invalid JSON body.' }),
      { status: 400, headers: { 'Content-Type': 'text/event-stream' } },
    );
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    typeof (body as Record<string, unknown>).slug !== 'string' ||
    typeof (body as Record<string, unknown>).scenarioId !== 'string' ||
    typeof (body as Record<string, unknown>).answers !== 'object' ||
    (body as Record<string, unknown>).answers === null
  ) {
    return new Response(
      sseEvent('error', { code: 'validation-error', message: 'Request must include slug (string), scenarioId (string), and answers (object).' }),
      { status: 400, headers: { 'Content-Type': 'text/event-stream' } },
    );
  }

  const { slug, scenarioId, answers } = body as {
    slug: string;
    scenarioId: string;
    answers: Record<string, unknown>;
  };

  // ── Resolve anon token ──────────────────────────────────────────────────

  // Capture any newly-issued token cookie so we can set it on the response.
  let newCookie: { name: string; value: string; options: CookieOptions } | null = null;

  const cookieReader = (name: string): string | undefined =>
    req.cookies.get(name)?.value;

  const cookieWriter = (name: string, value: string, options: CookieOptions): void => {
    newCookie = { name, value, options };
  };

  const anonTokenDs = createSupabaseAnonTokenDataSource();
  const token = await getOrIssueAnonToken(cookieReader, cookieWriter, anonTokenDs);

  // ── Derive salted IP hash ───────────────────────────────────────────────

  const rawIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    '0.0.0.0';

  let ipHash: string;
  try {
    ipHash = saltIp(rawIp);
  } catch {
    // TESTDRIVE_IP_SALT is required; if absent fail loud (config error, not user error).
    return new Response(
      sseEvent('error', { code: 'model-error', message: "Test-drive couldn't run, try again." }),
      { status: 500, headers: { 'Content-Type': 'text/event-stream' } },
    );
  }

  // ── Resolve the signed-in user (optional) ───────────────────────────────

  // Never gates the run — anonymous test-drives are unchanged. A session only
  // attributes the run (union metering) and records history.
  const user = await getSessionUser();

  // ── Build runner deps ───────────────────────────────────────────────────

  const deps = {
    flagChecker: createFlagChecker(createSupabaseFlagsDataSource()),
    token,
    ipHash,
    meterDataSource: createSupabaseMeterDataSource(),
    cacheDataSource: createSupabaseCacheDataSource(),
    catalogDataSource: createSupabaseDataSource(),
    modelClient: createAnthropicModelClient(),
    userId: user?.id,
    // Service-role recorder: RLS-bypassing, sets the correct user id server-side.
    historyRecorder: user
      ? createSupabaseTestDriveHistoryStore(createSupabaseServiceClient())
      : undefined,
  };

  // ── Stream the response ─────────────────────────────────────────────────

  const { readable, writable } = new TransformStream<Uint8Array>();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const write = (data: string) => writer.write(encoder.encode(data));

  // Build response headers.
  const responseHeaders: Record<string, string> = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  };

  // Attach the Set-Cookie header if a new token was issued.
  if (newCookie) {
    const { name, value, options } = newCookie as {
      name: string;
      value: string;
      options: CookieOptions;
    };
    const parts = [
      `${name}=${value}`,
      `Max-Age=${options.maxAge}`,
      'Path=/',
      options.httpOnly ? 'HttpOnly' : '',
      options.secure ? 'Secure' : '',
      `SameSite=${options.sameSite}`,
    ].filter(Boolean);
    responseHeaders['Set-Cookie'] = parts.join('; ');
  }

  // Fire-and-forget: run the test drive and pipe events to the SSE stream.
  (async () => {
    try {
      const outcome = await runTestDrive(
        { slug, answers, scenarioId },
        deps,
        (chunk) => {
          write(sseEvent('chunk', chunk));
        },
      );

      switch (outcome.kind) {
        case 'success':
          write(
            sseEvent('done', {
              cached: false,
              usage: outcome.result.usage,
            }),
          );
          break;

        case 'cache-hit':
          write(
            sseEvent('done', {
              cached: true,
              usage: outcome.result.usage,
            }),
          );
          break;

        case 'flag-off':
          write(sseEvent('error', { code: 'feature-off', message: 'Test-drives are not available right now.' }));
          break;

        case 'denied':
          write(
            sseEvent('error', {
              code: outcome.reason,
              message:
                outcome.reason === 'global-budget'
                  ? 'Test-drives are busy right now, try again in a little while.'
                  : "You've used your free test-drives for today, they reset at midnight UTC.",
              ...(outcome.retryAt ? { retryAt: outcome.retryAt } : {}),
            }),
          );
          break;

        case 'validation-error':
          write(sseEvent('error', { code: 'validation-error', message: outcome.message }));
          break;

        case 'setup-not-found':
          write(sseEvent('error', { code: 'setup-not-found', message: 'Setup not found.' }));
          break;

        case 'setup-refused':
          write(sseEvent('error', { code: 'setup-refused', message: 'This setup is not available for test-drive.' }));
          break;

        case 'input-cap':
          write(sseEvent('error', { code: 'input-cap', message: 'The compiled setup is too large to test-drive. Shorten your answers and try again.' }));
          break;

        case 'model-error':
          write(sseEvent('error', { code: 'model-error', message: "Test-drive couldn't run, try again." }));
          break;

        default: {
          const _exhaustive: never = outcome;
          write(sseEvent('error', { code: 'model-error', message: "Test-drive couldn't run, try again." }));
        }
      }
    } catch (err) {
      console.error('[test-drive route] unhandled error:', err);
      write(sseEvent('error', { code: 'model-error', message: "Test-drive couldn't run, try again." }));
    } finally {
      writer.close();
    }
  })();

  return new Response(readable, { headers: responseHeaders });
}
