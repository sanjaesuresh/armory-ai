/**
 * Community upvotes (Phase 5 Task 7). One upvote per user per setup; toggling
 * removes it. The unique (user, setup) pair is the source of truth and the
 * denormalized setups.upvotes count is kept in sync by a database trigger, so
 * this module only writes the upvote rows. Counts feed the recommender's
 * popularity term (see computePopularity's upvotesBySlug).
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export interface UpvotesStore {
  has(userId: string, setupId: string): Promise<boolean>;
  add(userId: string, setupId: string, now: string): Promise<void>;
  remove(userId: string, setupId: string): Promise<void>;
  count(setupId: string): Promise<number>;
}

export interface ToggleResult {
  /** True if the user now has an upvote on this setup. */
  upvoted: boolean;
  /** The setup's upvote count after the toggle. */
  count: number;
}

/**
 * Toggles the current user's upvote on a setup: adds it if absent, removes it if
 * present, then returns the new state and count.
 */
export async function toggleUpvote(
  params: { userId: string; setupId: string },
  store: UpvotesStore,
  now: string,
): Promise<ToggleResult> {
  const { userId, setupId } = params;
  const had = await store.has(userId, setupId);
  if (had) {
    await store.remove(userId, setupId);
  } else {
    await store.add(userId, setupId, now);
  }
  const count = await store.count(setupId);
  return { upvoted: !had, count };
}

// ─── Supabase-backed store ────────────────────────────────────────────────────

/** Postgres unique-violation SQLSTATE (mirrors reports.ts). */
const UNIQUE_VIOLATION = '23505';

export function createSupabaseUpvotesStore(client: SupabaseClient): UpvotesStore {
  return {
    async has(userId, setupId) {
      const { data, error } = await client
        .from('upvotes')
        .select('setup_id')
        .eq('user_id', userId)
        .eq('setup_id', setupId)
        .maybeSingle();
      if (error) throw new Error(`upvote lookup failed: ${error.message}`);
      return data !== null;
    },
    async add(userId, setupId, now) {
      const { error } = await client.from('upvotes').insert({ user_id: userId, setup_id: setupId, created_at: now });
      if (error) {
        // Concurrent double-add hits the (user_id, setup_id) PK — treat as success,
        // the upvote already exists. Mirrors the reports.ts duplicate pattern.
        if ((error as { code?: string }).code === UNIQUE_VIOLATION) return;
        throw new Error(`upvote add failed: ${error.message}`);
      }
    },
    async remove(userId, setupId) {
      const { error } = await client.from('upvotes').delete().eq('user_id', userId).eq('setup_id', setupId);
      if (error) throw new Error(`upvote remove failed: ${error.message}`);
    },
    async count(setupId) {
      const { count, error } = await client
        .from('upvotes')
        .select('*', { count: 'exact', head: true })
        .eq('setup_id', setupId);
      if (error) throw new Error(`upvote count failed: ${error.message}`);
      return count ?? 0;
    },
  };
}
