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

import type { Setup, SetupKind } from '@/lib/setup/types';
import { REGISTRY_KINDS } from '@/lib/setup/types';
import { createSupabaseClient } from '@/lib/supabase/client';

// ─── Kind guard ──────────────────────────────────────────────────────────────

/**
 * Runtime guard: accepts only the four valid SetupKind values.
 * Any other DB value (unexpected string, null, undefined) falls back to 'setup'
 * so the app never propagates an invalid kind through the domain layer.
 */
function guardKind(v: unknown): SetupKind {
  if (v === 'setup') return 'setup';
  if ((REGISTRY_KINDS as ReadonlyArray<string>).includes(v as string)) return v as SetupKind;
  return 'setup';
}

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

export interface SetupRow {
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
  /** Nullable: rows that pre-date the popularity column return null. */
  popularity: number | null;
  targets: string[];
  tier: string;
  instruction_template: string;
  variables: unknown;
  knowledge_files: unknown;
  scenarios: unknown;
  /** Moderator note set during review; not present on curated rows. */
  review_note?: string | null;
  /**
   * Operational: brief + per-scenario eval evidence for the P6-4 moderator queue.
   * Only ai-generated rows populate this; curated and community rows leave it null.
   * Not a content field — not mapped into the Setup domain type.
   */
  generation_meta?: unknown;
  // ── Phase 8: registry columns (optional so the mapper tolerates pre-migration rows) ──
  /** Discriminator: 'setup' | 'agent' | 'skill' | 'harness'. Absent on legacy rows → defaults to 'setup'. */
  kind?: string;
  /** JSONB array of bundled artifact files. Absent on legacy rows → defaults to []. */
  artifact_files?: unknown;
  /** GitHub HTTPS URL for the registry item's source repo, or null. */
  repo_url?: string | null;
  /** JSONB array of CLI/slash-command capabilities. Absent on legacy rows → defaults to []. */
  capabilities?: unknown;
}

/** Exported for unit testing the DB-row → Setup mapping. */
export function rowToSetup(row: SetupRow): Setup {
  return {
    // guardKind validates the DB value; any unexpected string falls back to 'setup'.
    kind: guardKind(row.kind),
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
    // Default 0 for rows that pre-date the popularity column (null or absent).
    popularity: row.popularity ?? 0,
    targets: row.targets as Setup['targets'],
    tier: row.tier as Setup['tier'],
    instructionTemplate: row.instruction_template,
    variables: row.variables as Setup['variables'],
    knowledgeFiles: row.knowledge_files as Setup['knowledgeFiles'],
    scenarios: row.scenarios as Setup['scenarios'],
    // Registry-only fields: absent on legacy (pre-migration) rows — default to safe empty values.
    artifactFiles: (row.artifact_files as Setup['artifactFiles']) ?? [],
    repoUrl: row.repo_url ?? null,
    capabilities: (row.capabilities as Setup['capabilities']) ?? [],
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
