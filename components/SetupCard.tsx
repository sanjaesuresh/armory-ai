import Link from 'next/link';
import type { Setup } from '@/lib/setup/types';
import { getCategoryTint, getSetupIcon } from '@/lib/catalog/categoryUtils';

interface SetupCardProps {
  setup: Setup;
  /**
   * Honest "why" labels for recommended cards (e.g. "Matches your role").
   * Empty/undefined renders nothing — never a fabricated rating or count.
   */
  whyLabels?: string[];
}

export default function SetupCard({ setup, whyLabels }: SetupCardProps) {
  const tint = getCategoryTint(setup.category);
  const icon = getSetupIcon(setup.role, setup.category);

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
        {setup.source === 'curated' && (
          <span
            className="tag"
            style={{ background: 'rgba(255,255,255,0.75)' }}
          >
            Curated
          </span>
        )}
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
    </Link>
  );
}
