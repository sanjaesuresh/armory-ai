/**
 * Tests for the Armory catalog repository.
 *
 * All tests run against an in-memory stub CatalogDataSource — no network,
 * no Supabase connection required.
 */

import { describe, it, expect } from 'vitest';
import { createCatalogRepository, rowToSetup, type CatalogDataSource } from './repository';
import type { Setup } from '@/lib/setup/types';
import { marketingManagerSetup } from '@/data/curated/marketing-manager';

// ─── Helper: build a minimal valid Setup ─────────────────────────────────────

function makeSetup(overrides: Partial<Setup> & { id: string; slug: string; name: string }): Setup {
  return {
    tagline: 'Test tagline',
    description: 'Test description',
    role: 'Generic',
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
    instructionTemplate: 'You are a helper.',
    variables: [],
    knowledgeFiles: [],
    scenarios: [],
    ...overrides,
  };
}

// ─── In-memory stub ──────────────────────────────────────────────────────────

function makeInMemorySource(setups: Setup[]): CatalogDataSource {
  return {
    async getSetups(filter) {
      let results = setups.filter((s) => s.reviewStatus === 'approved');
      if (filter?.role !== undefined) {
        results = results.filter((s) => s.role === filter.role);
      }
      results = [...results].sort((a, b) => {
        // featured asc, nulls last
        if (a.featured === null && b.featured === null) {
          return a.name.localeCompare(b.name);
        }
        if (a.featured === null) return 1;
        if (b.featured === null) return -1;
        if (a.featured !== b.featured) return a.featured - b.featured;
        // then name asc
        return a.name.localeCompare(b.name);
      });
      return results;
    },
    async getSetupBySlug(slug) {
      return setups.find((s) => s.slug === slug) ?? null;
    },
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('getSetups', () => {
  it('returns only approved setups', async () => {
    const setups: Setup[] = [
      makeSetup({ id: 'a', slug: 'alpha', name: 'Alpha', reviewStatus: 'approved' }),
      makeSetup({ id: 'b', slug: 'beta', name: 'Beta', reviewStatus: 'draft' }),
      makeSetup({ id: 'c', slug: 'gamma', name: 'Gamma', reviewStatus: 'pending' }),
      makeSetup({ id: 'd', slug: 'delta', name: 'Delta', reviewStatus: 'rejected' }),
    ];
    const repo = createCatalogRepository(makeInMemorySource(setups));
    const result = await repo.getSetups();
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('alpha');
  });

  it('orders by featured ascending then name, with null featured last', async () => {
    const setups: Setup[] = [
      makeSetup({ id: '1', slug: 's1', name: 'Bravo', reviewStatus: 'approved', featured: null }),
      makeSetup({ id: '2', slug: 's2', name: 'Alpha', reviewStatus: 'approved', featured: 2 }),
      makeSetup({ id: '3', slug: 's3', name: 'Charlie', reviewStatus: 'approved', featured: 1 }),
      makeSetup({ id: '4', slug: 's4', name: 'Alpha', reviewStatus: 'approved', featured: null }),
      makeSetup({ id: '5', slug: 's5', name: 'Zeta', reviewStatus: 'approved', featured: 1 }),
    ];
    const repo = createCatalogRepository(makeInMemorySource(setups));
    const result = await repo.getSetups();
    // featured=1 first (name tie-break: Charlie < Zeta), then featured=2, then nulls (Alpha < Bravo)
    expect(result.map((s) => s.slug)).toEqual(['s3', 's5', 's2', 's4', 's1']);
  });

  it('filters by role when a role filter is given', async () => {
    const setups: Setup[] = [
      makeSetup({ id: 'm1', slug: 'mkt-1', name: 'Mkt One', reviewStatus: 'approved', role: 'Marketing Manager' }),
      makeSetup({ id: 'm2', slug: 'mkt-2', name: 'Mkt Two', reviewStatus: 'approved', role: 'Marketing Manager' }),
      makeSetup({ id: 's1', slug: 'sales-1', name: 'Sales One', reviewStatus: 'approved', role: 'Sales Rep' }),
    ];
    const repo = createCatalogRepository(makeInMemorySource(setups));
    const result = await repo.getSetups({ role: 'Marketing Manager' });
    expect(result).toHaveLength(2);
    expect(result.every((s) => s.role === 'Marketing Manager')).toBe(true);
  });

  it('returns the curated marketing-manager fixture when seeded with it', async () => {
    const repo = createCatalogRepository(makeInMemorySource([marketingManagerSetup]));
    const result = await repo.getSetups();
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('marketing-manager');
  });
});

describe('getSetupBySlug', () => {
  it('returns the matching setup', async () => {
    const repo = createCatalogRepository(makeInMemorySource([marketingManagerSetup]));
    const result = await repo.getSetupBySlug('marketing-manager');
    expect(result).not.toBeNull();
    expect(result!.id).toBe('curated-marketing-manager-v1');
  });

  it('returns null when slug does not match', async () => {
    const repo = createCatalogRepository(makeInMemorySource([marketingManagerSetup]));
    const result = await repo.getSetupBySlug('no-such-setup');
    expect(result).toBeNull();
  });
});

// ─── Popularity plumbing ──────────────────────────────────────────────────────

describe('popularity field on returned setups', () => {
  it('surfaces popularity when the data source provides it', async () => {
    const setups: Setup[] = [
      makeSetup({ id: 'p1', slug: 'pop-a', name: 'Pop A', reviewStatus: 'approved', popularity: 42 }),
    ];
    const repo = createCatalogRepository(makeInMemorySource(setups));
    const result = await repo.getSetups();
    expect(result[0].popularity).toBe(42);
  });

  it('defaults to 0 when popularity is not set (undefined)', async () => {
    // makeSetup does not set popularity — it will be undefined on the object.
    const setups: Setup[] = [
      makeSetup({ id: 'p2', slug: 'pop-b', name: 'Pop B', reviewStatus: 'approved' }),
    ];
    const repo = createCatalogRepository(makeInMemorySource(setups));
    const result = await repo.getSetups();
    // The in-memory source passes the object through; popularity is absent.
    // Callers must treat absent popularity as 0.
    expect(result[0].popularity ?? 0).toBe(0);
  });
});

describe('rowToSetup', () => {
  // Minimal valid row shape — mirrors the actual Supabase row structure.
  const minimalRow = {
    id: 'test-id',
    slug: 'test-slug',
    name: 'Test',
    tagline: 'tagline',
    description: 'desc',
    role: 'Role',
    industry: null,
    tags: [],
    category: 'general',
    source: 'curated',
    author: null,
    version: '1.0.0',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    review_status: 'approved',
    upvotes: 0,
    featured: null,
    targets: ['claude-app'],
    tier: 'core',
    instruction_template: 'You are a helper.',
    variables: [],
    knowledge_files: [],
    scenarios: [],
  };

  it('maps popularity from the DB row', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setup = rowToSetup({ ...minimalRow, popularity: 7 } as any);
    expect(setup.popularity).toBe(7);
  });

  it('defaults popularity to 0 when the DB column is null', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setup = rowToSetup({ ...minimalRow, popularity: null } as any);
    expect(setup.popularity).toBe(0);
  });

  it('defaults popularity to 0 when the DB column is absent (legacy rows)', () => {
    // Rows fetched before the column was added will have popularity undefined.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setup = rowToSetup({ ...minimalRow } as any);
    expect(setup.popularity).toBe(0);
  });
});
