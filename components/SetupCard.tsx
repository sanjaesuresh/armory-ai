import Link from 'next/link';
import type { Setup } from '@/lib/setup/types';
import { getCategoryTint, getSetupIcon } from '@/lib/catalog/categoryUtils';
import { formatStars } from '@/lib/catalog/format-stars';
import { GITHUB_STARS_AS_OF } from '@/lib/catalog/source-tags';
import PlugIcon from './icons/PlugIcon';
import KindBadge from './KindBadge';
import RankBadge from './RankBadge';

interface SetupCardProps {
  setup: Setup;
  /**
   * Honest "why" labels for recommended cards (e.g. "Matches your role").
   * Empty/undefined renders nothing — never a fabricated rating or count.
   */
  whyLabels?: string[];
  /**
   * 'full' (default) — the standard card layout, DOM unchanged.
   * 'compact' — narrower shelf card: smaller padding/heading, desc clamped to
   *   one line, tags hidden, accent edge, optional rank badge.
   */
  variant?: 'full' | 'compact';
  /**
   * When provided (compact variant only), renders a RankBadge at top-right.
   * Never used in full variant — it would change the full-variant DOM.
   */
  rank?: number;
}

/* Small shield icon for the curated badge — inline SVG (no sprite dependency). */
const ShieldBadgeIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3.5 5 6v6c0 4.5 3 7.6 7 8.5 4-.9 7-4 7-8.5V6z" />
    <path d="m9 12 2 2 4-4.5" />
  </svg>
);

export default function SetupCard({ setup, whyLabels, variant = 'full', rank }: SetupCardProps) {
  const tint = getCategoryTint(setup.category);
  const icon = getSetupIcon(setup.role, setup.category);
  const isCompact = variant === 'compact';

  const upvoteLabel = `${setup.upvotes} ${setup.upvotes === 1 ? 'upvote' : 'upvotes'}`;

  return (
    <Link
      href={`/setup/${setup.slug}`}
      className={`setup-card ${tint}${isCompact ? ' is-compact' : ''}`}
      data-testid={`setup-card-${setup.slug}`}
    >
      {/* Compact variant: rank badge (absolutely positioned in top-right via CSS) */}
      {isCompact && rank != null && <RankBadge rank={rank} />}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <span
          className="icon-badge"
          aria-hidden="true"
          style={{ fontSize: '1.25rem' }}
        >
          {icon}
        </span>

        {/* Badge group — kind badge (registry items) + source badge + optional tier badge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <KindBadge kind={setup.kind} />

          {setup.source === 'curated' ? (
            <span className="badge badge-curated" data-testid="badge-curated">
              <ShieldBadgeIcon />
              Curated · reviewed
            </span>
          ) : setup.source === 'community' ? (
            <span className="badge badge-community" data-testid="badge-community">
              Member post
            </span>
          ) : setup.source === 'ai-generated' ? (
            <span className="badge badge-ai" data-testid="badge-ai">
              AI-generated
            </span>
          ) : setup.source === 'github' ? (
            <span className="badge badge-github" data-testid="badge-github">
              Community pick
            </span>
          ) : null}

          {setup.tier === 'advanced' && (
            <span className="badge badge-advanced" data-testid="badge-advanced">
              <PlugIcon />
              Advanced
            </span>
          )}

          {setup.source === 'github' && setup.githubStars != null && (
            <span
              className="stars"
              data-testid="card-stars"
              title={`GitHub stars as of ${GITHUB_STARS_AS_OF}`}
            >
              ★ {formatStars(setup.githubStars)}
            </span>
          )}
        </div>
      </div>

      <h3 data-testid="card-name">{setup.name}</h3>

      {whyLabels && whyLabels.length > 0 && (
        <p className="why-label" data-testid="card-why-label">
          {whyLabels.join(' · ')}
        </p>
      )}

      <p className="desc" data-testid="card-tagline">
        {setup.tagline}
      </p>

      {setup.tags.length > 0 && (
        <div className="tags">
          {setup.tags.map((tag) => (
            <span
              key={tag}
              className="tag"
              style={{ background: 'rgba(255,255,255,0.7)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Card meta: upvote count + community author attribution */}
      <div className="meta">
        <span aria-label={upvoteLabel} data-testid="card-upvotes">
          ▲ {upvoteLabel}
        </span>
        {setup.source === 'community' && setup.author && (
          <span data-testid="card-author">
            by{' '}
            {setup.author.length > 20
              ? `${setup.author.substring(0, 20)}…`
              : setup.author}
          </span>
        )}
      </div>
    </Link>
  );
}
