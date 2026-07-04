/**
 * Test-drive history data access (Phase 4 Task 4).
 *
 * A signed-in user's record of the test-drives they've run — setup, scenario,
 * when, a short output snippet, and whether the result came from cache. Rows
 * live in the `testdrive_runs` table (separate from the cost/quota ledger in
 * `testdrive_usage`). The runner records here with the service-role client
 * (bypassing RLS, setting the correct user id); the history page reads with the
 * user's own session client under owner-only RLS.
 *
 * Anonymous runs write no history row.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

// ─── Domain + row types ───────────────────────────────────────────────────────

export interface TestDriveHistoryEntry {
  id: string;
  setupSlug: string;
  setupName: string;
  scenarioId: string;
  scenarioTitle: string;
  outputSnippet: string;
  cached: boolean;
  createdAt: string;
}

export interface TestDriveRunRow {
  id: string;
  setup_slug: string;
  setup_name: string;
  scenario_id: string;
  scenario_title: string;
  output_snippet: string;
  cached: boolean;
  created_at: string;
}

/** Everything the runner knows about a completed signed-in run. */
export interface RecordRunInput {
  userId: string;
  setupSlug: string;
  setupName: string;
  scenarioId: string;
  scenarioTitle: string;
  /** Full model output; truncated to a snippet before storage. */
  output: string;
  cached: boolean;
  createdAt: string;
}

// ─── Pure helpers ─────────────────────────────────────────────────────────────

/** Default max characters kept for a stored output snippet. */
export const SNIPPET_MAX_CHARS = 280;

/**
 * Truncates model output to a stored snippet: collapses to a single trimmed
 * block and caps the length with an ellipsis. History is a preview, not an
 * archive — the full text is never persisted.
 */
export function historySnippet(output: string, maxChars: number = SNIPPET_MAX_CHARS): string {
  const collapsed = output.trim();
  if (collapsed.length <= maxChars) return collapsed;
  return collapsed.slice(0, maxChars).trimEnd() + '…';
}

export function rowToHistoryEntry(row: TestDriveRunRow): TestDriveHistoryEntry {
  return {
    id: row.id,
    setupSlug: row.setup_slug,
    setupName: row.setup_name,
    scenarioId: row.scenario_id,
    scenarioTitle: row.scenario_title,
    outputSnippet: row.output_snippet,
    cached: row.cached,
    createdAt: row.created_at,
  };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export interface TestDriveHistoryStore {
  /** Records one signed-in run. Truncates the output to a snippet. */
  record(input: RecordRunInput): Promise<void>;
  /** Lists the current user's runs, newest first (RLS-scoped). */
  list(): Promise<TestDriveHistoryEntry[]>;
}

const TABLE = 'testdrive_runs';

/**
 * Supabase-backed history store. For recording, pass the service-role client
 * (the runner runs server-side, RLS-bypassing, and sets the correct user id).
 * For listing, pass the request-scoped server client so RLS scopes rows to the
 * owner.
 */
export function createSupabaseTestDriveHistoryStore(client: SupabaseClient): TestDriveHistoryStore {
  return {
    async record(input) {
      const { error } = await client.from(TABLE).insert({
        user_id: input.userId,
        setup_slug: input.setupSlug,
        setup_name: input.setupName,
        scenario_id: input.scenarioId,
        scenario_title: input.scenarioTitle,
        output_snippet: historySnippet(input.output),
        cached: input.cached,
        created_at: input.createdAt,
      });
      if (error) throw new Error(`testdrive_runs record failed: ${error.message}`);
    },

    async list() {
      const { data, error } = await client
        .from(TABLE)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(`testdrive_runs list failed: ${error.message}`);
      return (data as TestDriveRunRow[]).map(rowToHistoryEntry);
    },
  };
}
