/**
 * Learn AI progress store — localStorage + Supabase write-through.
 *
 * Mechanism mirrored: createSupabaseSavedSetupsStore in lib/saved/savedSetups.ts
 * — accepts a SupabaseClient parameter for RLS-scoped access via the browser
 * session; callers pass createSupabaseBrowserClient() in production.
 *
 * Local is always authoritative for the session. Remote failures are logged and
 * swallowed so a network hiccup never breaks the learner's flow.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { LEARN_PROGRESS_STORAGE_KEY } from '@/lib/learn/types';
import type { LessonProgress, ProgressMap } from '@/lib/learn/types';
import {
  markStarted as pureMarkStarted,
  recordQuizResult as pureRecordQuizResult,
  mergeProgress,
} from '@/lib/learn/progress';

// ─── Table name ───────────────────────────────────────────────────────────────

const TABLE = 'learn_progress';

// ─── Row shape ────────────────────────────────────────────────────────────────

/** DB row as returned by Supabase (snake_case). Absent columns default gracefully. */
interface LearnProgressRow {
  lesson_slug: string;
  status: string;
  best_score_pct?: number | null;
  completed_at?: string | null;
  updated_at?: string;
}

function rowToLessonProgress(row: LearnProgressRow): LessonProgress {
  const rawStatus = row.status;
  const status =
    rawStatus === 'completed' || rawStatus === 'in-progress'
      ? rawStatus
      : ('not-started' as const);
  return {
    status,
    bestScorePct: row.best_score_pct ?? null,
    completedAt: row.completed_at ?? null,
  };
}

function rowsToProgressMap(rows: LearnProgressRow[]): ProgressMap {
  const map: ProgressMap = {};
  for (const row of rows) {
    map[row.lesson_slug] = rowToLessonProgress(row);
  }
  return map;
}

function progressToRow(
  userId: string,
  slug: string,
  progress: LessonProgress,
): Record<string, unknown> {
  return {
    user_id: userId,
    lesson_slug: slug,
    status: progress.status,
    best_score_pct: progress.bestScorePct,
    completed_at: progress.completedAt,
    updated_at: new Date().toISOString(),
  };
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

/**
 * Reads and parses the progress key from localStorage.
 * Returns an empty map on a missing key, corrupt JSON, or a non-object value.
 * Never throws.
 */
export function loadLocalProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(LEARN_PROGRESS_STORAGE_KEY);
    if (raw === null) return {};
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return {};
    }
    return parsed as ProgressMap;
  } catch {
    return {};
  }
}

/**
 * Serializes map back to localStorage. Swallows QuotaExceededError and any
 * other storage errors — local is best-effort.
 */
export function saveLocalProgress(map: ProgressMap): void {
  try {
    localStorage.setItem(LEARN_PROGRESS_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Swallow QuotaExceededError and other storage errors.
  }
}

// ─── Store factory ────────────────────────────────────────────────────────────

/**
 * Creates the learn-progress store for the given user (null = anonymous).
 *
 * Pass a SupabaseClient whose session is the acting user — either
 * createSupabaseBrowserClient() in client components or the request-scoped
 * server client in server components. RLS scopes every query to the owner.
 *
 * When userId is null (anonymous), all Supabase calls are skipped and local
 * storage is the only persistence layer.
 */
export function createLearnProgressStore(
  userId: string | null,
  client: SupabaseClient,
) {
  /** Upserts one lesson row remotely. Logs and swallows any failure. */
  async function upsertRemote(
    slug: string,
    progress: LessonProgress,
  ): Promise<void> {
    if (!userId) return;
    try {
      const { error } = await client
        .from(TABLE)
        .upsert(progressToRow(userId, slug, progress), {
          onConflict: 'user_id,lesson_slug',
        });
      if (error) {
        console.error('[learn_progress] upsert failed:', error);
      }
    } catch (err) {
      console.error('[learn_progress] upsert error:', err);
    }
  }

  return {
    /**
     * Loads the current progress map.
     *
     * Anonymous: returns local map immediately.
     * Signed-in: fetches the user's rows, merges with local (higher status
     * wins per mergeProgress), writes the merged result back to both sides,
     * and returns it. Remote failures fall back to the local map.
     */
    async load(): Promise<ProgressMap> {
      const local = loadLocalProgress();
      if (!userId) return local;

      try {
        const { data, error } = await client
          .from(TABLE)
          .select(
            'lesson_slug, status, best_score_pct, completed_at, updated_at',
          )
          .eq('user_id', userId);

        if (error) {
          console.error('[learn_progress] load failed:', error);
          return local;
        }

        const remote = rowsToProgressMap((data as LearnProgressRow[]) ?? []);
        const merged = mergeProgress(local, remote);

        // Write merged result back to local
        saveLocalProgress(merged);

        // Write merged result back to remote (upsert all changed rows)
        const rows = Object.entries(merged).map(([slug, progress]) =>
          progressToRow(userId, slug, progress),
        );
        if (rows.length > 0) {
          const { error: upsertErr } = await client
            .from(TABLE)
            .upsert(rows, { onConflict: 'user_id,lesson_slug' });
          if (upsertErr) {
            console.error('[learn_progress] merge upsert failed:', upsertErr);
          }
        }

        return merged;
      } catch (err) {
        console.error('[learn_progress] load error:', err);
        return local;
      }
    },

    /**
     * Marks a lesson as in-progress. No-op if already in-progress or completed.
     * Saves locally always; upserts remotely when signed in (failures swallowed).
     */
    async markStarted(slug: string): Promise<void> {
      const local = loadLocalProgress();
      const updated = pureMarkStarted(local, slug, new Date().toISOString());
      saveLocalProgress(updated);
      const entry = updated[slug];
      if (entry) {
        await upsertRemote(slug, entry);
      }
    },

    /**
     * Records a quiz result for slug. Calculates score, marks completed.
     * Saves locally always; upserts remotely when signed in (failures swallowed).
     */
    async recordQuiz(
      slug: string,
      correct: number,
      total: number,
    ): Promise<void> {
      const local = loadLocalProgress();
      const updated = pureRecordQuizResult(
        local,
        slug,
        correct,
        total,
        new Date().toISOString(),
      );
      saveLocalProgress(updated);
      const entry = updated[slug];
      if (entry) {
        await upsertRemote(slug, entry);
      }
    },
  };
}
