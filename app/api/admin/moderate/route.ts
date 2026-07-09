/**
 * POST /api/admin/moderate
 *
 * SERVER ONLY — imports createSupabaseServiceClient and the moderation
 * functions. Never import this file into a client component.
 *
 * Body: { setupId: string, action: 'approve'|'reject'|'takedown', note?: string }
 *
 * Outcomes:
 *   200 { ok: true }                   — action succeeded
 *   400 { ok: false, error: string }   — invalid body or missing/blank note
 *   401 { ok: false, error: string }   — not signed in
 *   403 { ok: false, error: string }   — not a moderator (never confirms resource)
 *   500 { ok: false, error: string }   — unexpected error
 *
 * Security: The approve/reject/takedown functions re-check isModerator via the
 * store and throw NotModeratorError for non-moderators. So even if the UI gate
 * is bypassed, the service-role functions enforce the allowlist.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/supabase/server';
import { createSupabaseServiceClient } from '@/lib/supabase/serviceClient';
import {
  createSupabaseModerationStore,
  approve,
  reject,
  takedown,
  NotModeratorError,
  type ModerationAction,
} from '@/lib/community/moderation';
import { renderSubmissionApprovedEmail } from '@/lib/email/renderers/submissionApproved';
import { renderSubmissionRejectedEmail } from '@/lib/email/renderers/submissionRejected';
import { sendEmail } from '@/lib/email/client';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Best-effort author-notification email after a moderation transition. Looks
 * up the row (name/slug/author) and the author's email via the service-role
 * admin API. Every failure is swallowed here — a mail outage must never turn
 * a successful moderation action into a 500.
 */
async function notifyAuthor(
  serviceClient: SupabaseClient,
  setupId: string,
  action: ModerationAction,
  note: string,
): Promise<void> {
  try {
    const { data: row, error } = await serviceClient
      .from('setups')
      .select('name, slug, author')
      .eq('id', setupId)
      .maybeSingle();
    if (error || !row || !row.author) return;

    const { data: userData, error: userError } = await serviceClient.auth.admin.getUserById(row.author);
    const authorEmail = userError ? undefined : userData.user?.email;
    if (!authorEmail) return;

    const rendered =
      action === 'approve'
        ? renderSubmissionApprovedEmail({ setupName: row.name, setupSlug: row.slug })
        : renderSubmissionRejectedEmail({ setupName: row.name, note, action });

    await sendEmail({ to: authorEmail, subject: rendered.subject, html: rendered.html, text: rendered.text });
  } catch (err) {
    console.error('[admin/moderate] author notification email failed:', err);
  }
}

const VALID_ACTIONS: ModerationAction[] = ['approve', 'reject', 'takedown'];

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: 'Sign in required.' },
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

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json(
      { ok: false, error: 'Request body must be an object.' },
      { status: 400 },
    );
  }

  const { setupId, action, note } = body as Record<string, unknown>;

  if (typeof setupId !== 'string' || !setupId.trim()) {
    return NextResponse.json(
      { ok: false, error: 'setupId (non-empty string) is required.' },
      { status: 400 },
    );
  }

  if (!VALID_ACTIONS.includes(action as ModerationAction)) {
    return NextResponse.json(
      { ok: false, error: 'action must be "approve", "reject", or "takedown".' },
      { status: 400 },
    );
  }

  const typedAction = action as ModerationAction;
  const noteStr = typeof note === 'string' ? note.trim() : '';

  if ((typedAction === 'reject' || typedAction === 'takedown') && !noteStr) {
    return NextResponse.json(
      { ok: false, error: 'A note is required to reject or take down a setup. The author sees it verbatim.' },
      { status: 400 },
    );
  }

  // ── Perform moderation action ─────────────────────────────────────────────
  try {
    const serviceClient = createSupabaseServiceClient();
    const store = createSupabaseModerationStore(serviceClient);
    const now = new Date().toISOString();

    if (typedAction === 'approve') {
      await approve(setupId, user.id, store, now);
    } else if (typedAction === 'reject') {
      await reject(setupId, user.id, noteStr, store, now);
    } else {
      await takedown(setupId, user.id, noteStr, store, now);
    }

    // Best-effort — never blocks the moderation response.
    await notifyAuthor(serviceClient, setupId, typedAction, noteStr);

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof NotModeratorError) {
      // Do not confirm the resource exists for non-moderators.
      return NextResponse.json(
        { ok: false, error: 'Not authorized.' },
        { status: 403 },
      );
    }

    console.error('[admin/moderate] error:', err);
    return NextResponse.json(
      { ok: false, error: 'Action failed. Please try again.' },
      { status: 500 },
    );
  }
}
