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
import type { SetupRow } from '@/lib/catalog/repository';
import AuthPrompt from '@/components/AuthPrompt';
import SubmissionActions from '@/components/submissions/SubmissionActions';

export const metadata: Metadata = {
  title: 'My submissions · Armory',
};

function formatUpdated(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'recently';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function statusLabel(status: string): string {
  switch (status) {
    case 'approved': return 'Approved';
    case 'pending':  return 'Pending review';
    case 'rejected': return 'Rejected';
    default:         return 'Draft';
  }
}

function statusClass(status: string): string {
  switch (status) {
    case 'approved': return 'status status-ready';
    case 'pending':  return 'status status-soon';
    default:         return 'status status-draft';
  }
}

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

        {rows.map((row) => {
          const reviewNote = row.review_note;

          return (
            <div
              key={row.id}
              className="lib-row"
              style={row.review_status === 'rejected' ? { alignItems: 'flex-start' } : undefined}
              data-testid={`submission-row-${row.id}`}
            >
              {/* Icon badge — color by status */}
              <span
                className="icon-badge"
                style={{
                  background:
                    row.review_status === 'approved' ? 'var(--mint)' :
                    row.review_status === 'pending'  ? 'var(--sky)'  :
                    row.review_status === 'rejected' ? 'var(--blush)' :
                                                       'var(--sand)',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
                  strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
              </span>

              {/* Body */}
              <div className="lib-body">
                <strong>{row.name || 'Untitled setup'}</strong>
                {row.review_status === 'approved' && (
                  <span>
                    Live in the catalog &middot; {row.upvotes} upvote{row.upvotes !== 1 ? 's' : ''} &middot; updated {formatUpdated(row.updated_at)}
                  </span>
                )}
                {row.review_status === 'pending' && (
                  <span>
                    Being reviewed — we check every setup before it goes live.
                  </span>
                )}
                {row.review_status === 'rejected' && (
                  <>
                    <span>Not approved &middot; reviewed {formatUpdated(row.updated_at)}</span>
                    {reviewNote && (
                      <div className="finding finding-flag" style={{ marginTop: 8 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
                          strokeLinejoin="round" style={{ flex: 'none', marginTop: 1 }}
                          aria-hidden="true">
                          <path d="M12 4 2.8 19.5h18.4z" />
                          <path d="M12 10v4.5M12 17.2v.1" />
                        </svg>
                        <div>
                          <strong>Moderator note:</strong>{' '}
                          {/* Rendered as text — never innerHTML (plain text from moderator) */}
                          {reviewNote}
                        </div>
                      </div>
                    )}
                  </>
                )}
                {row.review_status === 'draft' && (
                  <span>Draft &middot; not submitted &middot; last edited {formatUpdated(row.updated_at)}</span>
                )}
              </div>

              {/* Status chip */}
              <span className={statusClass(row.review_status)}>
                {statusLabel(row.review_status)}
              </span>

              {/* Actions */}
              {row.review_status === 'approved' && (
                <Link className="btn btn-outline btn-sm" href={`/setup/${row.slug}`}>
                  View public page
                </Link>
              )}
              {row.review_status === 'draft' && (
                <Link className="btn btn-primary btn-sm" href={`/build/${row.id}`}>
                  Continue building
                </Link>
              )}
              {(row.review_status === 'pending' || row.review_status === 'rejected') && (
                <SubmissionActions
                  id={row.id}
                  reviewStatus={row.review_status as 'pending' | 'rejected'}
                />
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
