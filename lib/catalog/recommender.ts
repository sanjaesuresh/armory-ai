/**
 * Recommender-lite: pure, deterministic, no ML, no model calls.
 *
 * recommend(setups, { role, industry }) →
 *   { topPicks: Setup[], remainder: Setup[] }
 *
 * Rules:
 *   - role (a ROLE id, e.g. 'marketing-manager') resolves to a label via ROLES.
 *   - A setup role-matches when setup.role equals that label (case-insensitive).
 *   - industry is a soft boost: matched setups sort before unmatched within the
 *     same ordering tier. Industry is never a filter.
 *   - Ordering within role-matched group:
 *       1. industry-matched first (boost)
 *       2. featured ascending, nulls last
 *       3. name ascending
 *   - topPicks = first 5 of the ordered role-matched list.
 *   - remainder = overflow role-matched (index 5+) + non-role-matched,
 *       ordered by featured ascending (nulls last) then name ascending.
 */

import type { Setup } from '@/lib/setup/types';
import { ROLES } from './roles';

export interface RecommendOptions {
  role: string;
  industry?: string;
}

export interface RecommendResult {
  topPicks: Setup[];
  remainder: Setup[];
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
  const { role: roleId, industry } = options;

  const roleEntry = ROLES.find((r) => r.id === roleId);
  const roleLabel = roleEntry?.label ?? roleId; // fallback: treat id as label

  const roleMatched: Setup[] = [];
  const nonMatched: Setup[] = [];

  for (const setup of setups) {
    if (setup.role.toLowerCase() === roleLabel.toLowerCase()) {
      roleMatched.push(setup);
    } else {
      nonMatched.push(setup);
    }
  }

  // Sort role-matched: industry boost first, then featured asc (nulls last), then name asc.
  roleMatched.sort((a, b) => {
    const aIndustry =
      industry != null && a.industry != null && a.industry.toLowerCase() === industry.toLowerCase();
    const bIndustry =
      industry != null && b.industry != null && b.industry.toLowerCase() === industry.toLowerCase();

    if (aIndustry && !bIndustry) return -1;
    if (!aIndustry && bIndustry) return 1;
    return byFeaturedThenName(a, b);
  });

  const topPicks = roleMatched.slice(0, 5);
  const overflow = roleMatched.slice(5);

  // remainder = overflow + non-matched, ordered by featured asc (nulls last) then name asc.
  const remainder = [...overflow, ...nonMatched].sort(byFeaturedThenName);

  return { topPicks, remainder };
}
