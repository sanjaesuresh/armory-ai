/**
 * Brief selection — pure, deterministic.
 *
 * selectBriefs picks what the AI-generation pipeline should produce from two
 * real signals: which (role, industry) pairs have demand but no approved setup
 * (gap-fills), and which high-performing approved setups have adjacent roles
 * that aren't yet covered (variations).
 *
 * No model calls, no I/O.  Same inputs → identical output, every time.
 *
 * Role strings must match the id keys in lib/catalog/roles.ts (e.g.
 * 'marketing-manager', not 'Marketing Manager') so RELATED_ROLES lookups work.
 */

import { RELATED_ROLES } from '@/lib/catalog/roles';

// ─── Exported types ───────────────────────────────────────────────────────────

/**
 * A brief tells the generator what setup to author.
 * Discriminated on `kind`; the pipeline task consumes this shape.
 */
export type Brief =
  | {
      kind: 'gap-fill';
      role: string;
      industry: string | null;
      /** Goal-tag ids from lib/catalog/roles.ts GOAL_TAGS associated to the role.
       *  Empty array when no explicit association is defined in roles.ts. */
      goalTags: string[];
    }
  | {
      kind: 'variation';
      role: string;
      industry: string | null;
      goalTags: string[];
      /** Slug of the approved setup this variation is derived from. */
      sourceSlug: string;
      /** What dimension to vary: 'role' means adapt to an adjacent role. */
      vary: 'role' | 'industry';
    };

/**
 * An approved setup projected to the fields needed for brief selection.
 * The caller is responsible for filtering to approved-only rows before passing.
 */
export type CatalogSetup = {
  slug: string;
  /** Role id (e.g. 'marketing-manager') matching ROLES/RELATED_ROLES keys. */
  role: string;
  industry: string | null;
  source: string;
  upvotes: number;
  popularity: number;
};

/**
 * Demand signal for a (role, industry) pair, assembled from export/landing
 * analytics by the operator script.  demand > 0 means real interest.
 */
export type DemandSignal = {
  /** Role id matching ROLES keys. */
  role: string;
  industry: string | null;
  /** Aggregate demand score; only values > 0 produce gap-fill briefs. */
  demand: number;
};

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Normalise industry: treat null and empty string as the same (null).
 * Consistent across CatalogSetup and DemandSignal.
 */
function normIndustry(industry: string | null | undefined): string | null {
  return industry || null;
}

/**
 * Stable string key for a (role, industry) pair used in Set membership tests.
 * Null industry maps to the empty string segment so nulls sort first in industry.
 */
function coverageKey(role: string, industry: string | null): string {
  return `${role}|${industry ?? ''}`;
}

// ─── selectBriefs ─────────────────────────────────────────────────────────────

/**
 * Select up to `count` briefs from approved-catalog + demand-signal data.
 *
 * Output order: gap-fills first (demand desc, role asc, industry asc nulls-first),
 * then variations (source performance desc, slug asc), truncated to `count`.
 *
 * Pure and deterministic — no randomness, no I/O.
 */
export function selectBriefs(input: {
  approvedSetups: CatalogSetup[];
  demand: DemandSignal[];
  count: number;
}): Brief[] {
  const { approvedSetups, demand, count } = input;

  // ── 1. Build coverage set ─────────────────────────────────────────────────
  // Tracks all (role, industry) pairs already served by an approved setup.
  const covered = new Set<string>();
  for (const setup of approvedSetups) {
    covered.add(coverageKey(setup.role, normIndustry(setup.industry)));
  }

  // emitted grows as we emit briefs; initialised from covered so variations
  // never duplicate approved setups or earlier briefs in one call.
  const emitted = new Set<string>(covered);

  // ── 2. Gap-fill briefs ────────────────────────────────────────────────────
  // Keep only positive-demand signals whose pair is not yet covered.
  const candidateDemand = demand
    .filter((d) => d.demand > 0 && !covered.has(coverageKey(d.role, normIndustry(d.industry))))
    .slice() // don't mutate caller's array
    .sort((a, b) => {
      // Primary: demand desc
      if (b.demand !== a.demand) return b.demand - a.demand;
      // Secondary: role asc
      if (a.role !== b.role) return a.role < b.role ? -1 : 1;
      // Tertiary: industry asc, nulls first (null → '' sorts before any non-empty string)
      const ia = normIndustry(a.industry) ?? '';
      const ib = normIndustry(b.industry) ?? '';
      return ia < ib ? -1 : ia > ib ? 1 : 0;
    });

  const gapFills: Brief[] = [];
  for (const d of candidateDemand) {
    const key = coverageKey(d.role, normIndustry(d.industry));
    if (!emitted.has(key)) {
      gapFills.push({
        kind: 'gap-fill',
        role: d.role,
        industry: normIndustry(d.industry),
        // roles.ts defines no explicit role→tag association; keep empty rather than invent.
        goalTags: [],
      });
      emitted.add(key);
    }
  }

  // ── 3. Variation briefs ───────────────────────────────────────────────────
  // Source setups ordered by performance (upvotes + popularity) desc, slug asc.
  const sortedSources = approvedSetups.slice().sort((a, b) => {
    const pa = (a.upvotes ?? 0) + (a.popularity ?? 0);
    const pb = (b.upvotes ?? 0) + (b.popularity ?? 0);
    if (pb !== pa) return pb - pa;
    return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0;
  });

  const variations: Brief[] = [];
  for (const source of sortedSources) {
    const adjacentRoles = RELATED_ROLES[source.role] ?? [];
    for (const adjacentRole of adjacentRoles) {
      const key = coverageKey(adjacentRole, normIndustry(source.industry));
      if (!emitted.has(key)) {
        variations.push({
          kind: 'variation',
          role: adjacentRole,
          industry: normIndustry(source.industry),
          goalTags: [],
          sourceSlug: source.slug,
          vary: 'role',
        });
        emitted.add(key);
        break; // one variation per source setup
      }
    }
  }

  // ── 4. Concatenate (gap-fills first) and cap ─────────────────────────────
  return [...gapFills, ...variations].slice(0, count);
}
