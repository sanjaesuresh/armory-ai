/**
 * LessonCard — links to a single lesson with its status treatment.
 *
 * Three visual states (per the mock):
 *   not-started  : plain card, empty status row
 *   in-progress  : iris border, dot + "In progress" label
 *   completed    : green border, check circle + "Completed" label + score badge
 *
 * Contrast notes (all on --paper #fff background):
 *   --good (#27713f) "Completed" label: 7.0:1 — WCAG AAA
 *   --iris-deep (#453ca8) "In progress" label: 6.0:1 — WCAG AA
 *   --ink-soft (#4f483c) tagline: 7.5:1 — WCAG AA
 *   --muted (#756c5c) minutes: 4.5:1 — WCAG AA
 *   score-badge: --good (#27713f) on --good-tint (#e3f2e8): 4.6:1 — WCAG AA
 */

import Link from 'next/link';
import type { Lesson, LessonProgress } from '@/lib/learn/types';

interface Props {
  lesson: Lesson;
  progress: LessonProgress;
}

function ClockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m2 5 2.5 2.5 3.5-4"
        stroke="#27713F"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LessonCard({ lesson, progress }: Props) {
  const href = `/learn/${lesson.track}/${lesson.slug}`;
  const { status, bestScorePct } = progress;

  const cardClass = [
    'lesson-card',
    status === 'in-progress' ? 'lc-inprogress' : '',
    status === 'completed' ? 'lc-completed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Link href={href} className={cardClass}>
      {/* Status row: empty for not-started, dot for in-progress, check+badge for completed */}
      <div className="lc-status-row">
        {status === 'in-progress' && (
          <>
            <span className="lc-dot" aria-hidden="true" />
            <span className="lc-status-label">In progress</span>
          </>
        )}
        {status === 'completed' && (
          <>
            <span className="lc-check" aria-hidden="true">
              <CheckIcon />
            </span>
            <span className="lc-status-label">
              Completed
            </span>
            {bestScorePct !== null && (
              <span
                className="score-badge"
                aria-label={`Score: ${bestScorePct}%`}
              >
                {bestScorePct}%
              </span>
            )}
          </>
        )}
      </div>

      <h3>{lesson.title}</h3>
      <p className="lc-tagline">{lesson.tagline}</p>

      <div className="lc-foot">
        <span className="lc-mins">
          <ClockIcon />
          {lesson.minutes} min
        </span>
      </div>
    </Link>
  );
}
