/**
 * /build/[id] — community builder wizard for a specific draft.
 *
 * Signed-out: shows AuthPrompt (the draft is not shown until signed in).
 * Signed-in:  loads the draft row via the server Supabase client (RLS-scoped
 *              to the author), then hands off to BuilderView.
 *
 * 404 if the row doesn't exist or belongs to a different author (RLS returns
 * null for rows the user doesn't own).
 */

import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getSessionUser, createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseDraftsStore, isContentEditable } from '@/lib/community/drafts';
import AuthPrompt from '@/components/AuthPrompt';
import BuilderView from '@/components/builder/BuilderView';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Build a setup · Armory',
  robots: 'noindex',
};

export default async function BuildIdPage({ params }: Props) {
  const { id } = await params;
  const user = await getSessionUser();

  /* ── Signed-out ────────────────────────────────────────────── */
  if (!user) {
    return (
      <main className="section-tight">
        <div className="wrap">
          <div style={{ maxWidth: 500, margin: '40px auto 0' }}>
            <div className="form-card" style={{ padding: 28 }}>
              <AuthPrompt
                message="Sign in to build and share a setup."
                redirectTo={`/build/${id}`}
              />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ── Load draft ─────────────────────────────────────────────── */
  let row;
  try {
    const supabase = await createSupabaseServerClient();
    const store = createSupabaseDraftsStore(supabase);
    row = await store.getRow(id);
  } catch {
    // DB or env error — surface as not-found rather than crashing.
    notFound();
  }

  if (!row) {
    notFound();
  }

  /* ── Content-lock guard ─────────────────────────────────────── */
  // The builder is for drafts only. Pending/approved/rejected rows must be
  // managed via /my/submissions (withdraw → draft, or reopen → draft).
  // isContentEditable is the shared helper from the data-access layer so the
  // check is consistent with the store-level updateDraftFields guard.
  if (!isContentEditable(row.review_status)) {
    redirect('/my/submissions');
  }

  /* ── Render builder ─────────────────────────────────────────── */
  return (
    <main className="section-tight">
      <div className="wrap">
        <BuilderView draft={row} />
      </div>
    </main>
  );
}
