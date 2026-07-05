/**
 * Tests for the pure scorer (scoring.ts) and default weights (weights.ts).
 *
 * All tests use injected time (no wall-clock reads inside the scorer).
 * Snapshot test at the end locks in default-weight ordering so any weight
 * change shows up as a deliberate diff.
 */

import { describe, it, expect } from 'vitest';
import { scoreSetup, buildWhyLabels } from './scoring';
import { DEFAULT_WEIGHTS, MIN_SCORE_THRESHOLD } from './weights';
import type { Setup } from '@/lib/setup/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeSetup(overrides: Partial<Setup> & { id: string; name: string; role: string }): Setup {
  return {
    kind: 'setup',
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
    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
    ...overrides,
  };
}

/** Fixed "now" for deterministic freshness tests: 2025-06-01 */
const NOW = new Date('2025-06-01T00:00:00Z');
/** An updatedAt that is within the 90-day freshness window (10 days ago). */
const RECENT_DATE = '2025-05-22T00:00:00Z';
/** An updatedAt that is outside the 90-day freshness window (200 days ago). */
const STALE_DATE = '2024-11-13T00:00:00Z';

// ─── Task 2: scorer golden-ordering tests ─────────────────────────────────────

describe('scoreSetup', () => {
  it('exact role match outranks related-role match with equal other signals', () => {
    const exact = makeSetup({ id: 'exact', name: 'Exact', role: 'Marketing Manager' });
    const related = makeSetup({ id: 'related', name: 'Related', role: 'Sales Rep' });

    const signals = { popularity: 0, now: NOW };
    const inputs = { role: 'marketing-manager' };

    const exactResult = scoreSetup(exact, inputs, signals, DEFAULT_WEIGHTS);
    const relatedResult = scoreSetup(related, inputs, signals, DEFAULT_WEIGHTS);

    expect(exactResult.score).toBeGreaterThan(relatedResult.score);
    expect(exactResult.reasons).toContain('role-exact');
    expect(relatedResult.reasons).toContain('role-related');
  });

  it('related-role match outranks no role relation', () => {
    const related = makeSetup({ id: 'related', name: 'Related', role: 'Sales Rep' });
    const noMatch = makeSetup({ id: 'none', name: 'None', role: 'Recruiter' });

    const signals = { popularity: 0, now: NOW };
    const inputs = { role: 'marketing-manager' };

    const relatedResult = scoreSetup(related, inputs, signals, DEFAULT_WEIGHTS);
    const noMatchResult = scoreSetup(noMatch, inputs, signals, DEFAULT_WEIGHTS);

    expect(relatedResult.score).toBeGreaterThan(noMatchResult.score);
  });

  it('industry match boosts score but its absence never gives a negative score', () => {
    const withIndustry = makeSetup({
      id: 'with-ind',
      name: 'With Industry',
      role: 'Marketing Manager',
      industry: 'SaaS',
    });
    const withoutIndustry = makeSetup({
      id: 'without-ind',
      name: 'Without Industry',
      role: 'Marketing Manager',
      industry: null,
    });

    const signals = { popularity: 0, now: NOW };
    const inputs = { role: 'marketing-manager', industry: 'SaaS' };

    const withResult = scoreSetup(withIndustry, inputs, signals, DEFAULT_WEIGHTS);
    const withoutResult = scoreSetup(withoutIndustry, inputs, signals, DEFAULT_WEIGHTS);

    expect(withResult.score).toBeGreaterThan(withoutResult.score);
    expect(withoutResult.score).toBeGreaterThanOrEqual(0);
    expect(withResult.reasons).toContain('industry');
  });

  it('each shared goal tag adds credit (more overlap = higher score)', () => {
    const oneTag = makeSetup({
      id: 'one-tag',
      name: 'One Tag',
      role: 'Marketing Manager',
      tags: ['marketing'],
    });
    const twoTags = makeSetup({
      id: 'two-tags',
      name: 'Two Tags',
      role: 'Marketing Manager',
      tags: ['marketing', 'social-media'],
    });

    const signals = { popularity: 0, now: NOW };
    const inputs = { role: 'marketing-manager', goalTagIds: ['marketing', 'social-media'] };

    const oneResult = scoreSetup(oneTag, inputs, signals, DEFAULT_WEIGHTS);
    const twoResult = scoreSetup(twoTags, inputs, signals, DEFAULT_WEIGHTS);

    expect(twoResult.score).toBeGreaterThan(oneResult.score);
    expect(oneResult.reasons.some((r) => r.startsWith('tag-overlap'))).toBe(true);
    expect(twoResult.reasons.some((r) => r.startsWith('tag-overlap'))).toBe(true);
  });

  it('popularity credit is log-dampened: 10x count difference is far less than 10x score delta', () => {
    const setup = makeSetup({ id: 'pop', name: 'Popular', role: 'Marketing Manager' });
    const inputs = { role: 'marketing-manager' };

    const lowPop = scoreSetup(setup, inputs, { popularity: 10, now: NOW }, DEFAULT_WEIGHTS);
    const highPop = scoreSetup(setup, inputs, { popularity: 100, now: NOW }, DEFAULT_WEIGHTS);

    const lowCredit = lowPop.score;
    const highCredit = highPop.score;
    const ratio = highCredit / lowCredit;

    // 10x count → far less than 10x credit (log dampening)
    expect(ratio).toBeLessThan(5);
    // But high popularity is still better than low
    expect(highCredit).toBeGreaterThan(lowCredit);
    expect(lowPop.reasons).toContain('popular');
    expect(highPop.reasons).toContain('popular');
  });

  it('recently updated setup gets freshness bump; stale setup gets none', () => {
    const recent = makeSetup({ id: 'recent', name: 'Recent', role: 'Marketing Manager', updatedAt: RECENT_DATE });
    const stale = makeSetup({ id: 'stale', name: 'Stale', role: 'Marketing Manager', updatedAt: STALE_DATE });

    const inputs = { role: 'marketing-manager' };
    const signals = { popularity: 0, now: NOW };

    const recentResult = scoreSetup(recent, inputs, signals, DEFAULT_WEIGHTS);
    const staleResult = scoreSetup(stale, inputs, signals, DEFAULT_WEIGHTS);

    expect(recentResult.score).toBeGreaterThan(staleResult.score);
    expect(recentResult.reasons).toContain('fresh');
    expect(staleResult.reasons).not.toContain('fresh');
  });

  it('ties break by featured (ascending, nulls last) then name (ascending)', () => {
    // Two setups with identical inputs/role/tags/popularity/updatedAt but different featured/name
    const setups = [
      makeSetup({ id: 'a', name: 'Zebra', role: 'Marketing Manager', featured: null }),
      makeSetup({ id: 'b', name: 'Alpha', role: 'Marketing Manager', featured: null }),
      makeSetup({ id: 'c', name: 'Middle', role: 'Marketing Manager', featured: 1 }),
    ];

    const inputs = { role: 'marketing-manager' };
    const signals = { popularity: 0, now: NOW };

    const scored = setups
      .map((s) => ({ setup: s, ...scoreSetup(s, inputs, signals, DEFAULT_WEIGHTS) }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        // Tie-break: featured asc (nulls last), then name asc
        const fa = a.setup.featured;
        const fb = b.setup.featured;
        if (fa === null && fb === null) return a.setup.name.localeCompare(b.setup.name);
        if (fa === null) return 1;
        if (fb === null) return -1;
        if (fa !== fb) return fa - fb;
        return a.setup.name.localeCompare(b.setup.name);
      });

    // All three have the same score (same role match, no popularity, same staleness)
    // c (featured=1) → b (null, Alpha) → a (null, Zebra)
    expect(scored.map((s) => s.setup.id)).toEqual(['c', 'b', 'a']);
  });

  it('scoring is deterministic across repeated calls', () => {
    const setup = makeSetup({ id: 'det', name: 'Det', role: 'Marketing Manager', tags: ['marketing'] });
    const inputs = { role: 'marketing-manager', goalTagIds: ['marketing'] };
    const signals = { popularity: 42, now: NOW };

    const r1 = scoreSetup(setup, inputs, signals, DEFAULT_WEIGHTS);
    const r2 = scoreSetup(setup, inputs, signals, DEFAULT_WEIGHTS);

    expect(r1.score).toBe(r2.score);
    expect(r1.reasons).toEqual(r2.reasons);
  });

  it('snapshot: full fixture ordering under default weights', () => {
    // A fixed set of setups with varied signals; ordering must be stable across weight changes.
    const setups: Setup[] = [
      makeSetup({ id: 'exact-fresh', name: 'Exact Fresh', role: 'Marketing Manager', tags: ['marketing', 'social-media'], updatedAt: RECENT_DATE }),
      makeSetup({ id: 'exact-stale', name: 'Exact Stale', role: 'Marketing Manager', tags: [], updatedAt: STALE_DATE }),
      makeSetup({ id: 'related-pop', name: 'Related Popular', role: 'Sales Rep', tags: [], updatedAt: STALE_DATE }),
      makeSetup({ id: 'no-match', name: 'No Match', role: 'Recruiter', tags: [], updatedAt: STALE_DATE }),
    ];

    const inputs = { role: 'marketing-manager', goalTagIds: ['marketing', 'social-media'] };

    const scored = setups
      .map((s) => ({
        id: s.id,
        score: scoreSetup(
          s,
          inputs,
          { popularity: s.id === 'related-pop' ? 50 : 0, now: NOW },
          DEFAULT_WEIGHTS,
        ).score,
      }))
      .sort((a, b) => b.score - a.score);

    // Snapshot: exact-fresh (role+tags+freshness) > exact-stale (role only) > related-pop (related+popularity) > no-match
    expect(scored.map((s) => s.id)).toMatchSnapshot();
  });
});

// ─── Task 3: why-label tests ──────────────────────────────────────────────────

describe('buildWhyLabels', () => {
  it('exact role match yields a role label', () => {
    const setup = makeSetup({ id: 'e', name: 'E', role: 'Marketing Manager' });
    const inputs = { role: 'marketing-manager' };
    const { reasons } = scoreSetup(setup, inputs, { popularity: 0, now: NOW }, DEFAULT_WEIGHTS);
    const labels = buildWhyLabels(reasons, { popularity: 0, role: 'marketing-manager' });

    expect(labels.some((l) => l.toLowerCase().includes('matches your role'))).toBe(true);
  });

  it('related role match yields an honest "close to your role" label (not "matches")', () => {
    const setup = makeSetup({ id: 'r', name: 'R', role: 'Sales Rep' });
    const inputs = { role: 'marketing-manager' };
    const { reasons } = scoreSetup(setup, inputs, { popularity: 0, now: NOW }, DEFAULT_WEIGHTS);
    const labels = buildWhyLabels(reasons, { popularity: 0, role: 'marketing-manager' });

    expect(labels.some((l) => l.toLowerCase().includes('close to your role'))).toBe(true);
    expect(labels.some((l) => l.toLowerCase().includes('matches your role'))).toBe(false);
  });

  it('popularity label appears only with a nonzero popularity count', () => {
    const setup = makeSetup({ id: 'p', name: 'P', role: 'Marketing Manager' });
    const inputs = { role: 'marketing-manager' };

    const { reasons: reasonsZero } = scoreSetup(setup, inputs, { popularity: 0, now: NOW }, DEFAULT_WEIGHTS);
    const labelsZero = buildWhyLabels(reasonsZero, { popularity: 0, role: 'marketing-manager' });
    expect(labelsZero.some((l) => l.toLowerCase().includes('popular'))).toBe(false);

    const { reasons: reasonsNonzero } = scoreSetup(setup, inputs, { popularity: 100, now: NOW }, DEFAULT_WEIGHTS);
    const labelsNonzero = buildWhyLabels(reasonsNonzero, { popularity: 100, role: 'marketing-manager' });
    expect(labelsNonzero.some((l) => l.toLowerCase().includes('popular'))).toBe(true);
  });

  it('no signals yields no labels rather than filler text', () => {
    // A setup that has no role match, no popularity, no freshness, no tags
    const setup = makeSetup({ id: 'nil', name: 'Nil', role: 'Recruiter', updatedAt: STALE_DATE });
    const inputs = { role: 'marketing-manager' };
    const { reasons } = scoreSetup(setup, inputs, { popularity: 0, now: NOW }, DEFAULT_WEIGHTS);
    const labels = buildWhyLabels(reasons, { popularity: 0, role: 'marketing-manager' });

    // No meaningful signals → no labels
    expect(labels).toHaveLength(0);
  });

  it('returns at most two labels, highest-weight reasons first', () => {
    // A setup with many positive signals: exact role + popular + fresh + tags
    const setup = makeSetup({
      id: 'full',
      name: 'Full',
      role: 'Marketing Manager',
      tags: ['marketing', 'social-media'],
      updatedAt: RECENT_DATE,
    });
    const inputs = { role: 'marketing-manager', goalTagIds: ['marketing', 'social-media'] };
    const { reasons } = scoreSetup(setup, inputs, { popularity: 100, now: NOW }, DEFAULT_WEIGHTS);
    const labels = buildWhyLabels(reasons, { popularity: 100, role: 'marketing-manager' });

    expect(labels.length).toBeLessThanOrEqual(2);
    // With role + popularity both present, role should be first (highest weight)
    if (labels.length >= 2) {
      expect(labels[0].toLowerCase()).toMatch(/matches your role/);
    }
  });

  it('no label is emitted for featured ordering', () => {
    const setup = makeSetup({ id: 'feat', name: 'Feat', role: 'Marketing Manager', featured: 1 });
    const inputs = { role: 'marketing-manager' };
    const { reasons } = scoreSetup(setup, inputs, { popularity: 0, now: NOW }, DEFAULT_WEIGHTS);
    const labels = buildWhyLabels(reasons, { popularity: 0, role: 'marketing-manager' });

    expect(labels.some((l) => l.toLowerCase().includes('featured'))).toBe(false);
  });
});

// ─── DEFAULT_WEIGHTS and MIN_SCORE_THRESHOLD exports ─────────────────────────

describe('DEFAULT_WEIGHTS', () => {
  it('exports all required weight keys with positive numeric values', () => {
    expect(typeof DEFAULT_WEIGHTS.exactRole).toBe('number');
    expect(DEFAULT_WEIGHTS.exactRole).toBeGreaterThan(0);
    expect(typeof DEFAULT_WEIGHTS.relatedRole).toBe('number');
    expect(DEFAULT_WEIGHTS.relatedRole).toBeGreaterThan(0);
    expect(typeof DEFAULT_WEIGHTS.industryBonus).toBe('number');
    expect(DEFAULT_WEIGHTS.industryBonus).toBeGreaterThan(0);
    expect(typeof DEFAULT_WEIGHTS.tagCredit).toBe('number');
    expect(DEFAULT_WEIGHTS.tagCredit).toBeGreaterThan(0);
    expect(typeof DEFAULT_WEIGHTS.popularityMultiplier).toBe('number');
    expect(DEFAULT_WEIGHTS.popularityMultiplier).toBeGreaterThan(0);
    expect(typeof DEFAULT_WEIGHTS.freshnessBump).toBe('number');
    expect(DEFAULT_WEIGHTS.freshnessBump).toBeGreaterThan(0);
    // related role must be less than exact role
    expect(DEFAULT_WEIGHTS.relatedRole).toBeLessThan(DEFAULT_WEIGHTS.exactRole);
  });

  it('MIN_SCORE_THRESHOLD is a positive number', () => {
    expect(typeof MIN_SCORE_THRESHOLD).toBe('number');
    expect(MIN_SCORE_THRESHOLD).toBeGreaterThan(0);
  });
});
