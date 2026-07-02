/**
 * Catalog repository: read-only access to published Setups.
 *
 * Architecture:
 *   CatalogDataSource — minimal interface for data retrieval.
 *   createSupabaseDataSource() — Supabase-backed implementation (lazy: only
 *     instantiated on first call so tests that never use it skip the env-var check).
 *   createCatalogRepository(dataSource?) — factory that returns getSetups /
 *     getSetupBySlug. Accepts an injected data source for testing.
 */

import type { Setup } from '@/lib/setup/types';
import { createSupabaseClient } from '@/lib/supabase/client';

// ─── Filter ──────────────────────────────────────────────────────────────────

export interface SetupFilter {
  /** Exact match against Setup.role. */
  role?: string;
}

// ─── CatalogDataSource interface ─────────────────────────────────────────────

export interface CatalogDataSource {
  /**
   * Return approved setups ordered by featured asc (nulls last), then name asc.
   * Optionally filter by exact role match.
   */
  getSetups(filter?: SetupFilter): Promise<Setup[]>;

  /** Return one setup by slug (any reviewStatus), or null if not found. */
  getSetupBySlug(slug: string): Promise<Setup | null>;
}

// ─── Supabase row type ───────────────────────────────────────────────────────

interface SetupRow {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  role: string;
  industry: string | null;
  tags: string[];
  category: string;
  source: string;
  author: string | null;
  version: string;
  created_at: string;
  updated_at: string;
  review_status: string;
  upvotes: number;
  featured: number | null;
  targets: string[];
  tier: string;
  instruction_template: string;
  variables: unknown;
  knowledge_files: unknown;
  scenarios: unknown;
}

function rowToSetup(row: SetupRow): Setup {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    role: row.role,
    industry: row.industry,
    tags: row.tags,
    category: row.category as Setup['category'],
    source: row.source as Setup['source'],
    author: row.author,
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    reviewStatus: row.review_status as Setup['reviewStatus'],
    upvotes: row.upvotes,
    featured: row.featured,
    targets: row.targets as Setup['targets'],
    tier: row.tier as Setup['tier'],
    instructionTemplate: row.instruction_template,
    variables: row.variables as Setup['variables'],
    knowledgeFiles: row.knowledge_files as Setup['knowledgeFiles'],
    scenarios: row.scenarios as Setup['scenarios'],
  };
}

// ─── Supabase-backed implementation ──────────────────────────────────────────

export function createSupabaseDataSource(): CatalogDataSource {
  // Lazy client — created on first method call, not at module load.
  let client: ReturnType<typeof createSupabaseClient> | null = null;

  function getClient() {
    if (!client) client = createSupabaseClient();
    return client;
  }

  return {
    async getSetups(filter) {
      let query = getClient()
        .from('setups')
        .select('*')
        .eq('review_status', 'approved')
        // Supabase PostgREST: nullsFirst=false means nulls last for ascending
        .order('featured', { ascending: true, nullsFirst: false })
        .order('name', { ascending: true });

      if (filter?.role !== undefined) {
        query = query.eq('role', filter.role);
      }

      const { data, error } = await query;
      if (error) throw new Error(`Supabase getSetups error: ${error.message}`);
      return (data as SetupRow[]).map(rowToSetup);
    },

    async getSetupBySlug(slug) {
      const { data, error } = await getClient()
        .from('setups')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw new Error(`Supabase getSetupBySlug error: ${error.message}`);
      if (!data) return null;
      return rowToSetup(data as SetupRow);
    },
  };
}

// ─── Repository factory ───────────────────────────────────────────────────────

export interface CatalogRepository {
  getSetups(filter?: SetupFilter): Promise<Setup[]>;
  getSetupBySlug(slug: string): Promise<Setup | null>;
}

/**
 * Creates the catalog repository.
 *
 * @param dataSource - injectable data source; defaults to Supabase. Pass an
 *   in-memory stub in tests so no network connection is required.
 */
export function createCatalogRepository(
  dataSource: CatalogDataSource = createSupabaseDataSource(),
): CatalogRepository {
  return {
    getSetups(filter) {
      return dataSource.getSetups(filter);
    },
    getSetupBySlug(slug) {
      return dataSource.getSetupBySlug(slug);
    },
  };
}
