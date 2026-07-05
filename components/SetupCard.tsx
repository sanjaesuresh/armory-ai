import Link from 'next/link';
import type { Setup } from '@/lib/setup/types';
import { getCategoryTint, getSetupIcon } from '@/lib/catalog/categoryUtils';
import PlugIcon from './icons/PlugIcon';
import KindBadge from './KindBadge';

interface SetupCardProps {
  setup: Setup;
  /**
   * Honest "why" labels for recommended cards (e.g. "Matches your role").
   * Empty/undefined renders nothing — never a fabricated rating or count.
   */
  whyLabels?: string[];
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

export default function SetupCard({ setup, whyLabels }: SetupCardProps) {
  const tint = getCategoryTint(setup.category);
  const icon = getSetupIcon(setup.role, setup.category);

  const upvoteLabel = `${setup.upvotes} ${setup.upvotes === 1 ? 'upvote' : 'upvotes'}`;

  return (
    <Link
      href={`/setup/${setup.slug}`}
      className={`setup-card ${tint}`}
      data-testid={`setup-card-${setup.slug}`}
    >
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
              Community
            </span>
          ) : setup.source === 'ai-generated' ? (
            <span className="badge badge-ai" data-testid="badge-ai">
              AI-generated
            </span>
          ) : null}

          {setup.tier === 'advanced' && (
            <span className="badge badge-advanced" data-testid="badge-advanced">
              <PlugIcon />
              Advanced
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
