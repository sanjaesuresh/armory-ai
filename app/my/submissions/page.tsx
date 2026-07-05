/**
 * My submissions (Phase 5 Task 4).
 *
 * Shows every setup the signed-in author has built, grouped by review status.
 * Signed-out: AuthPrompt (browsing + export stay account-free).
 * Signed-in: rows from listByAuthor() (RLS returns only the author's own rows),
 *   newest-updated first.
 *
 * Status display:
 *   draft    — "Continue building" link to /build/<id>
 *   pending  — review explanation + SubmissionActions withdraw button
 *   approved — "View public page" link to /setup/<slug>
 *   rejected — moderator note (verbatim plain text) + SubmissionActions reopen
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { getSessionUser, createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseDraftsStore } from '@/lib/community/drafts';
import { rowToSetup, type SetupRow } from '@/lib/catalog/repository';
import AuthPrompt from '@/components/AuthPrompt';
import SubmissionRow from '@/components/submissions/SubmissionRow';

export const metadata: Metadata = {
  title: 'My submissions · Armory',
};

interface Props {
  searchParams: Promise<{ submitted?: string }>;
}

export default async function MySubmissionsPage({ searchParams }: Props) {
  const [user, params] = await Promise.all([getSessionUser(), searchParams]);
  const showSubmitBanner = params.submitted === '1';

  // ── Signed-out ──────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <main className="section-tight">
        <div className="wrap" style={{ maxWidth: 500 }}>
          <h1>My submissions</h1>
          <div className="form-card" style={{ marginTop: 24 }}>
            <AuthPrompt
              message="Sign in to see the setups you've submitted."
              redirectTo="/my/submissions"
            />
          </div>
        </div>
      </main>
    );
  }

  // ── Load rows ────────────────────────────────────────────────────────────────
  let rows: SetupRow[];
  try {
    const store = createSupabaseDraftsStore(await createSupabaseServerClient());
    rows = await store.listByAuthor();
  } catch (err) {
    console.error('[my/submissions] failed to load submissions:', err);
    return (
      <main className="section-tight">
        <div className="wrap">
          <div className="error-banner" role="alert" style={{ maxWidth: 540 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 4 2.8 19.5h18.4z" />
              <path d="M12 10v4.5M12 17.2v.1" />
            </svg>
            <div>
              <strong>We couldn&apos;t load your submissions</strong>
              <p>Please try again in a moment.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (rows.length === 0) {
    return (
      <main className="section-tight">
        <div className="wrap">
          <div className="lib-head">
            <div>
              <h1 style={{ fontSize: '1.7rem', marginBottom: 2 }}>My submissions</h1>
              <p className="muted small" style={{ margin: 0 }}>
                Every setup you build. We review each one before it goes live.
              </p>
            </div>
            <Link className="btn btn-primary btn-sm" href="/build">
              New setup
            </Link>
          </div>
          <div className="empty" data-testid="my-submissions-empty">
            <svg width="80" height="64" viewBox="0 0 80 64" fill="none" stroke="#4f483c"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <ellipse cx="40" cy="56" rx="26" ry="4" fill="#f3ede2" stroke="none" />
              <rect x="12" y="10" width="56" height="38" rx="8" fill="#fff" />
              <path d="M24 24h32M24 32h20" />
            </svg>
            <h3>You haven&apos;t built any setups yet</h3>
            <p>
              Build a setup and submit it — it will appear here once you submit for review.
            </p>
            <Link className="btn btn-primary btn-sm" href="/build">
              Build a setup
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Render rows ──────────────────────────────────────────────────────────────
  return (
    <main className="section-tight">
      <div className="wrap">
        <div className="lib-head">
          <div>
            <h1 style={{ fontSize: '1.7rem', marginBottom: 2 }}>My submissions</h1>
            <p className="muted small" style={{ margin: 0 }}>
              Every setup you build. We review each one before it goes live.
            </p>
          </div>
          <Link className="btn btn-primary btn-sm" href="/build">
            New setup
          </Link>
        </div>

        {showSubmitBanner && (
          <div
            role="status"
            className="success-note"
            style={{
              background: 'var(--mint)',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 'var(--r-md)',
              padding: '12px 18px',
              marginBottom: 20,
              fontSize: '0.9rem',
            }}
          >
            Your setup was submitted — we review every setup before it goes live.
          </div>
        )}

        {rows.map((row) => (
          <SubmissionRow
            key={row.id}
            id={row.id}
            name={row.name || 'Untitled setup'}
            kind={rowToSetup(row).kind}
            reviewStatus={row.review_status as 'draft' | 'pending' | 'approved' | 'rejected'}
            reviewNote={row.review_note}
            upvotes={row.upvotes}
            updatedAt={row.updated_at}
            slug={row.slug}
          />
        ))}
      </div>
    </main>
  );
}
