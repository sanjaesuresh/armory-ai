/**
 * Saved-setups data access (Phase 4 Task 3).
 *
 * A signed-in user can save a customized setup — the setup id + version and
 * exactly the answers they entered, under a name — and later resume, rename, or
 * delete it. All access is owner-scoped by Row Level Security; the store simply
 * wraps a Supabase client whose JWT is the user's (browser client) or a
 * request-scoped server client. RLS, not this code, is the security boundary.
 *
 * Two pure functions carry the phase's edge rules and are unit-tested directly:
 *   - reconcileAnswers(): on resume, drop any saved answer whose variable no
 *     longer exists in the current setup version, and report which were dropped.
 *     This upholds the compiler-safety invariant: the compiler never sees a key
 *     the current setup doesn't define.
 *   - rowToSavedSetup(): map a DB row to the domain object.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Answers } from '@/lib/setup/types';

// ─── Domain + row types ───────────────────────────────────────────────────────

export interface SavedSetup {
  id: string;
  userId: string;
  setupId: string;
  setupVersion: string;
  name: string;
  answers: Answers;
  createdAt: string;
  updatedAt: string;
}

/** Shape of a `saved_setups` row as returned by Supabase (snake_case). */
export interface SavedSetupRow {
  id: string;
  user_id: string;
  setup_id: string;
  setup_version: string;
  name: string;
  answers: unknown;
  created_at: string;
  updated_at: string;
}

/** Fields required to persist a new saved setup. */
export interface SaveSetupInput {
  userId: string;
  setupId: string;
  setupVersion: string;
  name: string;
  answers: Answers;
}

// ─── Pure helpers ─────────────────────────────────────────────────────────────

/** Maps a DB row to the domain object. Exported for unit testing the mapping. */
export function rowToSavedSetup(row: SavedSetupRow): SavedSetup {
  return {
    id: row.id,
    userId: row.user_id,
    setupId: row.setup_id,
    setupVersion: row.setup_version,
    name: row.name,
    // answers is stored as jsonb; it is an object of primitive/array values.
    answers: (row.answers ?? {}) as Answers,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface ReconcileResult {
  /** The saved answers with unknown-variable keys removed. */
  answers: Answers;
  /** Keys present in the saved answers but absent from the current setup. */
  droppedKeys: string[];
}

/**
 * Reconciles saved answers against the current setup's variable keys. Any key
 * the current setup no longer defines is dropped (never fed to the compiler) and
 * reported so the UI can name it. Values of `false`, `0`, and `[]` for known
 * keys are preserved — only unknown keys are removed.
 */
export function reconcileAnswers(
  saved: Answers,
  currentVariableKeys: readonly string[],
): ReconcileResult {
  const known = new Set(currentVariableKeys);
  const answers: Answers = {};
  const droppedKeys: string[] = [];
  for (const [key, value] of Object.entries(saved)) {
    if (known.has(key)) {
      answers[key] = value;
    } else {
      droppedKeys.push(key);
    }
  }
  return { answers, droppedKeys };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export interface SavedSetupsStore {
  /** All of the current user's saved setups, newest-updated first. */
  list(): Promise<SavedSetup[]>;
  /** One saved setup by id, or null if not found / not owned. */
  load(id: string): Promise<SavedSetup | null>;
  /** Persist a new saved setup and return it. */
  save(input: SaveSetupInput): Promise<SavedSetup>;
  /** Rename a saved setup. */
  rename(id: string, name: string): Promise<void>;
  /** Delete a saved setup. */
  remove(id: string): Promise<void>;
}

const TABLE = 'saved_setups';

/**
 * Supabase-backed store. Pass a client whose session is the acting user — either
 * the browser client (client components) or the request-scoped server client
 * (server components / route handlers). RLS scopes every query to the owner.
 */
export function createSupabaseSavedSetupsStore(client: SupabaseClient): SavedSetupsStore {
  return {
    async list() {
      const { data, error } = await client
        .from(TABLE)
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw new Error(`saved_setups list failed: ${error.message}`);
      return (data as SavedSetupRow[]).map(rowToSavedSetup);
    },

    async load(id) {
      const { data, error } = await client
        .from(TABLE)
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw new Error(`saved_setups load failed: ${error.message}`);
      return data ? rowToSavedSetup(data as SavedSetupRow) : null;
    },

    async save(input) {
      const { data, error } = await client
        .from(TABLE)
        .insert({
          user_id: input.userId,
          setup_id: input.setupId,
          setup_version: input.setupVersion,
          name: input.name,
          answers: input.answers,
        })
        .select()
        .single();
      if (error) throw new Error(`saved_setups save failed: ${error.message}`);
      return rowToSavedSetup(data as SavedSetupRow);
    },

    async rename(id, name) {
      const { error } = await client
        .from(TABLE)
        .update({ name, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw new Error(`saved_setups rename failed: ${error.message}`);
    },

    async remove(id) {
      const { error } = await client.from(TABLE).delete().eq('id', id);
      if (error) throw new Error(`saved_setups remove failed: ${error.message}`);
    },
  };
}
