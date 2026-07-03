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

/**
 * A fixed "now" injected into recommend() calls so freshness scoring is
 * deterministic regardless of wall-clock time.  All fixtures use
 * updatedAt='2025-01-01', which is well beyond the 90-day freshness window
 * relative to this date, so freshness contributes 0 to every score.
 */
const FIXED_NOW = new Date('2026-07-01').getTime();

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

// ─── Phase 3: scored ranking ──────────────────────────────────────────────────

describe('recommend (scored internals)', () => {
  it('orders topPicks by score under DEFAULT_WEIGHTS for a constructed fixture set', () => {
    // sA: exact role match → exactRole = 10
    // sB: related role match (sales-rep is in RELATED_ROLES[marketing-manager]) → relatedRole = 4
    // sC: no role relation (Recruiter is not related to marketing-manager) → score = 0
    const sA = makeSetup({ id: 'score-a', name: 'Exact', role: 'Marketing Manager', featured: null });
    const sB = makeSetup({ id: 'score-b', name: 'Related', role: 'Sales Rep', featured: null });
    const sC = makeSetup({ id: 'score-c', name: 'Unrelated', role: 'Recruiter', featured: null });

    const { topPicks, remainder, fallback } = recommend([sA, sB, sC], {
      role: 'marketing-manager',
      now: FIXED_NOW,
    });

    // bestScore = 10 >= MIN_SCORE_THRESHOLD (3) → no fallback
    expect(fallback).toBe(false);
    // sA (score=10) ranks first, sB (score=4) ranks second
    expect(topPicks[0].id).toBe('score-a');
    expect(topPicks[1].id).toBe('score-b');
    // sC has score=0 — not in topPicks (only score > 0 setups appear as tailored picks)
    expect(topPicks.map((s) => s.id)).not.toContain('score-c');
    expect(remainder.map((s) => s.id)).toContain('score-c');
  });

  it('goal-tag overlap visibly reorders results', () => {
    // Both are Marketing Manager setups (equal role score = 10).
    // noTags has featured=1 — it wins the featured tie-break without goal tags.
    // withTags has featured=2 but matches both goal tags (+1.5 * 2 = 3 pts extra).
    const noTags = makeSetup({
      id: 'goal-no-tags',
      name: 'No Tags',
      role: 'Marketing Manager',
      featured: 1,
      tags: [],
    });
    const withTags = makeSetup({
      id: 'goal-with-tags',
      name: 'With Tags',
      role: 'Marketing Manager',
      featured: 2,
      tags: ['write-emails', 'social-media'],
    });

    // Without goal tags: both score 10; noTags (featured=1) wins tie-break
    const withoutGoals = recommend([noTags, withTags], {
      role: 'marketing-manager',
      now: FIXED_NOW,
    });
    expect(withoutGoals.topPicks[0].id).toBe('goal-no-tags');
    expect(withoutGoals.topPicks[1].id).toBe('goal-with-tags');

    // With goal tags matching withTags: withTags scores 10 + 3 = 13 vs noTags = 10
    const withGoals = recommend([noTags, withTags], {
      role: 'marketing-manager',
      goalTagIds: ['write-emails', 'social-media'],
      now: FIXED_NOW,
    });
    expect(withGoals.topPicks[0].id).toBe('goal-with-tags');
    expect(withGoals.topPicks[1].id).toBe('goal-no-tags');
  });

  it('below-threshold top score triggers fallback=true with popular setups and no why-labels', () => {
    // Both setups are Recruiter — not related to marketing-manager.
    // popular has popularity=10:
    //   score ≈ popularityMultiplier(1) * log1p(10) ≈ 2.40  < MIN_SCORE_THRESHOLD(3)
    // unpopular has no popularity → score = 0
    // bestScore ≈ 2.40 < 3 → fallback fires
    const popular = makeSetup({
      id: 'fallback-popular',
      name: 'Popular One',
      role: 'Recruiter',
      featured: null,
      popularity: 10,
    });
    const unpopular = makeSetup({
      id: 'fallback-unpopular',
      name: 'Unpopular One',
      role: 'Recruiter',
      featured: null,
      // popularity absent → treated as 0
    });

    const result = recommend([popular, unpopular], {
      role: 'marketing-manager',
      now: FIXED_NOW,
    });

    expect(result.fallback).toBe(true);
    // topPicks = setups with real popularity (> 0) — only popular qualifies
    expect(result.topPicks).toContain(popular);
    expect(result.topPicks).not.toContain(unpopular);
    // No labels in fallback mode — nothing honest to claim
    expect(result.whyLabels).toEqual({});
    // unpopular is still accessible in remainder
    expect(result.remainder).toContain(unpopular);
  });

  it('target-incompatible setups are filtered out (not merely ranked lower)', () => {
    const claudeSetup = makeSetup({
      id: 'target-claude',
      name: 'Claude Setup',
      role: 'Marketing Manager',
      featured: 1,
      targets: ['claude-app'],
    });
    const gptSetup = makeSetup({
      id: 'target-gpt',
      name: 'GPT Setup',
      role: 'Marketing Manager',
      featured: 2,
      targets: ['chatgpt'],
    });

    const result = recommend([claudeSetup, gptSetup], {
      role: 'marketing-manager',
      target: 'claude-app',
      now: FIXED_NOW,
    });

    // claudeSetup is compatible → in topPicks
    expect(result.topPicks).toContain(claudeSetup);
    // gptSetup is incompatible → absent from BOTH topPicks and remainder
    expect(result.topPicks).not.toContain(gptSetup);
    expect(result.remainder).not.toContain(gptSetup);
  });

  it('existing Phase 1 guarantees hold: at most 5 topPicks and deterministic tie-break by featured-then-name', () => {
    // Seven Marketing Manager setups with explicit featured values to assert ordering.
    const setups = [1, 2, 3, 4, 5, 6, 7].map((n) =>
      makeSetup({
        id: `phase1-${n}`,
        name: `Setup ${n}`,
        role: 'Marketing Manager',
        featured: n,
      }),
    );

    const first = recommend(setups, { role: 'marketing-manager', now: FIXED_NOW });
    const second = recommend(setups, { role: 'marketing-manager', now: FIXED_NOW });

    // At most 5
    expect(first.topPicks.length).toBeLessThanOrEqual(5);
    expect(first.topPicks.length).toBe(5);

    // Deterministic: same inputs, same output
    expect(first.topPicks.map((s) => s.id)).toEqual(second.topPicks.map((s) => s.id));
    expect(first.remainder.map((s) => s.id)).toEqual(second.remainder.map((s) => s.id));

    // Tie-break: all scores equal (exactRole=10), so featured ascending determines order
    expect(first.topPicks.map((s) => s.id)).toEqual([
      'phase1-1',
      'phase1-2',
      'phase1-3',
      'phase1-4',
      'phase1-5',
    ]);
  });

  it('whyLabels are honest — exact role match earns a label; tag-only topPick earns none', () => {
    // roleMatch: Marketing Manager (exactRole = 10, no tags)
    const roleMatch = makeSetup({
      id: 'why-role-match',
      name: 'Role Match',
      role: 'Marketing Manager',
      featured: null,
      tags: [],
    });

    // tagOnly: Customer Support (not related to marketing-manager, score = 0 + tag-overlap = 3.0)
    // 'customer-support' is NOT in RELATED_ROLES['marketing-manager'], so no role credit.
    // Two shared goal tags × tagCredit(1.5) = 3.0 ≥ MIN_SCORE_THRESHOLD — so no fallback.
    const tagOnly = makeSetup({
      id: 'why-tag-only',
      name: 'Tag Only',
      role: 'Customer Support',
      featured: 1,
      tags: ['write-emails', 'social-media'],
    });

    const result = recommend([roleMatch, tagOnly], {
      role: 'marketing-manager',
      goalTagIds: ['write-emails', 'social-media'],
      now: FIXED_NOW,
    });

    // roleMatch: exactRole(10) → total 10; tagOnly: tag-overlap(3) → total 3
    // bestScore = 10 ≥ 3 → no fallback
    expect(result.fallback).toBe(false);
    expect(result.topPicks).toHaveLength(2);
    expect(result.topPicks[0].id).toBe('why-role-match'); // higher score
    expect(result.topPicks[1].id).toBe('why-tag-only');

    // roleMatch carries 'role-exact' reason → 'Matches your role' label
    expect(result.whyLabels['why-role-match']).toEqual(['Matches your role']);

    // tagOnly carries only 'tag-overlap:2' reason — tags are intentionally not
    // surfaced as label text (buildWhyLabels skips them) → honest empty array
    expect(result.whyLabels['why-tag-only']).toEqual([]);
  });
});
