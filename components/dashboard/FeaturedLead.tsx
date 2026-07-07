/**
 * FeaturedLead — the "Most equipped this week" section at the top of the
 * browse screen. Renders one rich hero entry and up to two runner-up entries.
 *
 * Data rules:
 *   - Hero   = approved[0] when present; otherwise popular[0] (fallback so the
 *              hero slot is never empty when any data exists).
 *   - Runners = up to 2 items from popular that are NOT the hero.
 *              When approved provides the hero, runners = popular[0..1].
 *              When popular provides the hero, runners = popular[1..2].
 *
 * Test-contract note: the outer containers keep the `data-testid` values
 * ("shelf-approved", "shelf-popular") and each card keeps `data-testid=
 * "setup-card-{slug}"` so existing vitest and Playwright specs continue to
 * locate them. The card elements are <Link> (i.e. <a href>), matching the
 * assertion `card.toHaveAttribute('href', ...)`.
 */

import Link from 'next/link';
import type { Setup } from '@/lib/setup/types';
import { getCategoryAccent, getCategoryLabel } from '@/lib/catalog/categoryUtils';
import { detailPathFor } from '@/lib/catalog/dashboard';

// ── Source label helpers ─────────────────────────────────────────────────────

function heroSourceLabel(source: Setup['source']): string {
  if (source === 'curated') return 'reviewed';
  if (source === 'ai-generated') return 'AI-gen';
  if (source === 'github') return 'community pick';
  if (source === 'community') return 'community';
  return '';
}

function runnerSourceLabel(source: Setup['source']): string {
  if (source === 'curated') return 'reviewed';
  if (source === 'ai-generated') return 'AI-generated';
  if (source === 'community') return 'Member post';
  if (source === 'github') return 'community pick';
  return '';
}

// ── Hero card (singular, richest treatment) ──────────────────────────────────

function HeroCard({ setup, rank }: { setup: Setup; rank: number }) {
  const dot = getCategoryAccent(setup.category);
  const catLabel = getCategoryLabel(setup.category);
  const src = heroSourceLabel(setup.source);
  const fieldCount = setup.variables?.length ?? 0;
  const href = detailPathFor(setup);

  return (
    <Link
      href={href}
      className="feat-hero"
      data-testid={`setup-card-${setup.slug}`}
    >
      <div className="feat-kick">
        <span className="feat-dot" style={{ background: dot }} aria-hidden="true" />
        <span>{catLabel}</span>
        {rank > 0 && (
          <span className="feat-rank" aria-label={`Rank ${rank} this week`}>
            · #{rank} this week
          </span>
        )}
      </div>

      <h3 data-testid="card-name">{setup.name}</h3>

      <p className="feat-tagline" data-testid="card-tagline">
        {setup.tagline}
      </p>

      <div className="feat-base">
        <span className="feat-stat">
          {fieldCount > 0 && <><b>{fieldCount}</b>{' fields · '}</>}
          {setup.upvotes > 0 && <><b>▲{setup.upvotes}</b>{' · '}</>}
          {src}
        </span>
      </div>
    </Link>
  );
}

// ── Runner-up card (lighter, stacked in the right column) ────────────────────

function RunnerCard({ setup, rank }: { setup: Setup; rank: number }) {
  const dot = getCategoryAccent(setup.category);
  const catLabel = getCategoryLabel(setup.category);
  const src = runnerSourceLabel(setup.source);
  const kindLabel = setup.kind.charAt(0).toUpperCase() + setup.kind.slice(1);
  const fieldCount = setup.variables?.length ?? 0;
  const href = detailPathFor(setup);

  const metaParts = [
    kindLabel,
    fieldCount > 0 ? `${fieldCount}f` : null,
    setup.upvotes > 0 ? `▲${setup.upvotes}` : null,
    src || null,
  ].filter(Boolean);

  return (
    <Link
      href={href}
      className="feat-runner"
      data-testid={`setup-card-${setup.slug}`}
    >
      <div className="feat-runner-kick">
        <span className="feat-runner-dot" style={{ background: dot }} aria-hidden="true" />
        <span>{catLabel}</span>
        {rank > 0 && (
          <span className="feat-rank" aria-label={`Rank ${rank} this week`}>
            · #{rank}
          </span>
        )}
      </div>

      <h4 data-testid="card-name">{setup.name}</h4>
      <p data-testid="card-tagline">{setup.tagline}</p>

      <div className="feat-runner-meta" aria-label="Setup metadata">
        {metaParts.join(' · ')}
      </div>
    </Link>
  );
}

// ── FeaturedLead ─────────────────────────────────────────────────────────────

interface FeaturedLeadProps {
  /** Items from approvedShelf — empty when no featured items seeded. */
  approved: Setup[];
  /**
   * Items from popularShelf (excludes the approved set). Caller must pass up to
   * 3 items so that when approved is empty, popular[0] becomes the hero and
   * popular[1..2] are still available as runners.
   */
  popular: Setup[];
}

/**
 * Renders the "Most equipped this week" editorial section.
 *
 * Layout: one hero card (leftmost, 1.65fr) + up to two runner cards (right
 * column, 1fr).
 *
 * The hero slot is ALWAYS filled when any data is available:
 *   - approved[0] is preferred when present.
 *   - popular[0] is the fallback when approved is empty.
 *
 * Runners are drawn from popular, skipping whichever item became hero.
 *
 * Test IDs:
 *   - shelf-approved  wraps the hero container (always present when data exists).
 *   - shelf-popular   wraps the runners container.
 *   - setup-card-{slug} on each card element.
 */
export default function FeaturedLead({ approved, popular }: FeaturedLeadProps) {
  // Hero: prefer approved[0]; fall back to popular[0] so the hero slot is never
  // blank when there is any data at all.
  const heroFromApproved = approved[0] != null;
  const heroSetup = approved[0] ?? popular[0] ?? null;

  // Runners: items that are NOT the hero.
  // When approved supplies the hero, popular[0..1] are the runners (popular
  // already excludes approved items via excludeIds in DashboardView).
  // When popular supplies the hero (popular[0]), runners are popular[1..2].
  const runnersSetup = heroFromApproved
    ? popular.slice(0, 2)
    : popular.slice(1, 3);

  // Nothing to show at all (empty catalog)
  if (!heroSetup && runnersSetup.length === 0) return null;

  return (
    <>
      <div className="featured-leadhead">
        <h2>Most equipped this week</h2>
        <span className="feat-meta-note">what people are actually equipping</span>
      </div>

      <div className="featured-lead">
        {/* Hero column — always present when heroSetup is non-null */}
        {heroSetup && (
          <div data-testid="shelf-approved">
            <HeroCard setup={heroSetup} rank={1} />
          </div>
        )}

        {/* Runners column */}
        {runnersSetup.length > 0 && (
          <div className="feat-runners" data-testid="shelf-popular">
            {runnersSetup.map((s, i) => (
              <RunnerCard key={s.slug} setup={s} rank={i + 2} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
