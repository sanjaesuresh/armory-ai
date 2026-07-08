/**
 * Dashboard selection logic — pure functions, no I/O, no side effects.
 *
 * Consumed by Task 5 (Professionals dashboard) and Task 6 (Developers dashboard).
 * Exact function names and signatures are part of the public API — do not rename.
 */

import type { Setup, SetupKind } from '@/lib/setup/types';
import { isRegistryKind } from '@/lib/setup/types';

// ─── Predicates ───────────────────────────────────────────────────────────────

/**
 * Professional community picks are github-sourced link-out cards tagged with an
 * industry. They belong on the Professionals tab (not Developers) even though
 * they use a registry kind, so both predicates special-case them.
 */
function isProfessionalCommunityPick(setup: Setup): boolean {
  return setup.source === 'github' && setup.industry != null;
}

/**
 * True when the item belongs on the Developers tab:
 *   - any registry kind (agent, skill, harness), or
 *   - kind=setup with tier=advanced,
 *   - EXCEPT professional community picks (github + industry), which go to Professionals.
 */
export function isDeveloperItem(setup: Setup): boolean {
  if (isProfessionalCommunityPick(setup)) return false;
  return isRegistryKind(setup.kind) || (setup.kind === 'setup' && setup.tier === 'advanced');
}

/**
 * True when the item belongs on the Professionals tab:
 *   - kind=setup with tier=core, or
 *   - a github-sourced community pick tagged with an industry.
 */
export function isProfessionalItem(setup: Setup): boolean {
  if (isProfessionalCommunityPick(setup)) return true;
  return setup.kind === 'setup' && setup.tier === 'core';
}

// ─── Shelves ──────────────────────────────────────────────────────────────────

/**
 * "Armory Approved" shelf: items with a non-null featured rank, ordered by
 * featured ascending (rank 1 = highest priority), capped at max.
 * Does not mutate the input array.
 */
export function approvedShelf(items: Setup[], max: number): Setup[] {
  return items
    .filter((s) => s.featured !== null)
    .slice()
    .sort((a, b) => (a.featured as number) - (b.featured as number))
    .slice(0, max);
}

/**
 * "Most Popular" shelf: items not in excludeIds, ordered by upvotes DESC then
 * popularity DESC then name ASC, capped at max.
 * Does not mutate the input array.
 */
export function popularShelf(items: Setup[], max: number, excludeIds: Set<string>): Setup[] {
  return items
    .filter((s) => !excludeIds.has(s.id))
    .slice()
    .sort((a, b) => {
      const upvotesDiff = b.upvotes - a.upvotes;
      if (upvotesDiff !== 0) return upvotesDiff;
      const popDiff = (b.popularity ?? 0) - (a.popularity ?? 0);
      if (popDiff !== 0) return popDiff;
      return a.name.localeCompare(b.name);
    })
    .slice(0, max);
}

// ─── Filter ───────────────────────────────────────────────────────────────────

export interface FilterCriteria {
  /** Case-insensitive substring matched against name, tagline, description, and tags. */
  query?: string;
  /** Exact category match. */
  category?: string;
  /** Exact kind match. */
  kind?: SetupKind;
  /** Exact source match. */
  source?: Setup['source'];
}

/**
 * Filter items conjunctively: all provided criteria must match.
 * Mirrors the fields the current browse search uses (name, tagline, description, tags).
 * Does not mutate the input array.
 */
export function filterList(items: Setup[], criteria: FilterCriteria): Setup[] {
  const { query, category, kind, source } = criteria;
  const q = query?.toLowerCase();

  return items.filter((s) => {
    if (q) {
      const matchesName = s.name.toLowerCase().includes(q);
      const matchesTagline = s.tagline.toLowerCase().includes(q);
      const matchesDescription = s.description.toLowerCase().includes(q);
      const matchesTags = s.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchesName && !matchesTagline && !matchesDescription && !matchesTags) {
        return false;
      }
    }
    if (category !== undefined && s.category !== category) return false;
    if (kind !== undefined && s.kind !== kind) return false;
    if (source !== undefined && s.source !== source) return false;
    return true;
  });
}

// ─── Sort ─────────────────────────────────────────────────────────────────────

export type SortKey = 'popularity' | 'upvotes' | 'recency';

/**
 * Sort a copy of items by the given key.
 * - popularity: popularity DESC, upvotes DESC, name ASC
 * - upvotes: upvotes DESC, name ASC
 * - recency: updatedAt DESC
 * Does not mutate the input array.
 */
export function sortList(items: Setup[], key: SortKey): Setup[] {
  return items.slice().sort((a, b) => {
    switch (key) {
      case 'popularity': {
        const popDiff = (b.popularity ?? 0) - (a.popularity ?? 0);
        if (popDiff !== 0) return popDiff;
        // github stars are the only broadly-varying popularity signal pre-launch
        // (upvotes/popularity are all 0), so they drive the visible ordering.
        const starDiff = (b.githubStars ?? 0) - (a.githubStars ?? 0);
        if (starDiff !== 0) return starDiff;
        const upvotesDiff = b.upvotes - a.upvotes;
        if (upvotesDiff !== 0) return upvotesDiff;
        return a.name.localeCompare(b.name);
      }
      case 'upvotes': {
        const upvotesDiff = b.upvotes - a.upvotes;
        if (upvotesDiff !== 0) return upvotesDiff;
        return a.name.localeCompare(b.name);
      }
      case 'recency': {
        // ISO 8601 strings are lexicographically sortable — no Date parse needed.
        return b.updatedAt.localeCompare(a.updatedAt);
      }
    }
  });
}

// ─── Path helper ──────────────────────────────────────────────────────────────

/**
 * Returns the detail-page path for a catalog item.
 *   - kind=setup  → /setup/[slug]
 *   - registry kinds (agent, skill, harness) → /dev/[slug]
 */
export function detailPathFor(setup: Setup): string {
  if (isRegistryKind(setup.kind)) {
    return `/dev/${setup.slug}`;
  }
  return `/setup/${setup.slug}`;
}
