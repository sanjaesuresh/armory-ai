/**
 * Pure progress-logic functions for the Learn AI feature.
 *
 * No I/O, no Date.now() — time arrives as an ISO-string argument (nowIso).
 * All returned maps are new objects; inputs are never mutated.
 */

import { TRACKS } from '@/lib/learn/types';
import type {
  Lesson,
  LearnTrack,
  LessonProgress,
  LessonProgressStatus,
  ProgressMap,
} from '@/lib/learn/types';

// ─── Status ordering (higher index = higher status) ───────────────────────────

const STATUS_RANK: Record<LessonProgressStatus, number> = {
  'not-started': 0,
  'in-progress': 1,
  completed: 2,
};

// ─── statusOf ─────────────────────────────────────────────────────────────────

/**
 * Returns the stored status for slug, or 'not-started' if absent.
 */
export function statusOf(map: ProgressMap, slug: string): LessonProgressStatus {
  return map[slug]?.status ?? 'not-started';
}

// ─── markStarted ──────────────────────────────────────────────────────────────

/**
 * Returns a new map where slug is in-progress.
 * No-op (returns the exact same reference) if the lesson is already
 * in-progress or completed.
 */
export function markStarted(
  map: ProgressMap,
  slug: string,
  _nowIso: string,
): ProgressMap {
  const current = statusOf(map, slug);
  if (current === 'in-progress' || current === 'completed') {
    return map;
  }
  return {
    ...map,
    [slug]: { status: 'in-progress', bestScorePct: null, completedAt: null },
  };
}

// ─── recordQuizResult ─────────────────────────────────────────────────────────

/**
 * Returns a new map where slug is completed.
 * bestScorePct = Math.round(correct / total * 100), kept only if higher.
 * completedAt is set on first completion and preserved on retakes.
 */
export function recordQuizResult(
  map: ProgressMap,
  slug: string,
  correct: number,
  total: number,
  nowIso: string,
): ProgressMap {
  const newScore = Math.round((correct / total) * 100);
  const existing: LessonProgress | undefined = map[slug];
  const oldScore = existing?.bestScorePct ?? null;
  const bestScore = oldScore !== null ? Math.max(oldScore, newScore) : newScore;
  const completedAt = existing?.completedAt ?? nowIso;

  return {
    ...map,
    [slug]: { status: 'completed', bestScorePct: bestScore, completedAt },
  };
}

// ─── mergeProgress ────────────────────────────────────────────────────────────

/**
 * Per-slug union where the higher status wins.
 * Both completed → max bestScorePct + earliest completedAt.
 * Slugs present on only one side survive unchanged.
 */
export function mergeProgress(
  local: ProgressMap,
  remote: ProgressMap,
): ProgressMap {
  const result: ProgressMap = {};
  const allSlugs = new Set([...Object.keys(local), ...Object.keys(remote)]);

  for (const slug of allSlugs) {
    const l = local[slug];
    const r = remote[slug];

    if (!l) {
      result[slug] = { ...r! };
      continue;
    }
    if (!r) {
      result[slug] = { ...l };
      continue;
    }

    // Both sides have an entry
    const lRank = STATUS_RANK[l.status];
    const rRank = STATUS_RANK[r.status];

    if (lRank > rRank) {
      result[slug] = { ...l };
    } else if (rRank > lRank) {
      result[slug] = { ...r };
    } else {
      // Same status
      if (l.status === 'completed' && r.status === 'completed') {
        const lScore = l.bestScorePct ?? 0;
        const rScore = r.bestScorePct ?? 0;
        const bestScore = Math.max(lScore, rScore);
        // Earliest completedAt
        const lAt = l.completedAt ?? '';
        const rAt = r.completedAt ?? '';
        const earliestAt = lAt <= rAt ? l.completedAt : r.completedAt;
        result[slug] = {
          status: 'completed',
          bestScorePct: bestScore,
          completedAt: earliestAt,
        };
      } else {
        // Both in-progress or both not-started — just use local
        result[slug] = { ...l };
      }
    }
  }

  return result;
}

// ─── trackSummary ─────────────────────────────────────────────────────────────

export interface TrackSummary {
  completed: number;
  total: number;
}

/**
 * Counts completed and total lessons for the given track.
 * Unknown slugs in the map are ignored.
 */
export function trackSummary(
  lessons: Lesson[],
  map: ProgressMap,
  track: LearnTrack,
): TrackSummary {
  const trackLessons = lessons.filter((l) => l.track === track);
  const completed = trackLessons.filter(
    (l) => map[l.slug]?.status === 'completed',
  ).length;
  return { completed, total: trackLessons.length };
}

// ─── continueTarget ───────────────────────────────────────────────────────────

/**
 * Returns the first in-progress lesson in curriculum order
 * (TRACKS order → order within track), or null when none.
 */
export function continueTarget(
  lessons: Lesson[],
  map: ProgressMap,
): Lesson | null {
  // Sort by track order (TRACKS array index), then by lesson order within track
  const trackIndex: Record<string, number> = {};
  TRACKS.forEach((t, i) => {
    trackIndex[t.slug] = i;
  });

  const sorted = [...lessons].sort((a, b) => {
    const tDiff = (trackIndex[a.track] ?? 0) - (trackIndex[b.track] ?? 0);
    if (tDiff !== 0) return tDiff;
    return a.order - b.order;
  });

  for (const lesson of sorted) {
    if (map[lesson.slug]?.status === 'in-progress') {
      return lesson;
    }
  }
  return null;
}
