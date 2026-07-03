/**
 * Recommender — scored ranking.
 *
 * recommend(setups, options) → { topPicks, remainder, whyLabels, fallback }
 *
 * Algorithm:
 *   1. Filter out target-incompatible setups when options.target is provided.
 *   2. Score every remaining setup with scoreSetup (pure, deterministic).
 *   3. If bestScore < MIN_SCORE_THRESHOLD → niche-role fallback:
 *        topPicks = most popular setups (popularity > 0) ordered by popularity
 *        desc then byFeaturedThenName; fallback = true; whyLabels = {}.
 *   4. Otherwise → topPicks = first 5 setups with score > 0 ordered by score
 *        desc, ties broken by featured asc (nulls last) then name asc.
 *        remainder = all non-topPick eligible setups ordered by byFeaturedThenName.
 *        whyLabels = honest labels per topPick id via buildWhyLabels.
 *
 * Preserves Phase 1 guarantees:
 *   - At most 5 topPicks.
 *   - Ties deterministically broken by byFeaturedThenName (featured asc, nulls
 *     last, then name asc) — same inputs always produce the same ordering.
 *   - Target compatibility is a filter, never a score penalty.
 *   - Industry is never a hard filter — only a soft score boost.
 */

import type { Setup, ExportTarget } from '@/lib/setup/types';
import { scoreSetup, buildWhyLabels } from './scoring';
import type { UserInputs, Signals } from './scoring';
import { DEFAULT_WEIGHTS, MIN_SCORE_THRESHOLD } from './weights';

export interface RecommendOptions {
  role: string;
  industry?: string;
  /** Optional goal-tag ids from GOAL_TAGS; passed to the scorer for tag-overlap credit. */
  goalTagIds?: string[];
  /** When provided, setups whose targets[] don't include this value are removed entirely. */
  target?: ExportTarget;
  /**
   * Injected current time for deterministic freshness scoring.
   * Defaults to Date.now() when absent.
   */
  now?: number | Date;
}

export interface RecommendResult {
  topPicks: Setup[];
  remainder: Setup[];
  /**
   * Honest "why" labels per topPick id (built via buildWhyLabels).
   * Empty array when the topPick has no labelled signal.
   * Empty map ({}) in fallback mode — nothing honest to claim.
   */
  whyLabels: Record<string, string[]>;
  /**
   * True when no setup cleared MIN_SCORE_THRESHOLD and topPicks shows popular
   * setups instead of tailored picks.
   */
  fallback: boolean;
}

/** Comparator: featured ascending (nulls last), then name ascending. */
function byFeaturedThenName(a: Setup, b: Setup): number {
  const fa = a.featured;
  const fb = b.featured;

  if (fa === null && fb === null) return a.name.localeCompare(b.name);
  if (fa === null) return 1;
  if (fb === null) return -1;
  if (fa !== fb) return fa - fb;
  return a.name.localeCompare(b.name);
}

export function recommend(setups: Setup[], options: RecommendOptions): RecommendResult {
  const { role: roleId, industry, goalTagIds, target, now: injectedNow } = options;

  // ── 1. Target filter ──────────────────────────────────────────────────────
  const eligible =
    target != null ? setups.filter((s) => s.targets.includes(target)) : setups;

  // ── 2. Resolve current time ───────────────────────────────────────────────
  const nowMs =
    injectedNow != null
      ? injectedNow instanceof Date
        ? injectedNow.getTime()
        : injectedNow
      : Date.now();

  // ── 3. Score every eligible setup ─────────────────────────────────────────
  const inputs: UserInputs = { role: roleId, industry, goalTagIds };

  const scored = eligible.map((setup) => {
    const signals: Signals = { popularity: setup.popularity ?? 0, now: nowMs };
    const { score, reasons } = scoreSetup(setup, inputs, signals, DEFAULT_WEIGHTS);
    return { setup, score, reasons };
  });

  // ── 4. Find best score ────────────────────────────────────────────────────
  const bestScore = scored.length > 0 ? Math.max(...scored.map(({ score }) => score)) : 0;

  // ── 5. Niche-role fallback ────────────────────────────────────────────────
  if (bestScore < MIN_SCORE_THRESHOLD) {
    // No setup cleared the threshold — show popular setups instead.
    // Only setups with real popularity signal (> 0) appear in topPicks;
    // nothing honest to claim as "why", so whyLabels = {}.
    const popularPool = eligible
      .filter((s) => (s.popularity ?? 0) > 0)
      .slice()
      .sort((a, b) => {
        const pd = (b.popularity ?? 0) - (a.popularity ?? 0);
        if (pd !== 0) return pd;
        return byFeaturedThenName(a, b);
      });

    const topPicks = popularPool.slice(0, 5);
    const topPickIds = new Set(topPicks.map((s) => s.id));
    const remainder = eligible.filter((s) => !topPickIds.has(s.id)).sort(byFeaturedThenName);

    return { topPicks, remainder, whyLabels: {}, fallback: true };
  }

  // ── 6. Sort by score desc, ties broken by byFeaturedThenName ─────────────
  const sortedScored = scored.slice().sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return byFeaturedThenName(a.setup, b.setup);
  });

  // ── 7. topPicks = first 5 with score > 0 ─────────────────────────────────
  // Score > 0 ensures only setups with a real signal (role, industry, tags,
  // popularity, or freshness) appear as recommendations.
  const topPickItems = sortedScored.filter(({ score }) => score > 0).slice(0, 5);
  const topPicks = topPickItems.map(({ setup }) => setup);

  // ── 8. remainder = non-topPick eligible setups, sorted by byFeaturedThenName
  const topPickIds = new Set(topPicks.map((s) => s.id));
  const remainder = eligible
    .filter((s) => !topPickIds.has(s.id))
    .slice()
    .sort(byFeaturedThenName);

  // ── 9. whyLabels for each topPick ─────────────────────────────────────────
  const whyLabels: Record<string, string[]> = {};
  for (const { setup, reasons } of topPickItems) {
    whyLabels[setup.id] = buildWhyLabels(reasons, {
      popularity: setup.popularity ?? 0,
      role: roleId,
    });
  }

  return { topPicks, remainder, whyLabels, fallback: false };
}
