/**
 * Unit tests for categoryUtils — pure deterministic helpers.
 * Node environment (no DOM needed).
 */

import { describe, it, expect } from 'vitest';
import { getCategoryTint, getSetupIcon } from '@/lib/catalog/categoryUtils';
import type { Category } from '@/lib/setup/types';

// ─── getCategoryTint ──────────────────────────────────────────────────────────

describe('getCategoryTint', () => {
  it('returns a stable tint for each known category', () => {
    const cases: Array<[Category, string]> = [
      ['marketing',          'tint-butter'],
      ['sales',              'tint-mint'],
      ['customer-support',   'tint-sky'],
      ['operations',         'tint-sage'],
      ['hr',                 'tint-lilac'],
      ['content',            'tint-peach'],
      ['research',           'tint-sky'],
      ['product',            'tint-blush'],
      ['engineering',        'tint-lilac'],
      ['design',             'tint-blush'],
      ['finance',            'tint-sand'],
      ['legal',              'tint-sand'],
      ['education',          'tint-mint'],
      ['writing',            'tint-peach'],
      ['data',               'tint-sky'],
      ['devops',             'tint-sage'],
      ['general',            'tint-butter'],
    ];
    for (const [cat, expected] of cases) {
      expect(getCategoryTint(cat), `category: ${cat}`).toBe(expected);
    }
  });

  it('returns the fallback tint (tint-sand) for an unrecognised category', () => {
    // Cast to Category to satisfy TS; at runtime the ?? branch fires.
    expect(getCategoryTint('totally-unknown' as Category)).toBe('tint-sand');
  });
});

// ─── getSetupIcon ─────────────────────────────────────────────────────────────

describe('getSetupIcon', () => {
  it('returns the role entry icon when the role label matches exactly', () => {
    // 'Marketing Manager' matches ROLES entry with label 'Marketing Manager'.
    expect(getSetupIcon('Marketing Manager', 'marketing')).toBe('📣');
  });

  it('matches role label case-insensitively', () => {
    // Lowercase should still hit the ROLES entry.
    expect(getSetupIcon('marketing manager', 'marketing')).toBe('📣');
    expect(getSetupIcon('RECRUITER', 'hr')).toBe('🔍');
  });

  it('falls back to the category icon when the role is an ID (dash-form, not a label)', () => {
    // 'marketing-manager' ≠ 'marketing manager' — no ROLES match, so the
    // category icon ('📣' for marketing) is returned via the fallback path.
    expect(getSetupIcon('marketing-manager', 'marketing')).toBe('📣');
  });

  it('falls back to the category icon when the role is unrecognised', () => {
    expect(getSetupIcon('unknown-role', 'sales')).toBe('💼');
    expect(getSetupIcon('unknown-role', 'engineering')).toBe('🔧');
  });

  it('returns the final fallback icon (⚙️) for an unknown role AND unknown category', () => {
    // Neither ROLES match nor CATEGORY_ICON match → ?? '⚙️'
    expect(getSetupIcon('unknown-role', 'unknown-category' as Category)).toBe('⚙️');
  });
});
