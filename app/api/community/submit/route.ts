/**
 * POST /api/community/submit
 *
 * SERVER ONLY — never import this file into a client component. It imports
 * createAnthropicModelClient which reads ANTHROPIC_API_KEY and is server-only.
 *
 * Request body: { setupId: string }
 *
 * Outcomes:
 *   200 { ok: true }                             — submitted successfully
 *   200 { ok: false, errors: [{message, path}] } — validation blocked submit
 *   400 { ok: false, error: string }             — bad request shape
 *   401 { ok: false, error: string }             — not signed in
 *   404 { ok: false, error: string }             — setup not found (or not owned)
 *   500 { ok: false, error: string }             — unexpected error
 *
 * The safety-screen internals (SafetyScreenResult) are never sent to the
 * caller — only the ok/errors shape reaches the client.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { getSessionUser, createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseDraftsStore, submitDraft, DraftNotFoundError } from '@/lib/community/drafts';
import { createAnthropicModelClient } from '@/lib/testdrive/anthropicClient';

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: 'Sign in to submit a setup.' },
      { status: 401 },
    );
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    typeof (body as Record<string, unknown>).setupId !== 'string'
  ) {
    return NextResponse.json(
      { ok: false, error: 'setupId (string) is required.' },
      { status: 400 },
    );
  }

  const { setupId } = body as { setupId: string };

  // ── Submit ────────────────────────────────────────────────────────────────
  try {
    const store = createSupabaseDraftsStore(await createSupabaseServerClient());
    const result = await submitDraft(
      setupId,
      store,
      createAnthropicModelClient(),
      new Date().toISOString(),
    );

    if (result.ok) {
      // Do not leak safety-screen internals.
      return NextResponse.json({ ok: true });
    }

    // Row is not in draft state — already pending, approved, or rejected.
    // Return 409 so the caller knows to check the submission status.
    if ('notDraft' in result) {
      return NextResponse.json(
        { ok: false, error: 'This setup is not in draft state. Withdraw it first to re-submit.' },
        { status: 409 },
      );
    }

    // Validation blocked the submit — surface the errors so the builder can
    // show what's preventing submission.
    return NextResponse.json({
      ok: false,
      errors: result.validation.errors.map((e) => ({
        message: e.message,
        path: e.path,
      })),
    });
  } catch (err) {
    // RLS returns null for a row the user doesn't own; submitDraft throws
    // DraftNotFoundError in that case — surface as 404.
    if (err instanceof DraftNotFoundError) {
      return NextResponse.json(
        { ok: false, error: 'Setup not found.' },
        { status: 404 },
      );
    }

    console.error('[community/submit] error:', err);
    return NextResponse.json(
      { ok: false, error: 'Submit failed. Please try again.' },
      { status: 500 },
    );
  }
}
