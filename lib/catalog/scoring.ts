/**
 * Pure scored recommender logic for Armory.
 *
 * scoreSetup(setup, userInputs, signals, weights) → { score, reasons }
 * buildWhyLabels(reasons, signals) → string[]  (at most 2 plain-language fragments)
 *
 * Deterministic — no clock reads, no side effects.
 * Time is injected via signals.now so tests can pin it.
 */

import type { Setup } from '@/lib/setup/types';
import { ROLES, RELATED_ROLES } from './roles';
import { type Weights, FRESHNESS_WINDOW_DAYS } from './weights';

// ─── ReasonCode ───────────────────────────────────────────────────────────────

/**
 * Machine-readable reason codes returned by scoreSetup.
 *
 * 'tag-overlap:N' encodes the shared-tag count N inline so label builders
 * can read it without a separate field.
 */
export type ReasonCode =
  | 'role-exact'
  | 'role-related'
  | 'industry'
  | `tag-overlap:${number}`
  | 'popular'
  | 'fresh';

// ─── UserInputs ───────────────────────────────────────────────────────────────

export interface UserInputs {
  /** ROLES id, e.g. 'marketing-manager'. */
  role: string;
  /** Optional industry string (case-insensitive match). */
  industry?: string;
  /** Optional list of selected goal-tag ids from GOAL_TAGS. */
  goalTagIds?: string[];
}

// ─── Signals ─────────────────────────────────────────────────────────────────

export interface Signals {
  /**
   * Real popularity count (e.g. 30-day export-event count).
   * Injected by the caller — the scorer never reads it off the Setup.
   */
  popularity: number;
  /** Injected current time for deterministic freshness scoring. */
  now: Date | number;
}

// ─── ScoreResult ─────────────────────────────────────────────────────────────

export interface ScoreResult {
  score: number;
  reasons: ReasonCode[];
}

// ─── Helper: resolve role label from id ──────────────────────────────────────

function resolveRoleLabel(roleId: string): string {
  const entry = ROLES.find((r) => r.id === roleId);
  return entry?.label ?? roleId;
}

// ─── scoreSetup ──────────────────────────────────────────────────────────────

/**
 * Pure scorer: returns a numeric score and a list of reason codes.
 *
 * Score components:
 *   exact role match         → weights.exactRole
 *   related role match       → weights.relatedRole
 *   industry match           → weights.industryBonus
 *   per shared goal tag      → weights.tagCredit * overlapCount
 *   popularity (log-dampened)→ weights.popularityMultiplier * Math.log1p(popularity)
 *   freshness (linear decay) → weights.freshnessBump * (1 - daysSinceUpdate / 90), clamped [0,1]
 */
export function scoreSetup(
  setup: Setup,
  inputs: UserInputs,
  signals: Signals,
  weights: Weights,
): ScoreResult {
  let score = 0;
  const reasons: ReasonCode[] = [];

  // ── Role match ──────────────────────────────────────────────────────────
  const roleLabel = resolveRoleLabel(inputs.role).toLowerCase();
  const setupRole = setup.role.toLowerCase();

  if (setupRole === roleLabel) {
    score += weights.exactRole;
    reasons.push('role-exact');
  } else {
    const related = RELATED_ROLES[inputs.role] ?? [];
    // Find the setup's role id by matching its label against ROLES
    const setupRoleEntry = ROLES.find((r) => r.label.toLowerCase() === setupRole);
    if (setupRoleEntry && related.includes(setupRoleEntry.id)) {
      score += weights.relatedRole;
      reasons.push('role-related');
    }
  }

  // ── Industry bonus ──────────────────────────────────────────────────────
  if (
    inputs.industry != null &&
    setup.industry != null &&
    setup.industry.toLowerCase() === inputs.industry.toLowerCase()
  ) {
    score += weights.industryBonus;
    reasons.push('industry');
  }

  // ── Tag overlap ─────────────────────────────────────────────────────────
  if (inputs.goalTagIds && inputs.goalTagIds.length > 0) {
    const selectedSet = new Set(inputs.goalTagIds.map((t) => t.toLowerCase()));
    const overlap = setup.tags.filter((t) => selectedSet.has(t.toLowerCase())).length;
    if (overlap > 0) {
      score += weights.tagCredit * overlap;
      reasons.push(`tag-overlap:${overlap}`);
    }
  }

  // ── Popularity (log-dampened) ───────────────────────────────────────────
  if (signals.popularity > 0) {
    score += weights.popularityMultiplier * Math.log1p(signals.popularity);
    reasons.push('popular');
  }

  // ── Freshness (linear decay over FRESHNESS_WINDOW_DAYS) ────────────────
  const nowMs = signals.now instanceof Date ? signals.now.getTime() : signals.now;
  const updatedMs = new Date(setup.updatedAt).getTime();
  const daysSince = (nowMs - updatedMs) / (1000 * 60 * 60 * 24);
  const freshnessRatio = Math.max(0, 1 - daysSince / FRESHNESS_WINDOW_DAYS);

  if (freshnessRatio > 0) {
    score += weights.freshnessBump * freshnessRatio;
    reasons.push('fresh');
  }

  return { score, reasons };
}

// ─── buildWhyLabels ───────────────────────────────────────────────────────────

/**
 * Context object for the label builder — mirrors the scorer's signals that
 * affect whether a label should be suppressed.
 */
export interface LabelContext {
  popularity: number;
  role: string;
}

/**
 * Turns reason codes into at most two plain-language label fragments,
 * highest-weight reasons first.
 *
 * Suppression rules (Section 4's "honest-only" caveat):
 *   - 'popular' label only when popularity > 0
 *   - 'fresh' label only when the 'fresh' code is present
 *   - role labels are honest about the relation
 *   - featured ordering is never labelled
 */
export function buildWhyLabels(reasons: ReasonCode[], ctx: LabelContext): string[] {
  const labels: string[] = [];

  // Process in weight-descending order: role > industry > tags > popular > fresh
  // Role
  if (reasons.includes('role-exact')) {
    labels.push('Matches your role');
  } else if (reasons.includes('role-related')) {
    labels.push('Close to your role');
  }

  if (labels.length >= 2) return labels.slice(0, 2);

  // Industry is intentionally not surfaced as a label (it's a boost, not a differentiator
  // that users need explained).

  // Tags — emit only when something meaningful to show, skip for brevity vs role clarity
  // (Tag labels would say "2 shared interests" etc. but are lower-priority than popularity
  //  for a 2-label cap; popular is more immediately meaningful to users.)

  // Popular
  if (reasons.includes('popular') && ctx.popularity > 0) {
    labels.push('Popular');
  }

  if (labels.length >= 2) return labels.slice(0, 2);

  // Fresh
  if (reasons.includes('fresh')) {
    labels.push('Recently updated');
  }

  return labels.slice(0, 2);
}
