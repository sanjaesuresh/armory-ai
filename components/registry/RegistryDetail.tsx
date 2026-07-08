'use client';

/**
 * RegistryDetail — detail page for a registry item (agent, skill, harness).
 *
 * Props mirror SetupDetail (setup, userId, initialUpvoted, isModerator) so the
 * server page can wire them up the same way.
 *
 * Layout (per docs/mock/dev-detail.html):
 *   - Back link → /developers
 *   - Header: KindBadge + source badge, name, meta row (author · date · upvote · report)
 *   - Description row (left) + GitHub repo link (right, optional)
 *   - "What it does" capabilities list (hidden when empty)
 *   - ArtifactFileViewer
 *   - Moderator takedown (isModerator + community|ai-generated + approved only)
 */

import Link from 'next/link';
import type { Setup } from '@/lib/setup/types';
import KindBadge from '@/components/KindBadge';
import UpvoteButton from '@/components/UpvoteButton';
import ReportSetup from '@/components/ReportSetup';
import TakedownControl from '@/components/admin/TakedownControl';
import ArtifactFileViewer from './ArtifactFileViewer';
import RepoBrowser from './RepoBrowser';
import { formatStars } from '@/lib/catalog/format-stars';
import { GITHUB_STARS_AS_OF } from '@/lib/catalog/source-tags';

// ── Icons ─────────────────────────────────────────────────────────────────────

const ArrowLeftIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M19.5 12h-15M10 6.5 4.5 12 10 17.5" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3.5 5 6v6c0 4.5 3 7.6 7 8.5 4-.9 7-4 7-8.5V6z" />
    <path d="m9 12 2 2 4-4.5" />
  </svg>
);

const GitBranchIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 01-9 9" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  setup: Setup;
  /** Authenticated user's ID; null/undefined = signed out. */
  userId?: string | null;
  /** Whether the current user has already upvoted this item (queried server-side). */
  initialUpvoted?: boolean;
  /** Whether the current user is a moderator (checked server-side, service role). */
  isModerator?: boolean;
}

// ── RegistryDetail ────────────────────────────────────────────────────────────

export default function RegistryDetail({
  setup,
  userId = null,
  initialUpvoted = false,
  isModerator = false,
}: Props) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(setup.updatedAt));

  const showTakedown =
    isModerator &&
    (setup.source === 'community' || setup.source === 'ai-generated') &&
    setup.reviewStatus === 'approved';

  return (
    <main>
      <div className="wrap" style={{ maxWidth: '920px' }}>
        {/* Back link */}
        <Link href="/developers" className="back-link">
          <ArrowLeftIcon />
          All tools
        </Link>

        {/* Header */}
        <div className="dev-detail-head">
          {/* Badges row */}
          <div className="dev-badges">
            <KindBadge kind={setup.kind} />

            {setup.source === 'curated' ? (
              <span className="badge badge-curated" data-testid="detail-badge-curated">
                <ShieldIcon />
                Curated · reviewed
              </span>
            ) : setup.source === 'community' ? (
              <span className="badge badge-community" data-testid="detail-badge-community">
                Member post
              </span>
            ) : setup.source === 'ai-generated' ? (
              <span className="badge badge-ai" data-testid="detail-badge-ai">
                AI-generated
              </span>
            ) : setup.source === 'github' ? (
              <span className="badge badge-github" data-testid="detail-badge-github">
                Community pick
              </span>
            ) : null}

            {setup.source === 'github' && setup.githubStars != null && (
              <span
                className="stars"
                data-testid="detail-stars"
                title={`GitHub stars as of ${GITHUB_STARS_AS_OF}`}
              >
                ★ {formatStars(setup.githubStars)}
              </span>
            )}
          </div>

          <h1>{setup.name}</h1>

          {/* Meta row: author · date · upvote · report */}
          <div className="dev-detail-meta">
            {setup.author && (
              <>
                <span>by {setup.author}</span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span>Updated {formattedDate}</span>

            <UpvoteButton
              setupId={setup.id}
              initialCount={setup.upvotes}
              initialUpvoted={initialUpvoted}
              userId={userId}
            />

            <div className="dev-detail-meta__report">
              <ReportSetup setupId={setup.id} userId={userId} />
            </div>
          </div>
        </div>

        {/* Description + optional GitHub link */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            marginBottom: '40px',
          }}
        >
          <p
            className="muted"
            style={{ flex: 1, minWidth: '280px', fontSize: '1.04rem', margin: 0, maxWidth: '46em' }}
          >
            {setup.description}
          </p>

          {setup.repoUrl && (
            <a
              className="repo-link"
              href={setup.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub (opens in new tab)"
            >
              <GitBranchIcon />
              View on GitHub
              <ArrowRightIcon />
            </a>
          )}
        </div>

        {/* Capabilities: "What it does" — hidden when empty */}
        {setup.capabilities.length > 0 && (
          <section aria-labelledby="capabilities-heading">
            <h2
              id="capabilities-heading"
              style={{ fontSize: '1.2rem', marginBottom: '14px' }}
            >
              What it does
            </h2>
            <ul
              className="cap-list"
              style={{ marginBottom: '42px' }}
              aria-label="Capabilities"
            >
              {setup.capabilities.map((cap) => (
                <li key={cap.command} className="cap-item">
                  <span className="cap-cmd">{cap.command}</span>
                  <div className="cap-body">
                    <p>{cap.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Artifact files */}
        {setup.artifactFiles.length > 0 && (
          <ArtifactFileViewer files={setup.artifactFiles} slug={setup.slug} />
        )}

        {/* GitHub repo browser — lazily loads tree + README; renders nothing if repoUrl is null */}
        <RepoBrowser repoUrl={setup.repoUrl} />

        {/* Moderator takedown */}
        {showTakedown && (
          <div
            style={{
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px solid var(--hairline)',
            }}
          >
            <TakedownControl setupId={setup.id} />
          </div>
        )}

        <div style={{ height: '56px' }} />
      </div>
    </main>
  );
}
