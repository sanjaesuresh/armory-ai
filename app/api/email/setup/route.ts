/**
 * POST /api/email/setup
 *
 * SERVER ONLY — never import this file into a client component.
 *
 * Public, unauthenticated endpoint: a signed-out user enters an email and
 * receives their just-built setup, no account required. That makes it an
 * abuse surface (see security notes below), so every mitigation here is load-
 * bearing, not decorative.
 *
 * Request body: { email: string, setupId: string, setupVersion: string, answers: object }
 *
 * SECURITY — never trust client-supplied prompt text. The request carries only
 * setupId + answers; this handler looks the setup up itself and recompiles it
 * server-side through the deterministic compiler. This is what stops the
 * endpoint being usable as an open relay to email arbitrary attacker text.
 *
 * Responses:
 *   200 { ok: true }
 *   400 { ok: false, error, code: 'invalid_email' | 'invalid_setup' | 'invalid_answers' }
 *   429 { ok: false, error, code: 'rate_limited' }
 *   500 { ok: false, error, code: 'send_failed' }
 */

import { type NextRequest, NextResponse } from 'next/server';
import { compileSetup } from '@/lib/setup/compiler';
import { toClaudeAppExport } from '@/lib/export/claudeApp';
import type { Answers, Setup } from '@/lib/setup/types';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { rowToSetup, type SetupRow } from '@/lib/catalog/repository';
import { saltIp } from '@/lib/testdrive/meter';
import { checkEmailRateLimit, createSupabaseEmailRateLimitDataSource } from '@/lib/email/rateLimiter';
import { renderYourSetupEmail } from '@/lib/email/renderers/yourSetup';
import { sendEmail } from '@/lib/email/client';

// ─── Validation ────────────────────────────────────────────────────────────

// Deliberately simple — this only gates what we attempt to send to, not a
// full RFC 5322 parser. Resend itself will reject genuinely malformed
// addresses; this catches the obvious "not an email" case cheaply.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 254 && EMAIL_PATTERN.test(value);
}

/** Same shape check the /api/compile route uses: values must be JSON-primitive-ish. */
function isAnswers(value: unknown): value is Answers {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  return Object.values(value as Record<string, unknown>).every((v) => {
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return true;
    if (Array.isArray(v)) return v.every((item) => typeof item === 'string');
    return false;
  });
}

/**
 * Looks up a Setup by id under the caller's RLS (request-scoped client, carries
 * auth cookies). This is a public, unauthenticated route, so it must NOT use the
 * service role: RLS is exactly what stops a caller from emailing themselves an
 * arbitrary unpublished setup (a draft/pending/rejected community submission
 * that isn't theirs). Under RLS a signed-out caller only resolves `approved`
 * setups; a signed-in owner also resolves their own rows — which is all the
 * legitimate flow ever needs (the customize page only serves approved setups).
 */
async function loadSetupById(setupId: string): Promise<Setup | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('setups')
    .select('*')
    .eq('id', setupId)
    .maybeSingle();
  if (error) throw new Error(`Supabase loadSetupById error: ${error.message}`);
  if (!data) return null;
  return rowToSetup(data as SetupRow);
}

// ─── Route handler ────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body.', code: 'invalid_email' },
      { status: 400 },
    );
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json(
      { ok: false, error: 'Request body must be an object.', code: 'invalid_email' },
      { status: 400 },
    );
  }

  const { email, setupId, setupVersion, answers } = body as Record<string, unknown>;

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: 'Enter a valid email address.', code: 'invalid_email' },
      { status: 400 },
    );
  }

  if (typeof setupId !== 'string' || !setupId.trim() || typeof setupVersion !== 'string' || !setupVersion.trim()) {
    return NextResponse.json(
      { ok: false, error: 'setupId and setupVersion (non-empty strings) are required.', code: 'invalid_setup' },
      { status: 400 },
    );
  }

  if (!isAnswers(answers)) {
    return NextResponse.json(
      { ok: false, error: 'Invalid answers: must be a plain object mapping keys to string, number, boolean, or string[].', code: 'invalid_answers' },
      { status: 400 },
    );
  }

  // ── Resolve setup + version match ────────────────────────────────────────
  let setup: Setup | null;
  try {
    setup = await loadSetupById(setupId);
  } catch (err) {
    console.error('[email/setup] setup lookup failed:', err);
    return NextResponse.json(
      { ok: false, error: 'Could not send the email. Please try again.', code: 'send_failed' },
      { status: 500 },
    );
  }

  if (!setup || setup.version !== setupVersion) {
    return NextResponse.json(
      { ok: false, error: 'Setup not found.', code: 'invalid_setup' },
      { status: 400 },
    );
  }

  // ── Rate limit (per email + per IP, rolling window) ──────────────────────
  const rawIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    '0.0.0.0';

  let ipHash: string;
  try {
    ipHash = saltIp(rawIp);
  } catch {
    // TESTDRIVE_IP_SALT is required; if absent this is a config error, not a
    // user error — fail closed with a generic send_failed.
    console.error('[email/setup] TESTDRIVE_IP_SALT is not set');
    return NextResponse.json(
      { ok: false, error: 'Could not send the email. Please try again.', code: 'send_failed' },
      { status: 500 },
    );
  }

  const now = new Date().toISOString();
  const rateLimitDs = createSupabaseEmailRateLimitDataSource();

  let decision;
  try {
    decision = await checkEmailRateLimit({ email, ipHash, now, dataSource: rateLimitDs });
  } catch (err) {
    console.error('[email/setup] rate-limit check failed:', err);
    return NextResponse.json(
      { ok: false, error: 'Could not send the email. Please try again.', code: 'send_failed' },
      { status: 500 },
    );
  }

  if (!decision.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Too many emails sent recently. Try again in a little while.', code: 'rate_limited' },
      { status: 429 },
    );
  }

  // ── Recompile server-side and send ───────────────────────────────────────
  try {
    const compiled = compileSetup(setup, answers);
    const claudeExport = toClaudeAppExport(compiled);
    const rendered = renderYourSetupEmail({ compiled, claudeExport });

    await sendEmail({ to: email, subject: rendered.subject, html: rendered.html, text: rendered.text });

    // Record the send attempt regardless of Resend's internal outcome — the
    // rate limit protects the endpoint from abuse, not delivery guarantees.
    await rateLimitDs.recordSend({ email, ipHash, createdAt: now });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[email/setup] compile/send failed:', err);
    return NextResponse.json(
      { ok: false, error: 'Could not send the email. Please try again.', code: 'send_failed' },
      { status: 500 },
    );
  }
}
