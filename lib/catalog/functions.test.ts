/**
 * Tests for lib/catalog/functions.ts — function-chip helpers.
 * Pure unit tests; no I/O, no server, deterministic.
 */

import { describe, it, expect } from 'vitest';
import {
  computeFunctionChips,
  getChipTags,
  FUNCTION_CHIP_DEFS,
} from './functions';
import type { Setup } from '@/lib/setup/types';

// ─── Fixture factory ──────────────────────────────────────────────────────────

let _id = 0;
function makeSetup(tags: string[]): Setup {
  const id = String(++_id);
  return {
    id,
    slug: `item-${id}`,
    name: `Item ${id}`,
    tagline: 'Test tagline',
    description: 'Test description',
    role: 'developer',
    industry: null,
    tags,
    category: 'engineering',
    source: 'curated',
    author: null,
    version: '1.0.0',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',
    instructionTemplate: '',
    variables: [],
    knowledgeFiles: [],
    scenarios: [],
    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
    kind: 'agent',
  };
}

// ─── computeFunctionChips ─────────────────────────────────────────────────────

describe('computeFunctionChips', () => {
  it('returns an empty array when no items match any chip', () => {
    const items = [makeSetup(['no-match-tag', 'another-unknown'])];
    expect(computeFunctionChips(items)).toHaveLength(0);
  });

  it('returns only chips with ≥1 matching item', () => {
    const items = [makeSetup(['code-review'])]; // Review chip
    const chips = computeFunctionChips(items);
    expect(chips.some((c) => c.label === 'Review')).toBe(true);
    expect(chips.every((c) => c.count > 0)).toBe(true);
  });

  it('counts correctly when multiple items match the same chip', () => {
    const items = [
      makeSetup(['code-review']),
      makeSetup(['quality']),
      makeSetup(['tdd']),
    ];
    const chips = computeFunctionChips(items);
    const review = chips.find((c) => c.label === 'Review');
    expect(review).toBeDefined();
    expect(review!.count).toBe(2);
    const test = chips.find((c) => c.label === 'Test');
    expect(test).toBeDefined();
    expect(test!.count).toBe(1);
  });

  it('counts an item only once per chip even if it matches multiple tags in the chip', () => {
    // code-review AND security both belong to Review
    const items = [makeSetup(['code-review', 'security'])];
    const chips = computeFunctionChips(items);
    const review = chips.find((c) => c.label === 'Review')!;
    expect(review.count).toBe(1);
  });

  it('preserves FUNCTION_CHIP_DEFS order among returned chips', () => {
    const items = [makeSetup(['tdd', 'code-review', 'software-engineer'])];
    const chips = computeFunctionChips(items);
    const labels = chips.map((c) => c.label);
    // Review is before Test is before Build in FUNCTION_CHIP_DEFS
    expect(labels.indexOf('Review')).toBeLessThan(labels.indexOf('Test'));
    expect(labels.indexOf('Test')).toBeLessThan(labels.indexOf('Build'));
  });

  it('does not mutate the input array', () => {
    const items = [makeSetup(['code-review'])];
    const snapshot = [...items];
    computeFunctionChips(items);
    expect(items).toEqual(snapshot);
  });

  it('returns an empty array when the input is empty', () => {
    expect(computeFunctionChips([])).toHaveLength(0);
  });

  it('Review, Build, and Plan chips appear when items with their tags are present', () => {
    const items = [
      makeSetup(['code-review']),       // Review
      makeSetup(['software-engineer']), // Build
      makeSetup(['kickoff']),           // Plan
    ];
    const chips = computeFunctionChips(items);
    const labels = chips.map((c) => c.label);
    expect(labels).toContain('Review');
    expect(labels).toContain('Build');
    expect(labels).toContain('Plan');
  });
});

// ─── getChipTags ─────────────────────────────────────────────────────────────

describe('getChipTags', () => {
  it('returns the correct tag set for a known label', () => {
    const tags = getChipTags('Review');
    expect(tags.has('code-review')).toBe(true);
    expect(tags.has('quality')).toBe(true);
    expect(tags.has('security')).toBe(true);
  });

  it('returns an empty set for an unknown label', () => {
    const tags = getChipTags('NonExistentChip');
    expect(tags.size).toBe(0);
  });

  it('is case-sensitive — mismatched case returns an empty set', () => {
    const tags = getChipTags('review'); // lowercase 'r'
    expect(tags.size).toBe(0);
  });

  it('covers Review, Build, and Plan labels as required by the spec', () => {
    for (const label of ['Review', 'Build', 'Plan'] as const) {
      const tags = getChipTags(label);
      expect(tags.size, `${label} chip must have tags`).toBeGreaterThan(0);
    }
  });

  it('all FUNCTION_CHIP_DEFS labels return a non-empty set', () => {
    for (const def of FUNCTION_CHIP_DEFS) {
      const tags = getChipTags(def.label);
      expect(tags.size, `${def.label} should have tags`).toBeGreaterThan(0);
    }
  });
});
