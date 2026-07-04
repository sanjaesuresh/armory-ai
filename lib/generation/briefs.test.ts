/**
 * Tests for selectBriefs — pure, deterministic brief selection from catalog + demand signal.
 */

import { describe, it, expect } from 'vitest';
import { selectBriefs } from './briefs';
import type { CatalogSetup, DemandSignal, Brief } from './briefs';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeSetup(
  slug: string,
  role: string,
  overrides: Partial<CatalogSetup> = {},
): CatalogSetup {
  return {
    slug,
    role,
    industry: null,
    source: 'curated',
    upvotes: 0,
    popularity: 0,
    ...overrides,
  };
}

function makeSignal(role: string, demand: number, industry: string | null = null): DemandSignal {
  return { role, industry, demand };
}

// ─── Gap-fill: basic ─────────────────────────────────────────────────────────

describe('gap-fill briefs', () => {
  it('a role with a demand signal and zero approved setups yields a gap-fill brief', () => {
    const result = selectBriefs({
      approvedSetups: [],
      demand: [makeSignal('marketing-manager', 42)],
      count: 10,
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject<Brief>({
      kind: 'gap-fill',
      role: 'marketing-manager',
      industry: null,
      goalTags: [],
    });
  });

  it('industry null and empty-string are treated as the same coverage key', () => {
    // Approved setup has industry=null; signal has industry='' — should be covered.
    // Use customer-support (no adjacent roles) to avoid a variation being emitted.
    const covered = makeSetup('cs-1', 'customer-support', { industry: null });
    const result = selectBriefs({
      approvedSetups: [covered],
      demand: [{ role: 'customer-support', industry: '', demand: 10 }],
      count: 10,
    });

    // The demand signal is covered (null and '' normalise to the same key) — no gap-fill.
    // customer-support has no adjacent roles, so no variation either.
    expect(result).toHaveLength(0);
  });

  it('preserves industry string on gap-fill brief', () => {
    const result = selectBriefs({
      approvedSetups: [],
      demand: [makeSignal('recruiter', 5, 'healthcare')],
      count: 10,
    });

    expect(result[0]).toMatchObject({ kind: 'gap-fill', industry: 'healthcare' });
  });
});

// ─── Gap-fill: filtering ─────────────────────────────────────────────────────

describe('gap-fill filtering', () => {
  it('demand of exactly 0 yields no gap-fill brief', () => {
    const result = selectBriefs({
      approvedSetups: [],
      demand: [makeSignal('recruiter', 0)],
      count: 10,
    });
    expect(result).toHaveLength(0);
  });

  it('negative demand yields no gap-fill brief', () => {
    const result = selectBriefs({
      approvedSetups: [],
      demand: [makeSignal('recruiter', -1)],
      count: 10,
    });
    expect(result).toHaveLength(0);
  });

  it('briefs never duplicate a (role, industry) already covered by an approved setup', () => {
    // Use customer-support (no adjacent roles) to avoid noise from variation briefs.
    const covered = makeSetup('cs-1', 'customer-support', { industry: 'tech' });
    const result = selectBriefs({
      approvedSetups: [covered],
      demand: [makeSignal('customer-support', 50, 'tech')],
      count: 10,
    });
    // The (customer-support, tech) pair is already covered — no gap-fill.
    // customer-support has no adjacent roles — no variation either.
    expect(result).toHaveLength(0);
  });

  it('only uncovered (role, industry) pairs emit gap-fills', () => {
    // Use customer-support (no adjacent roles) as the covered setup to avoid variation noise.
    const covered = makeSetup('cs-1', 'customer-support');
    const result = selectBriefs({
      approvedSetups: [covered],
      demand: [
        makeSignal('customer-support', 50),   // covered → no gap-fill
        makeSignal('recruiter', 20),           // uncovered → gap-fill
      ],
      count: 10,
    });
    const gapFills = result.filter((b) => b.kind === 'gap-fill');
    expect(gapFills).toHaveLength(1);
    expect(gapFills[0]).toMatchObject({ kind: 'gap-fill', role: 'recruiter' });
  });
});

// ─── Gap-fill: ordering ───────────────────────────────────────────────────────

describe('gap-fill ordering', () => {
  it('gap-fills are sorted by demand desc, then role asc, then industry asc (nulls first)', () => {
    const result = selectBriefs({
      approvedSetups: [],
      demand: [
        makeSignal('sales-rep', 10),
        makeSignal('recruiter', 30),
        makeSignal('marketing-manager', 30),
        makeSignal('marketing-manager', 30, 'healthcare'),
        makeSignal('operations', 5),
      ],
      count: 10,
    });

    expect(result.map((b) => [b.role, b.industry])).toEqual([
      // demand=30, tie broken by role asc: marketing-manager < recruiter
      ['marketing-manager', null],
      ['marketing-manager', 'healthcare'],
      ['recruiter', null],
      // demand=10
      ['sales-rep', null],
      // demand=5
      ['operations', null],
    ]);
  });
});

// ─── Variation briefs: basic ──────────────────────────────────────────────────

describe('variation briefs', () => {
  it('the top-performing approved setup yields a variation brief for a related (adjacent) role', () => {
    // marketing-manager → first adjacent is sales-rep
    const setup = makeSetup('mkt-best', 'marketing-manager', { upvotes: 10, popularity: 5 });

    const result = selectBriefs({
      approvedSetups: [setup],
      demand: [],
      count: 10,
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      kind: 'variation',
      role: 'sales-rep',        // first adjacent role of marketing-manager
      industry: null,
      sourceSlug: 'mkt-best',
      vary: 'role',
      goalTags: [],
    });
  });

  it('variation uses the source industry', () => {
    const setup = makeSetup('mkt-health', 'marketing-manager', {
      industry: 'healthcare',
      upvotes: 5,
      popularity: 0,
    });

    const result = selectBriefs({
      approvedSetups: [setup],
      demand: [],
      count: 10,
    });

    expect(result[0]).toMatchObject({
      kind: 'variation',
      role: 'sales-rep',
      industry: 'healthcare',
    });
  });

  it('variation sources are ordered by performance (upvotes + popularity) desc, then slug asc', () => {
    const low = makeSetup('aaa-low', 'recruiter', { upvotes: 1, popularity: 1 });
    const high = makeSetup('bbb-high', 'marketing-manager', { upvotes: 10, popularity: 5 });

    const result = selectBriefs({
      approvedSetups: [low, high],
      demand: [],
      count: 10,
    });

    // bbb-high (15 performance) should come first → first adjacent of marketing-manager = sales-rep
    expect(result[0]).toMatchObject({ kind: 'variation', sourceSlug: 'bbb-high' });
  });

  it('slug tie-breaking is lexicographic ascending', () => {
    const aaa = makeSetup('aaa', 'marketing-manager', { upvotes: 5, popularity: 5 });
    const bbb = makeSetup('bbb', 'recruiter', { upvotes: 5, popularity: 5 });

    const result = selectBriefs({
      approvedSetups: [bbb, aaa],  // intentionally out of order
      demand: [],
      count: 10,
    });

    // aaa sorts before bbb on equal performance
    expect(result[0]).toMatchObject({ sourceSlug: 'aaa' });
  });

  it('a source with no uncovered adjacent role yields no variation brief', () => {
    // customer-support has no related roles → no variation
    const setup = makeSetup('cs-1', 'customer-support', { upvotes: 10, popularity: 10 });

    const result = selectBriefs({
      approvedSetups: [setup],
      demand: [],
      count: 10,
    });

    expect(result).toHaveLength(0);
  });

  it('variation is skipped when all adjacent roles are already covered', () => {
    // marketing-manager → adjacent [sales-rep, founder-generalist]
    // Both adjacent roles are covered — marketing-manager yields no variation.
    // Check specifically that no variation traces back to the marketing-manager source.
    const source = makeSetup('mkt-1', 'marketing-manager', { upvotes: 10 });
    const srCovered = makeSetup('sr-1', 'sales-rep');
    const fgCovered = makeSetup('fg-1', 'founder-generalist');

    const result = selectBriefs({
      approvedSetups: [source, srCovered, fgCovered],
      demand: [],
      count: 10,
    });

    const mktVariations = result.filter(
      (b) => b.kind === 'variation' && (b as { sourceSlug: string }).sourceSlug === 'mkt-1',
    );
    expect(mktVariations).toHaveLength(0);
  });

  it('skips adjacent roles already targeted by an earlier gap-fill', () => {
    // demand emits a gap-fill for (sales-rep, null)
    // marketing-manager variation would target sales-rep — already emitted, so skip to founder-generalist
    const source = makeSetup('mkt-1', 'marketing-manager', { upvotes: 10 });

    const result = selectBriefs({
      approvedSetups: [source],
      demand: [makeSignal('sales-rep', 20)],
      count: 10,
    });

    const variations = result.filter((b) => b.kind === 'variation');
    expect(variations).toHaveLength(1);
    // sales-rep already taken by gap-fill, so variation targets founder-generalist
    expect(variations[0]).toMatchObject({ role: 'founder-generalist' });
  });
});

// ─── Count cap, ordering, and determinism ────────────────────────────────────

describe('count cap, ordering, and determinism', () => {
  it('the count cap is respected', () => {
    const result = selectBriefs({
      approvedSetups: [],
      demand: [
        makeSignal('marketing-manager', 10),
        makeSignal('recruiter', 9),
        makeSignal('sales-rep', 8),
        makeSignal('operations', 7),
        makeSignal('founder-generalist', 6),
      ],
      count: 3,
    });

    expect(result).toHaveLength(3);
  });

  it('gap-fills come before variations', () => {
    // One demand signal (gap-fill) + one approved setup that creates a variation
    const source = makeSetup('ops-1', 'operations', { upvotes: 10, popularity: 5 });

    const result = selectBriefs({
      approvedSetups: [source],
      demand: [makeSignal('recruiter', 5)],
      count: 10,
    });

    const kinds = result.map((b) => b.kind);
    const firstVariation = kinds.indexOf('variation');
    const lastGapFill = kinds.lastIndexOf('gap-fill');

    expect(lastGapFill).toBeLessThan(firstVariation);
  });

  it('calling selectBriefs twice with identical inputs returns byte-identical output', () => {
    const approvedSetups = [
      makeSetup('mkt-1', 'marketing-manager', { upvotes: 5, popularity: 3 }),
      makeSetup('rec-1', 'recruiter', { upvotes: 2, popularity: 1 }),
    ];
    const demand = [
      makeSignal('operations', 15),
      makeSignal('sales-rep', 10),
      makeSignal('founder-generalist', 8, 'tech'),
    ];

    const first = selectBriefs({ approvedSetups, demand, count: 10 });
    const second = selectBriefs({ approvedSetups, demand, count: 10 });

    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
  });

  it('returns fewer than count when not enough briefs exist', () => {
    // Empty demand + no setups → 0 briefs, count=5
    const result = selectBriefs({ approvedSetups: [], demand: [], count: 5 });
    expect(result).toHaveLength(0);
  });
});

// ─── No duplicate (role, industry) within a single call ──────────────────────

describe('no intra-call duplicates', () => {
  it('duplicate demand signals for the same (role, industry) emit only one brief', () => {
    const result = selectBriefs({
      approvedSetups: [],
      demand: [
        makeSignal('recruiter', 10),
        makeSignal('recruiter', 5),  // same (role, industry) — should be deduplicated
      ],
      count: 10,
    });

    const recruiterBriefs = result.filter((b) => b.role === 'recruiter' && b.industry === null);
    expect(recruiterBriefs).toHaveLength(1);
  });

  it('variation does not duplicate a (role, industry) pair emitted as a gap-fill', () => {
    // demand emits gap-fill for (founder-generalist, null)
    // marketing-manager has adjacent [sales-rep, founder-generalist]
    // If sales-rep is also covered, the only remaining adjacent is founder-generalist — already emitted
    const source = makeSetup('mkt-1', 'marketing-manager', { upvotes: 10 });
    const srCovered = makeSetup('sr-covered', 'sales-rep');

    const result = selectBriefs({
      approvedSetups: [source, srCovered],
      demand: [makeSignal('founder-generalist', 5)],
      count: 10,
    });

    // gap-fill for founder-generalist
    // variation: sales-rep covered, founder-generalist already emitted → no variation
    const founderBriefs = result.filter(
      (b) => b.role === 'founder-generalist' && b.industry === null,
    );
    expect(founderBriefs).toHaveLength(1);
    expect(founderBriefs[0].kind).toBe('gap-fill');
  });
});
