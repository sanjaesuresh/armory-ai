/**
 * Tests for advancedVisible() — the pure advanced-tier display predicate used by
 * BrowseSetups' matchesFilter (the single source of truth for the catalog gate).
 */

import { describe, it, expect } from 'vitest';
import { advancedVisible } from './advancedFilter';

describe('advancedVisible', () => {
  it('hides an advanced-tier setup when showAdvanced=false (the default)', () => {
    expect(advancedVisible('advanced', false)).toBe(false);
  });

  it('shows an advanced-tier setup when showAdvanced=true (opted in)', () => {
    expect(advancedVisible('advanced', true)).toBe(true);
  });

  it('always shows a core-tier setup regardless of showAdvanced', () => {
    expect(advancedVisible('core', false)).toBe(true);
    expect(advancedVisible('core', true)).toBe(true);
  });
});
