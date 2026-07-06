import { describe, it, expect } from 'vitest';
import {
  statusOf,
  markStarted,
  recordQuizResult,
  mergeProgress,
  trackSummary,
  continueTarget,
} from '@/lib/learn/progress';
import type { Lesson, ProgressMap } from '@/lib/learn/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NOW = '2024-01-15T10:00:00.000Z';
const EARLIER = '2024-01-10T08:00:00.000Z';
const LATER = '2024-01-20T12:00:00.000Z';

function makeLesson(
  slug: string,
  track: Lesson['track'],
  order: number,
): Lesson {
  return {
    slug,
    track,
    title: slug,
    tagline: '',
    minutes: 5,
    order,
    blocks: [],
    quiz: { questions: [] },
    applyCta: null,
  };
}

// Curriculum fixture: two tracks, two lessons each
const LESSONS: Lesson[] = [
  makeLesson('f1', 'foundations', 1),
  makeLesson('f2', 'foundations', 2),
  makeLesson('c1', 'chatgpt', 1),
  makeLesson('c2', 'chatgpt', 2),
];

// ─── statusOf ─────────────────────────────────────────────────────────────────

describe('statusOf', () => {
  it('returns not-started for an unknown slug', () => {
    expect(statusOf({}, 'missing')).toBe('not-started');
  });

  it('returns the stored status for a known slug', () => {
    const map: ProgressMap = {
      f1: { status: 'in-progress', bestScorePct: null, completedAt: null },
    };
    expect(statusOf(map, 'f1')).toBe('in-progress');
  });

  it('returns completed when lesson is completed', () => {
    const map: ProgressMap = {
      f1: { status: 'completed', bestScorePct: 80, completedAt: NOW },
    };
    expect(statusOf(map, 'f1')).toBe('completed');
  });
});

// ─── markStarted ──────────────────────────────────────────────────────────────

describe('markStarted', () => {
  it('transitions not-started to in-progress', () => {
    const map: ProgressMap = {};
    const next = markStarted(map, 'f1', NOW);
    expect(next['f1'].status).toBe('in-progress');
    expect(next['f1'].bestScorePct).toBeNull();
    expect(next['f1'].completedAt).toBeNull();
  });

  it('is a no-op (returns same reference) when already in-progress', () => {
    const map: ProgressMap = {
      f1: { status: 'in-progress', bestScorePct: null, completedAt: null },
    };
    const next = markStarted(map, 'f1', NOW);
    expect(next).toBe(map);
  });

  it('is a no-op (returns same reference) when already completed', () => {
    const map: ProgressMap = {
      f1: { status: 'completed', bestScorePct: 90, completedAt: NOW },
    };
    const next = markStarted(map, 'f1', LATER);
    expect(next).toBe(map);
  });

  it('does not mutate the input map', () => {
    const map: ProgressMap = {};
    const frozen = Object.freeze({ ...map });
    const next = markStarted(frozen as ProgressMap, 'f1', NOW);
    expect(next).not.toBe(frozen);
    expect(next['f1'].status).toBe('in-progress');
  });
});

// ─── recordQuizResult ─────────────────────────────────────────────────────────

describe('recordQuizResult', () => {
  it('computes 2-of-3 as 67 (standard rounding)', () => {
    const next = recordQuizResult({}, 'f1', 2, 3, NOW);
    expect(next['f1'].bestScorePct).toBe(67);
  });

  it('computes 4-of-5 as 80', () => {
    const next = recordQuizResult({}, 'f1', 4, 5, NOW);
    expect(next['f1'].bestScorePct).toBe(80);
  });

  it('marks the lesson as completed', () => {
    const next = recordQuizResult({}, 'f1', 3, 3, NOW);
    expect(next['f1'].status).toBe('completed');
    expect(next['f1'].completedAt).toBe(NOW);
  });

  it('keeps the higher score on a retake (new score lower)', () => {
    const map: ProgressMap = {
      f1: { status: 'completed', bestScorePct: 90, completedAt: EARLIER },
    };
    const next = recordQuizResult(map, 'f1', 2, 3, LATER); // 67 < 90
    expect(next['f1'].bestScorePct).toBe(90);
  });

  it('keeps the higher score on a retake (new score higher)', () => {
    const map: ProgressMap = {
      f1: { status: 'completed', bestScorePct: 50, completedAt: EARLIER },
    };
    const next = recordQuizResult(map, 'f1', 4, 5, LATER); // 80 > 50
    expect(next['f1'].bestScorePct).toBe(80);
  });

  it('preserves the original completedAt on a retake', () => {
    const map: ProgressMap = {
      f1: { status: 'completed', bestScorePct: 90, completedAt: EARLIER },
    };
    const next = recordQuizResult(map, 'f1', 4, 5, LATER);
    expect(next['f1'].completedAt).toBe(EARLIER);
  });

  it('does not mutate the input map', () => {
    const map: ProgressMap = {
      f1: { status: 'in-progress', bestScorePct: null, completedAt: null },
    };
    const before = JSON.stringify(map);
    recordQuizResult(map, 'f1', 3, 3, NOW);
    expect(JSON.stringify(map)).toBe(before);
  });
});

// ─── mergeProgress ────────────────────────────────────────────────────────────

describe('mergeProgress', () => {
  it('local completed beats remote in-progress', () => {
    const local: ProgressMap = {
      f1: { status: 'completed', bestScorePct: 80, completedAt: NOW },
    };
    const remote: ProgressMap = {
      f1: { status: 'in-progress', bestScorePct: null, completedAt: null },
    };
    const merged = mergeProgress(local, remote);
    expect(merged['f1'].status).toBe('completed');
  });

  it('remote completed beats local in-progress', () => {
    const local: ProgressMap = {
      f1: { status: 'in-progress', bestScorePct: null, completedAt: null },
    };
    const remote: ProgressMap = {
      f1: { status: 'completed', bestScorePct: 75, completedAt: NOW },
    };
    const merged = mergeProgress(local, remote);
    expect(merged['f1'].status).toBe('completed');
    expect(merged['f1'].bestScorePct).toBe(75);
  });

  it('both completed — keeps max score and earliest completedAt', () => {
    const local: ProgressMap = {
      f1: { status: 'completed', bestScorePct: 70, completedAt: EARLIER },
    };
    const remote: ProgressMap = {
      f1: { status: 'completed', bestScorePct: 90, completedAt: LATER },
    };
    const merged = mergeProgress(local, remote);
    expect(merged['f1'].status).toBe('completed');
    expect(merged['f1'].bestScorePct).toBe(90);
    expect(merged['f1'].completedAt).toBe(EARLIER);
  });

  it('slug only in local survives', () => {
    const local: ProgressMap = {
      f1: { status: 'in-progress', bestScorePct: null, completedAt: null },
    };
    const merged = mergeProgress(local, {});
    expect(merged['f1'].status).toBe('in-progress');
  });

  it('slug only in remote survives', () => {
    const remote: ProgressMap = {
      f1: { status: 'completed', bestScorePct: 80, completedAt: NOW },
    };
    const merged = mergeProgress({}, remote);
    expect(merged['f1'].status).toBe('completed');
  });

  it('does not mutate either input', () => {
    const local: ProgressMap = {
      f1: { status: 'in-progress', bestScorePct: null, completedAt: null },
    };
    const remote: ProgressMap = {
      f1: { status: 'completed', bestScorePct: 80, completedAt: NOW },
    };
    const beforeLocal = JSON.stringify(local);
    const beforeRemote = JSON.stringify(remote);
    mergeProgress(local, remote);
    expect(JSON.stringify(local)).toBe(beforeLocal);
    expect(JSON.stringify(remote)).toBe(beforeRemote);
  });
});

// ─── trackSummary ─────────────────────────────────────────────────────────────

describe('trackSummary', () => {
  it('returns total count for the track and zero completed when map is empty', () => {
    const summary = trackSummary(LESSONS, {}, 'foundations');
    expect(summary.total).toBe(2);
    expect(summary.completed).toBe(0);
  });

  it('counts only completed lessons (in-progress does not count)', () => {
    const map: ProgressMap = {
      f1: { status: 'in-progress', bestScorePct: null, completedAt: null },
      f2: { status: 'completed', bestScorePct: 80, completedAt: NOW },
    };
    const summary = trackSummary(LESSONS, map, 'foundations');
    expect(summary.completed).toBe(1);
    expect(summary.total).toBe(2);
  });

  it('counts all completed when all are done', () => {
    const map: ProgressMap = {
      f1: { status: 'completed', bestScorePct: 90, completedAt: EARLIER },
      f2: { status: 'completed', bestScorePct: 80, completedAt: NOW },
    };
    const summary = trackSummary(LESSONS, map, 'foundations');
    expect(summary.completed).toBe(2);
  });

  it('ignores unknown slugs in the map', () => {
    const map: ProgressMap = {
      unknown: { status: 'completed', bestScorePct: 100, completedAt: NOW },
      f1: { status: 'completed', bestScorePct: 80, completedAt: NOW },
    };
    const summary = trackSummary(LESSONS, map, 'foundations');
    expect(summary.completed).toBe(1); // only f1, not 'unknown'
    expect(summary.total).toBe(2);
  });

  it('only counts lessons belonging to the requested track', () => {
    const map: ProgressMap = {
      c1: { status: 'completed', bestScorePct: 80, completedAt: NOW },
    };
    const summary = trackSummary(LESSONS, map, 'foundations');
    expect(summary.completed).toBe(0); // c1 is chatgpt, not foundations
  });
});

// ─── continueTarget ───────────────────────────────────────────────────────────

describe('continueTarget', () => {
  it('returns null when nothing is in-progress', () => {
    expect(continueTarget(LESSONS, {})).toBeNull();
  });

  it('returns the first in-progress lesson in curriculum order', () => {
    const map: ProgressMap = {
      c1: { status: 'in-progress', bestScorePct: null, completedAt: null },
      f1: { status: 'in-progress', bestScorePct: null, completedAt: null },
    };
    // foundations comes before chatgpt in TRACKS; f1 has order 1
    const target = continueTarget(LESSONS, map);
    expect(target?.slug).toBe('f1');
  });

  it('returns null when all in-progress lessons are actually completed', () => {
    const map: ProgressMap = {
      f1: { status: 'completed', bestScorePct: 80, completedAt: NOW },
    };
    expect(continueTarget(LESSONS, map)).toBeNull();
  });

  it('respects order within a track', () => {
    const map: ProgressMap = {
      f2: { status: 'in-progress', bestScorePct: null, completedAt: null },
      f1: { status: 'completed', bestScorePct: 80, completedAt: NOW },
    };
    const target = continueTarget(LESSONS, map);
    expect(target?.slug).toBe('f2');
  });

  it('skips completed and returns next in-progress across tracks', () => {
    const map: ProgressMap = {
      f1: { status: 'completed', bestScorePct: 100, completedAt: EARLIER },
      f2: { status: 'completed', bestScorePct: 80, completedAt: EARLIER },
      c1: { status: 'in-progress', bestScorePct: null, completedAt: null },
    };
    const target = continueTarget(LESSONS, map);
    expect(target?.slug).toBe('c1');
  });
});
