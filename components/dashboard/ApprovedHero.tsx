/**
 * ApprovedHero — rich hero card for the #1 Armory-Approved or Most Popular item.
 *
 * Test-contract:
 *   - data-testid="setup-card-{slug}" on the card Link (matches e2e + vitest assertions).
 *   - data-testid="card-name" on the name heading.
 *   - data-testid="card-tagline" on the tagline paragraph.
 */

import Link from 'next/link';
import type { Category, Setup } from '@/lib/setup/types';
import { isRegistryKind } from '@/lib/setup/types';
import { getCategoryAccent, getCategoryLabel } from '@/lib/catalog/categoryUtils';
import { detailPathFor } from '@/lib/catalog/dashboard';
import CategoryIcon from '@/components/icons/CategoryIcon';
import KindIcon from '@/components/icons/KindIcon';

type Variant = 'developers' | 'professionals';

interface ApprovedHeroProps {
  setup: Setup;
  variant: Variant;
  /** True when the hero is from the approvedShelf (has a featured rank). */
  isApproved: boolean;
}

// ── Source label ─────────────────────────────────────────────────────────────

function sourceBadge(source: Setup['source']): { text: string; cls: string } | null {
  if (source === 'curated') return { text: 'Reviewed', cls: 'hero-src-cur' };
  if (source === 'ai-generated') return { text: 'AI-gen', cls: 'hero-src-ai' };
  if (source === 'github') return { text: 'Community pick', cls: 'hero-src-com' };
  if (source === 'community') return { text: 'Member post', cls: 'hero-src-com' };
  return null;
}

// ── ApprovedHero ─────────────────────────────────────────────────────────────

export default function ApprovedHero({
  setup,
  variant,
  isApproved,
}: ApprovedHeroProps) {
  const href = detailPathFor(setup);
  const isDev = variant === 'developers';
  const accent = getCategoryAccent(setup.category as Category);
  const catLabel = getCategoryLabel(setup.category);
  const fieldCount = setup.variables?.length ?? 0;
  const badge = sourceBadge(setup.source);
  const ctaLabel = isDev ? 'View tool' : 'Use this setup';

  return (
    <Link
      href={href}
      className="approved-hero"
      data-testid={`setup-card-${setup.slug}`}
    >
      {/* Top row: icon badge + category label + approved/popular badge */}
      <div className="approved-hero-top">
        <div
          className="approved-hero-icon"
          style={{ color: accent, borderColor: accent }}
          aria-hidden="true"
        >
          {isDev || isRegistryKind(setup.kind)
            ? <KindIcon kind={setup.kind} size={22} />
            : <CategoryIcon category={setup.category as Category} size={22} />}
        </div>
        <div className="approved-hero-meta">
          <span className="approved-hero-cat" style={{ color: accent }}>
            {catLabel}
          </span>
          <span
            className={
              isApproved
                ? 'approved-hero-stamp approved-hero-stamp--approved'
                : 'approved-hero-stamp approved-hero-stamp--popular'
            }
          >
            {isApproved ? 'Armory Approved' : '#1 this week'}
          </span>
        </div>
      </div>

      {/* Name */}
      <h3 className="approved-hero-name" data-testid="card-name">
        {setup.name}
      </h3>

      {/* Tagline */}
      <p className="approved-hero-tagline" data-testid="card-tagline">
        {setup.tagline}
      </p>

      {/* Stats row */}
      <div className="approved-hero-stats">
        {setup.upvotes > 0 && (
          <span className="approved-hero-stat" aria-label={`${setup.upvotes} upvotes`}>
            ▲<strong>{setup.upvotes}</strong>
          </span>
        )}
        {fieldCount > 0 && (
          <span className="approved-hero-stat">
            <strong>{fieldCount}</strong>&nbsp;{fieldCount === 1 ? 'field' : 'fields'}
          </span>
        )}
        {badge && (
          <span className={`approved-hero-src ${badge.cls}`}>{badge.text}</span>
        )}
      </div>

      {/* CTA */}
      <span className="approved-hero-cta" aria-hidden="true">
        {ctaLabel}&nbsp;→
      </span>
    </Link>
  );
}
