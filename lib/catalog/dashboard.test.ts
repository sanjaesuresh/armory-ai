/**
 * Tests for lib/catalog/dashboard.ts — pure dashboard selection functions.
 *
 * Step 1 (TDD): written before the implementation module exists.
 * Running this file with module not found is the RED state.
 */

import { describe, it, expect } from 'vitest';
import {
  isDeveloperItem,
  isProfessionalItem,
  approvedShelf,
  popularShelf,
  filterList,
  sortList,
  detailPathFor,
} from './dashboard';
import type { Setup } from '@/lib/setup/types';

// ─── Fixture factory ──────────────────────────────────────────────────────────

function makeSetup(
  overrides: Partial<Setup> & { id: string; slug: string; name: string },
): Setup {
  return {
    kind: 'setup',
    tagline: 'Test tagline',
    description: 'Test description',
    role: 'test-role',
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
    instructionTemplate: '',
    variables: [],
    knowledgeFiles: [],
    scenarios: [],
    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
    ...overrides,
  };
}

// ─── isDeveloperItem — truth table for all four kind/tier combos ──────────────

describe('isDeveloperItem', () => {
  it('returns false for kind=setup + tier=core', () => {
    const s = makeSetup({ id: '1', slug: 'a', name: 'A', kind: 'setup', tier: 'core' });
    expect(isDeveloperItem(s)).toBe(false);
  });

  it('returns true for kind=setup + tier=advanced', () => {
    const s = makeSetup({ id: '2', slug: 'b', name: 'B', kind: 'setup', tier: 'advanced' });
    expect(isDeveloperItem(s)).toBe(true);
  });

  it('returns true for kind=agent (regardless of tier)', () => {
    const score = makeSetup({ id: '3', slug: 'c', name: 'C', kind: 'agent', tier: 'core' });
    const sadv = makeSetup({ id: '3b', slug: 'cb', name: 'CB', kind: 'agent', tier: 'advanced' });
    expect(isDeveloperItem(score)).toBe(true);
    expect(isDeveloperItem(sadv)).toBe(true);
  });

  it('returns true for kind=skill', () => {
    const s = makeSetup({ id: '4', slug: 'd', name: 'D', kind: 'skill', tier: 'core' });
    expect(isDeveloperItem(s)).toBe(true);
  });

  it('returns true for kind=harness', () => {
    const s = makeSetup({ id: '5', slug: 'e', name: 'E', kind: 'harness', tier: 'core' });
    expect(isDeveloperItem(s)).toBe(true);
  });
});

// ─── isProfessionalItem — truth table ─────────────────────────────────────────

describe('isProfessionalItem', () => {
  it('returns true for kind=setup + tier=core', () => {
    const s = makeSetup({ id: '1', slug: 'a', name: 'A', kind: 'setup', tier: 'core' });
    expect(isProfessionalItem(s)).toBe(true);
  });

  it('returns false for kind=setup + tier=advanced', () => {
    const s = makeSetup({ id: '2', slug: 'b', name: 'B', kind: 'setup', tier: 'advanced' });
    expect(isProfessionalItem(s)).toBe(false);
  });

  it('returns false for kind=agent', () => {
    const s = makeSetup({ id: '3', slug: 'c', name: 'C', kind: 'agent', tier: 'core' });
    expect(isProfessionalItem(s)).toBe(false);
  });

  it('returns false for kind=skill', () => {
    const s = makeSetup({ id: '4', slug: 'd', name: 'D', kind: 'skill', tier: 'core' });
    expect(isProfessionalItem(s)).toBe(false);
  });

  it('returns false for kind=harness', () => {
    const s = makeSetup({ id: '5', slug: 'e', name: 'E', kind: 'harness', tier: 'core' });
    expect(isProfessionalItem(s)).toBe(false);
  });
});

// ─── approvedShelf ────────────────────────────────────────────────────────────

describe('approvedShelf', () => {
  it('excludes items with null featured', () => {
    const a = makeSetup({ id: '1', slug: 'a', name: 'A', featured: 1 });
    const b = makeSetup({ id: '2', slug: 'b', name: 'B', featured: null });
    const result = approvedShelf([a, b], 10);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('orders by featured ascending (rank 1 before rank 2)', () => {
    const a = makeSetup({ id: '1', slug: 'a', name: 'A', featured: 3 });
    const b = makeSetup({ id: '2', slug: 'b', name: 'B', featured: 1 });
    const c = makeSetup({ id: '3', slug: 'c', name: 'C', featured: 2 });
    const result = approvedShelf([a, b, c], 10);
    expect(result.map((s) => s.id)).toEqual(['2', '3', '1']);
  });

  it('caps at max', () => {
    const items = [1, 2, 3, 4, 5].map((n) =>
      makeSetup({ id: String(n), slug: `s-${n}`, name: `Setup ${n}`, featured: n }),
    );
    expect(approvedShelf(items, 3)).toHaveLength(3);
  });

  it('cap applies after ordering (first max items by featured rank are kept)', () => {
    const items = [1, 2, 3, 4, 5].map((n) =>
      makeSetup({ id: String(n), slug: `s-${n}`, name: `Setup ${n}`, featured: n }),
    );
    const result = approvedShelf(items, 3);
    expect(result.map((s) => s.id)).toEqual(['1', '2', '3']);
  });

  it('returns empty array when all items have null featured', () => {
    const items = [
      makeSetup({ id: '1', slug: 'a', name: 'A', featured: null }),
      makeSetup({ id: '2', slug: 'b', name: 'B', featured: null }),
    ];
    expect(approvedShelf(items, 10)).toHaveLength(0);
  });

  it('does not mutate the input array', () => {
    const items = [
      makeSetup({ id: '1', slug: 'a', name: 'A', featured: 2 }),
      makeSetup({ id: '2', slug: 'b', name: 'B', featured: 1 }),
    ];
    const firstId = items[0].id;
    approvedShelf(items, 10);
    expect(items[0].id).toBe(firstId);
  });
});

// ─── popularShelf ─────────────────────────────────────────────────────────────

describe('popularShelf', () => {
  it('excludes items in excludeIds', () => {
    const a = makeSetup({ id: '1', slug: 'a', name: 'A', upvotes: 100 });
    const b = makeSetup({ id: '2', slug: 'b', name: 'B', upvotes: 50 });
    const result = popularShelf([a, b], 10, new Set(['1']));
    expect(result.map((s) => s.id)).toEqual(['2']);
  });

  it('orders by upvotes descending', () => {
    const a = makeSetup({ id: '1', slug: 'a', name: 'A', upvotes: 10 });
    const b = makeSetup({ id: '2', slug: 'b', name: 'B', upvotes: 100 });
    const c = makeSetup({ id: '3', slug: 'c', name: 'C', upvotes: 50 });
    const result = popularShelf([a, b, c], 10, new Set());
    expect(result.map((s) => s.id)).toEqual(['2', '3', '1']);
  });

  it('breaks upvotes tie by popularity descending', () => {
    const a = makeSetup({ id: '1', slug: 'a', name: 'A', upvotes: 10, popularity: 5 });
    const b = makeSetup({ id: '2', slug: 'b', name: 'B', upvotes: 10, popularity: 20 });
    const result = popularShelf([a, b], 10, new Set());
    expect(result.map((s) => s.id)).toEqual(['2', '1']);
  });

  it('breaks popularity tie by name ascending', () => {
    const a = makeSetup({ id: '1', slug: 'a', name: 'Zebra', upvotes: 10, popularity: 5 });
    const b = makeSetup({ id: '2', slug: 'b', name: 'Apple', upvotes: 10, popularity: 5 });
    const result = popularShelf([a, b], 10, new Set());
    expect(result.map((s) => s.id)).toEqual(['2', '1']);
  });

  it('caps at max', () => {
    const items = [1, 2, 3, 4, 5].map((n) =>
      makeSetup({ id: String(n), slug: `s-${n}`, name: `Setup ${n}`, upvotes: n }),
    );
    expect(popularShelf(items, 3, new Set())).toHaveLength(3);
  });

  it('returns empty array when all items are excluded', () => {
    const a = makeSetup({ id: '1', slug: 'a', name: 'A', upvotes: 10 });
    expect(popularShelf([a], 10, new Set(['1']))).toHaveLength(0);
  });

  it('does not mutate the input array', () => {
    const items = [
      makeSetup({ id: '1', slug: 'a', name: 'A', upvotes: 100 }),
      makeSetup({ id: '2', slug: 'b', name: 'B', upvotes: 50 }),
    ];
    const firstId = items[0].id;
    popularShelf(items, 10, new Set());
    expect(items[0].id).toBe(firstId);
  });
});

// ─── filterList ───────────────────────────────────────────────────────────────

describe('filterList', () => {
  it('matches name case-insensitively', () => {
    const a = makeSetup({ id: '1', slug: 'a', name: 'Foo Bar' });
    const b = makeSetup({ id: '2', slug: 'b', name: 'Baz Qux' });
    const result = filterList([a, b], { query: 'foo' });
    expect(result.map((s) => s.id)).toEqual(['1']);
  });

  it('matches tagline case-insensitively', () => {
    const a = makeSetup({ id: '1', slug: 'a', name: 'X', tagline: 'Hello World' });
    const b = makeSetup({ id: '2', slug: 'b', name: 'Y', tagline: 'Other stuff' });
    const result = filterList([a, b], { query: 'HELLO' });
    expect(result.map((s) => s.id)).toEqual(['1']);
  });

  it('matches description case-insensitively', () => {
    const a = makeSetup({
      id: '1',
      slug: 'a',
      name: 'X',
      description: 'Detailed description about AI',
    });
    const b = makeSetup({ id: '2', slug: 'b', name: 'Y', description: 'Nothing special' });
    const result = filterList([a, b], { query: 'detailed' });
    expect(result.map((s) => s.id)).toEqual(['1']);
  });

  it('matches tags case-insensitively', () => {
    const a = makeSetup({
      id: '1',
      slug: 'a',
      name: 'X',
      tags: ['content-creation', 'marketing'],
    });
    const b = makeSetup({ id: '2', slug: 'b', name: 'Y', tags: ['engineering'] });
    const result = filterList([a, b], { query: 'Marketing' });
    expect(result.map((s) => s.id)).toEqual(['1']);
  });

  it('filters by category', () => {
    const a = makeSetup({ id: '1', slug: 'a', name: 'X', category: 'marketing' });
    const b = makeSetup({ id: '2', slug: 'b', name: 'Y', category: 'engineering' });
    const result = filterList([a, b], { category: 'marketing' });
    expect(result.map((s) => s.id)).toEqual(['1']);
  });

  it('filters by kind', () => {
    const a = makeSetup({ id: '1', slug: 'a', name: 'X', kind: 'setup' });
    const b = makeSetup({ id: '2', slug: 'b', name: 'Y', kind: 'agent' });
    const result = filterList([a, b], { kind: 'agent' });
    expect(result.map((s) => s.id)).toEqual(['2']);
  });

  it('combines query + category conjunctively', () => {
    const a = makeSetup({ id: '1', slug: 'a', name: 'Foo', category: 'marketing' });
    const b = makeSetup({ id: '2', slug: 'b', name: 'Foo', category: 'engineering' });
    const c = makeSetup({ id: '3', slug: 'c', name: 'Bar', category: 'marketing' });
    const result = filterList([a, b, c], { query: 'foo', category: 'marketing' });
    expect(result.map((s) => s.id)).toEqual(['1']);
  });

  it('combines query + category + kind conjunctively', () => {
    const a = makeSetup({
      id: '1',
      slug: 'a',
      name: 'Foo',
      category: 'marketing',
      kind: 'setup',
    });
    const b = makeSetup({
      id: '2',
      slug: 'b',
      name: 'Foo',
      category: 'marketing',
      kind: 'agent',
    });
    const result = filterList([a, b], { query: 'foo', category: 'marketing', kind: 'setup' });
    expect(result.map((s) => s.id)).toEqual(['1']);
  });

  it('returns all items when criteria is empty', () => {
    const items = [
      makeSetup({ id: '1', slug: 'a', name: 'X' }),
      makeSetup({ id: '2', slug: 'b', name: 'Y' }),
    ];
    expect(filterList(items, {})).toHaveLength(2);
  });
});

// ─── sortList ─────────────────────────────────────────────────────────────────

describe('sortList', () => {
  it('popularity: sorts by popularity descending', () => {
    const a = makeSetup({ id: '1', slug: 'a', name: 'A', popularity: 5 });
    const b = makeSetup({ id: '2', slug: 'b', name: 'B', popularity: 20 });
    const c = makeSetup({ id: '3', slug: 'c', name: 'C', popularity: 10 });
    const result = sortList([a, b, c], 'popularity');
    expect(result.map((s) => s.id)).toEqual(['2', '3', '1']);
  });

  it('popularity: breaks ties by upvotes descending', () => {
    const a = makeSetup({ id: '1', slug: 'a', name: 'A', popularity: 10, upvotes: 5 });
    const b = makeSetup({ id: '2', slug: 'b', name: 'B', popularity: 10, upvotes: 20 });
    const result = sortList([a, b], 'popularity');
    expect(result.map((s) => s.id)).toEqual(['2', '1']);
  });

  it('popularity: breaks upvotes tie by name ascending', () => {
    const a = makeSetup({ id: '1', slug: 'a', name: 'Zebra', popularity: 10, upvotes: 5 });
    const b = makeSetup({ id: '2', slug: 'b', name: 'Apple', popularity: 10, upvotes: 5 });
    const result = sortList([a, b], 'popularity');
    expect(result.map((s) => s.id)).toEqual(['2', '1']);
  });

  it('upvotes: sorts by upvotes descending', () => {
    const a = makeSetup({ id: '1', slug: 'a', name: 'A', upvotes: 5 });
    const b = makeSetup({ id: '2', slug: 'b', name: 'B', upvotes: 20 });
    const c = makeSetup({ id: '3', slug: 'c', name: 'C', upvotes: 1 });
    const result = sortList([a, b, c], 'upvotes');
    expect(result.map((s) => s.id)).toEqual(['2', '1', '3']);
  });

  it('upvotes: breaks ties by name ascending', () => {
    const a = makeSetup({ id: '1', slug: 'a', name: 'Zebra', upvotes: 10 });
    const b = makeSetup({ id: '2', slug: 'b', name: 'Apple', upvotes: 10 });
    const result = sortList([a, b], 'upvotes');
    expect(result.map((s) => s.id)).toEqual(['2', '1']);
  });

  it('recency: sorts by updatedAt descending (newest first)', () => {
    const a = makeSetup({
      id: '1',
      slug: 'a',
      name: 'A',
      updatedAt: '2024-01-01T00:00:00Z',
    });
    const b = makeSetup({
      id: '2',
      slug: 'b',
      name: 'B',
      updatedAt: '2025-06-01T00:00:00Z',
    });
    const c = makeSetup({
      id: '3',
      slug: 'c',
      name: 'C',
      updatedAt: '2023-12-01T00:00:00Z',
    });
    const result = sortList([a, b, c], 'recency');
    expect(result.map((s) => s.id)).toEqual(['2', '1', '3']);
  });

  it('does not mutate the input array', () => {
    const items = [
      makeSetup({ id: '1', slug: 'a', name: 'Zebra', upvotes: 1 }),
      makeSetup({ id: '2', slug: 'b', name: 'Apple', upvotes: 10 }),
    ];
    const firstId = items[0].id;
    sortList(items, 'upvotes');
    expect(items[0].id).toBe(firstId);
  });
});

// ─── detailPathFor ────────────────────────────────────────────────────────────

describe('detailPathFor', () => {
  it('returns /setup/[slug] for kind=setup', () => {
    const s = makeSetup({ id: '1', slug: 'my-setup', name: 'My Setup', kind: 'setup' });
    expect(detailPathFor(s)).toBe('/setup/my-setup');
  });

  it('returns /dev/[slug] for kind=agent', () => {
    const s = makeSetup({ id: '2', slug: 'my-agent', name: 'My Agent', kind: 'agent' });
    expect(detailPathFor(s)).toBe('/dev/my-agent');
  });

  it('returns /dev/[slug] for kind=skill', () => {
    const s = makeSetup({ id: '3', slug: 'my-skill', name: 'My Skill', kind: 'skill' });
    expect(detailPathFor(s)).toBe('/dev/my-skill');
  });

  it('returns /dev/[slug] for kind=harness', () => {
    const s = makeSetup({ id: '4', slug: 'my-harness', name: 'My Harness', kind: 'harness' });
    expect(detailPathFor(s)).toBe('/dev/my-harness');
  });
});
