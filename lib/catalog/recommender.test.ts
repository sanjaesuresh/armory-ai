/**
 * Tests for ROLES and recommend().
 *
 * Test data is built inline to keep the tests self-contained.
 * marketingManagerSetup is reused where convenient.
 */

import { describe, it, expect } from 'vitest';
import { ROLES } from './roles';
import { recommend } from './recommender';
import type { Setup } from '@/lib/setup/types';
import { marketingManagerSetup } from '@/data/curated/marketing-manager';

// ─── Inline fixture factory ───────────────────────────────────────────────────

function makeSetup(overrides: Partial<Setup> & { id: string; name: string; role: string }): Setup {
  return {
    slug: overrides.id,
    tagline: 'Test setup',
    description: 'Test description',
    industry: null,
    tags: [],
    category: 'general',
    source: 'curated',
    author: null,
    version: '1.0.0',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    targets: ['claude-app'],
    tier: 'core',
    instructionTemplate: 'You are a helpful assistant.',
    variables: [],
    knowledgeFiles: [],
    scenarios: [],
    ...overrides,
  };
}

// Six Marketing Manager setups to prove the cap of 5
const mm1 = makeSetup({ id: 'mm-1', name: 'Alpha', role: 'Marketing Manager', featured: 1 });
const mm2 = makeSetup({ id: 'mm-2', name: 'Bravo', role: 'Marketing Manager', featured: 2 });
const mm3 = makeSetup({ id: 'mm-3', name: 'Charlie', role: 'Marketing Manager', featured: 3 });
const mm4 = makeSetup({ id: 'mm-4', name: 'Delta', role: 'Marketing Manager', featured: null });
const mm5 = makeSetup({ id: 'mm-5', name: 'Echo', role: 'Marketing Manager', featured: null });
const mm6 = makeSetup({ id: 'mm-6', name: 'Foxtrot', role: 'Marketing Manager', featured: null });

// A non-role-matched setup
const otherSetup = makeSetup({ id: 'other-1', name: 'Other Setup', role: 'Recruiter', featured: 1 });

// ─── ROLES ───────────────────────────────────────────────────────────────────

describe('ROLES', () => {
  it('has between 6 and 8 entries', () => {
    expect(ROLES.length).toBeGreaterThanOrEqual(6);
    expect(ROLES.length).toBeLessThanOrEqual(8);
  });

  it('each entry has id, label, description, and icon', () => {
    for (const role of ROLES) {
      expect(typeof role.id).toBe('string');
      expect(role.id.length).toBeGreaterThan(0);
      expect(typeof role.label).toBe('string');
      expect(role.label.length).toBeGreaterThan(0);
      expect(typeof role.description).toBe('string');
      expect(role.description.length).toBeGreaterThan(0);
      expect(typeof role.icon).toBe('string');
      expect(role.icon.length).toBeGreaterThan(0);
    }
  });

  it('ids are kebab-case', () => {
    for (const role of ROLES) {
      expect(role.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('includes a marketing-manager entry', () => {
    const found = ROLES.find((r) => r.id === 'marketing-manager');
    expect(found).toBeDefined();
    expect(found?.label).toBe('Marketing Manager');
  });
});

// ─── recommend ───────────────────────────────────────────────────────────────

describe('recommend', () => {
  it('returns at most 5 top picks', () => {
    const setups = [mm1, mm2, mm3, mm4, mm5, mm6];
    const { topPicks } = recommend(setups, { role: 'marketing-manager' });
    expect(topPicks.length).toBeLessThanOrEqual(5);
    expect(topPicks.length).toBe(5);
  });

  it('role match is required for top picks', () => {
    const setups = [mm1, otherSetup];
    const { topPicks, remainder } = recommend(setups, { role: 'marketing-manager' });
    // mm1 matches, otherSetup does not
    expect(topPicks).toContain(mm1);
    expect(topPicks).not.toContain(otherSetup);
    expect(remainder).toContain(otherSetup);
  });

  it('overflow role-matched setups go into remainder', () => {
    const setups = [mm1, mm2, mm3, mm4, mm5, mm6];
    const { topPicks, remainder } = recommend(setups, { role: 'marketing-manager' });
    expect(topPicks.length).toBe(5);
    expect(remainder.length).toBe(1);
    // All 6 accounted for
    expect([...topPicks, ...remainder].length).toBe(6);
  });

  it('industry match boosts ordering but never removes a role-matched setup', () => {
    // mm-industry matches both role and industry; mm-generic matches role only
    const mmIndustry = makeSetup({
      id: 'mm-industry',
      name: 'Industry Match',
      role: 'Marketing Manager',
      industry: 'SaaS',
      featured: null,
    });
    const mmGeneric = makeSetup({
      id: 'mm-generic',
      name: 'AAA Generic', // sorts first alphabetically to ensure boost, not name, drives order
      role: 'Marketing Manager',
      industry: null,
      featured: null,
    });

    const { topPicks } = recommend([mmGeneric, mmIndustry], {
      role: 'marketing-manager',
      industry: 'SaaS',
    });

    // Both should appear (never filtered out)
    expect(topPicks).toContain(mmGeneric);
    expect(topPicks).toContain(mmIndustry);

    // Industry match should rank first
    expect(topPicks.indexOf(mmIndustry)).toBeLessThan(topPicks.indexOf(mmGeneric));
  });

  it('ties break by featured (ascending, nulls last) then name (ascending) deterministically', () => {
    // Three setups same role, no industry: featured 2, null, 1 → expect order: 1, 2, null
    const a = makeSetup({ id: 'tie-a', name: 'Alpha', role: 'Marketing Manager', featured: 2 });
    const b = makeSetup({ id: 'tie-b', name: 'Beta', role: 'Marketing Manager', featured: null });
    const c = makeSetup({ id: 'tie-c', name: 'Gamma', role: 'Marketing Manager', featured: 1 });

    const { topPicks } = recommend([a, b, c], { role: 'marketing-manager' });
    expect(topPicks.map((s) => s.id)).toEqual(['tie-c', 'tie-a', 'tie-b']);
  });

  it('within same featured value, name sorts ascending', () => {
    const x = makeSetup({ id: 'name-x', name: 'Zebra', role: 'Marketing Manager', featured: 1 });
    const y = makeSetup({ id: 'name-y', name: 'Apple', role: 'Marketing Manager', featured: 1 });

    const { topPicks } = recommend([x, y], { role: 'marketing-manager' });
    expect(topPicks[0].id).toBe('name-y'); // Apple before Zebra
    expect(topPicks[1].id).toBe('name-x');
  });

  it('remainder is ordered by featured (ascending, nulls last) then name (ascending)', () => {
    // Fill 5 top picks with mm1–mm5, overflow is mm6
    // Plus a non-role-matched setup to appear in remainder too
    const otherFeatured2 = makeSetup({ id: 'other-f2', name: 'Zeta', role: 'Recruiter', featured: 2 });
    const otherNullName = makeSetup({ id: 'other-null', name: 'Alpha', role: 'Recruiter', featured: null });

    const { remainder } = recommend([mm1, mm2, mm3, mm4, mm5, mm6, otherFeatured2, otherNullName], {
      role: 'marketing-manager',
    });

    // mm6 has featured=null, name='Foxtrot'
    // otherFeatured2 has featured=2, name='Zeta'
    // otherNullName has featured=null, name='Alpha'
    // expected order: otherFeatured2 (2), otherNullName (null, Alpha), mm6 (null, Foxtrot)
    expect(remainder.map((s) => s.id)).toEqual(['other-f2', 'other-null', 'mm-6']);
  });

  it('role matching is case-insensitive', () => {
    const lower = makeSetup({ id: 'lower', name: 'Lower', role: 'marketing manager', featured: null });
    const { topPicks } = recommend([lower], { role: 'marketing-manager' });
    expect(topPicks).toContain(lower);
  });

  it('works with the canonical marketingManagerSetup fixture', () => {
    const { topPicks } = recommend([marketingManagerSetup], { role: 'marketing-manager' });
    expect(topPicks).toContain(marketingManagerSetup);
  });

  it('returns empty topPicks and full remainder when no role match', () => {
    const { topPicks, remainder } = recommend([otherSetup], { role: 'marketing-manager' });
    expect(topPicks).toHaveLength(0);
    expect(remainder).toContain(otherSetup);
  });
});
