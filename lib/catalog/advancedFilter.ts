/**
 * Advanced-tier visibility filter.
 *
 * Advanced setups are hidden from the core catalog and recommendations by
 * default. This module exposes one pure, testable predicate that is the single
 * source of truth for the display gate (BrowseSetups' matchesFilter calls it).
 * The recommender has a parallel `includeAdvanced` option for its own path.
 */

/**
 * Single-setup predicate. Returns true when the setup should appear in the UI:
 * - core setups are always visible,
 * - advanced setups only when showAdvanced=true.
 */
export function advancedVisible(tier: string, showAdvanced: boolean): boolean {
  return showAdvanced || tier !== 'advanced';
}
