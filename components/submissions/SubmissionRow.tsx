/**
 * SubmissionRow — presentational row for the "My submissions" list.
 *
 * Extracted from MySubmissionsPage so it can be unit-tested in jsdom.
 * Receives already-derived props (kind, reviewStatus, etc.); contains
 * no async logic or data fetching.
 *
 * Status variants:
 *   draft    — "Continue building" link to /build/<id>
 *   pending  — review note + SubmissionActions (withdraw)
 *   approved — upvote count + "View public page" link
 *   rejected — moderator note + SubmissionActions (edit & resubmit)
 */

import Link from 'next/link';
import type { SetupKind } from '@/lib/setup/types';
import KindBadge from '@/components/KindBadge';
import SubmissionActions from './SubmissionActions';

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Props ─────────────────────────────────────────────────────────────────────

export interface SubmissionRowProps {
  id: string;
  /** Pre-processed by the page: `row.name || 'Untitled setup'`. */
  name: string;
  kind: SetupKind;
  reviewStatus: 'draft' | 'pending' | 'approved' | 'rejected';
  reviewNote?: string | null;
  upvotes: number;
  /** ISO 8601 string. */
  updatedAt: string;
  /** Used for the "View public page" link on approved rows. */
  slug: string;
}

// ── SubmissionRow ─────────────────────────────────────────────────────────────

export default function SubmissionRow({
  id,
  name,
  kind,
  reviewStatus,
  reviewNote,
  upvotes,
  updatedAt,
  slug,
}: SubmissionRowProps) {
  return (
    <div
      className="lib-row"
      style={reviewStatus === 'rejected' ? { alignItems: 'flex-start' } : undefined}
      data-testid={`submission-row-${id}`}
    >
      {/* Icon badge — color by status */}
      <span
        className="icon-badge"
        style={{
          background:
            reviewStatus === 'approved' ? 'var(--mint)' :
            reviewStatus === 'pending'  ? 'var(--sky)'  :
            reviewStatus === 'rejected' ? 'var(--blush)' :
                                          'var(--sand)',
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </svg>
      </span>

      {/* Body */}
      <div className="lib-body">
        <strong>
          {name}
          {' '}
          <KindBadge kind={kind} />
        </strong>

        {reviewStatus === 'approved' && (
          <span>
            Live in the catalog &middot; {upvotes} upvote{upvotes !== 1 ? 's' : ''} &middot; updated {formatUpdated(updatedAt)}
          </span>
        )}
        {reviewStatus === 'pending' && (
          <span>
            Being reviewed, we check every setup before it goes live.
          </span>
        )}
        {reviewStatus === 'rejected' && (
          <>
            <span>Not approved &middot; reviewed {formatUpdated(updatedAt)}</span>
            {reviewNote && (
              <div className="finding finding-flag" style={{ marginTop: 8 }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flex: 'none', marginTop: 1 }}
                  aria-hidden="true"
                >
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
        {reviewStatus === 'draft' && (
          <span>Draft &middot; not submitted &middot; last edited {formatUpdated(updatedAt)}</span>
        )}
      </div>

      {/* Status chip */}
      <span className={statusClass(reviewStatus)}>
        {statusLabel(reviewStatus)}
      </span>

      {/* Actions */}
      {reviewStatus === 'approved' && (
        <Link className="btn btn-outline btn-sm" href={`/setup/${slug}`}>
          View public page
        </Link>
      )}
      {reviewStatus === 'draft' && (
        <Link className="btn btn-primary btn-sm" href={`/build/${id}`}>
          Continue building
        </Link>
      )}
      {(reviewStatus === 'pending' || reviewStatus === 'rejected') && (
        <SubmissionActions
          id={id}
          reviewStatus={reviewStatus}
        />
      )}
    </div>
  );
}
