/**
 * TrackSection — one row of the Learn hub for a given track.
 *
 * The section element carries the track slug as its `id` so lesson
 * back-links (e.g. `/learn#foundations`) anchor here correctly.
 * aria-labelledby points to the h2 whose id is `heading-{slug}`.
 *
 * Grid layout: auto-fill with a 200px minimum column so the number of
 * columns adapts gracefully for any lesson count — 0, 3, 4, or 5. When
 * there are no lessons the grid container is present but empty (graceful
 * empty state with header + ring).
 */

import type { TrackDescriptor, Lesson, ProgressMap } from '@/lib/learn/types';
import { trackSummary, statusOf } from '@/lib/learn/progress';
import ProgressRing from './ProgressRing';
import LessonCard from './LessonCard';

interface Props {
  track: TrackDescriptor;
  /** Lessons belonging to this track, in order. */
  lessons: Lesson[];
  /** Full or partial progress map; missing slugs default to not-started. */
  progressMap: ProgressMap;
}

const TRACK_NUMBERS: Record<string, string> = {
  foundations: 'Track 1',
  chatgpt: 'Track 2',
  'claude-app': 'Track 3',
  'claude-code': 'Track 4',
};

export default function TrackSection({ track, lessons, progressMap }: Props) {
  const { completed, total } = trackSummary(lessons, progressMap, track.slug);
  const headingId = `heading-${track.slug}`;
  const trackNumber = TRACK_NUMBERS[track.slug] ?? 'Track';

  return (
    <section
      id={track.slug}
      aria-labelledby={headingId}
      className="track-section"
    >
      <div className="track-head">
        <div className="track-info">
          <span className="eyebrow">{trackNumber}</span>
          <h2 id={headingId}>{track.title}</h2>
          <p className="track-intro">{track.intro}</p>
        </div>
        <ProgressRing completed={completed} total={total} />
      </div>

      {lessons.length > 0 && (
        <div className="learn-lesson-grid">
          {lessons.map((lesson) => {
            const progress = progressMap[lesson.slug] ?? {
              status: 'not-started' as const,
              bestScorePct: null,
              completedAt: null,
            };
            return (
              <LessonCard key={lesson.slug} lesson={lesson} progress={progress} />
            );
          })}
        </div>
      )}
    </section>
  );
}
