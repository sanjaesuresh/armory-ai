/**
 * Structural validator for Lesson objects.
 *
 * validateLesson(lesson) → LearnValidationResult
 *   per-lesson structural checks
 *
 * validateLessonSet(lessons) → LearnValidationResult
 *   cross-lesson checks (duplicate slugs, track ordering)
 *
 * Self-contained — does not import from lib/setup/.
 */

import type { Lesson, Block, LearnValidationResult, LearnValidationError } from '@/lib/learn/types';
import { WIDGET_IDS } from '@/lib/learn/types';
import { DIAGRAM_MANIFEST } from '@/lib/learn/diagramManifest';

// ─── Error builder ────────────────────────────────────────────────────────────

function err(code: string, message: string, path: string): LearnValidationError {
  return { code, message, path };
}

// ─── Block validators ─────────────────────────────────────────────────────────

function validateBlock(
  block: Block,
  index: number,
  errors: LearnValidationError[],
): void {
  const base = `blocks[${index}]`;

  switch (block.type) {
    case 'prose': {
      if (!block.paragraphs || block.paragraphs.length === 0) {
        errors.push(err('EMPTY_TEXT', 'Prose block must have at least one paragraph.', `${base}.paragraphs`));
      } else {
        block.paragraphs.forEach((p, i) => {
          if (p.trim() === '') {
            errors.push(err('EMPTY_TEXT', `Prose paragraph at index ${i} is empty.`, `${base}.paragraphs[${i}]`));
          }
        });
      }
      break;
    }

    case 'callout': {
      if (block.passage.trim() === '') {
        errors.push(err('EMPTY_TEXT', 'Callout passage must not be empty.', `${base}.passage`));
      }
      break;
    }

    case 'hotspotDiagram': {
      const manifestEntry = DIAGRAM_MANIFEST[block.diagramId];
      if (!manifestEntry) {
        errors.push(
          err('DIAGRAM_UNKNOWN', `Unknown diagramId "${block.diagramId}".`, `${base}.diagramId`),
        );
      } else {
        const declared = new Set<string>(manifestEntry);
        const provided = new Set(block.hotspots.map(h => h.id));
        const missing = [...declared].filter(id => !provided.has(id));
        const extra = [...provided].filter(id => !declared.has(id));
        if (missing.length > 0 || extra.length > 0) {
          errors.push(
            err(
              'DIAGRAM_HOTSPOT_MISMATCH',
              `Hotspot ids for "${block.diagramId}" must exactly match the manifest. ` +
                (missing.length > 0 ? `Missing: ${missing.join(', ')}. ` : '') +
                (extra.length > 0 ? `Extra: ${extra.join(', ')}.` : ''),
              `${base}.hotspots`,
            ),
          );
        }
      }
      break;
    }

    case 'flipCards': {
      if (block.cards.length < 3 || block.cards.length > 8) {
        errors.push(
          err(
            'FLIP_CARDS_INVALID',
            `flipCards block must have 3–8 cards; got ${block.cards.length}.`,
            `${base}.cards`,
          ),
        );
      }
      block.cards.forEach((card, i) => {
        if (card.front.length > 60) {
          errors.push(
            err(
              'FLIP_CARDS_INVALID',
              `Card front at index ${i} exceeds 60 characters (${card.front.length}).`,
              `${base}.cards[${i}].front`,
            ),
          );
        }
        if (card.back.length > 300) {
          errors.push(
            err(
              'FLIP_CARDS_INVALID',
              `Card back at index ${i} exceeds 300 characters (${card.back.length}).`,
              `${base}.cards[${i}].back`,
            ),
          );
        }
      });
      break;
    }

    case 'stepThrough': {
      if (block.steps.length < 3 || block.steps.length > 7) {
        errors.push(
          err(
            'STEP_COUNT',
            `stepThrough block must have 3–7 steps; got ${block.steps.length}.`,
            `${base}.steps`,
          ),
        );
      }
      break;
    }

    case 'beforeAfter': {
      if (block.beforeExchanges.length === 0) {
        errors.push(
          err(
            'BEFORE_AFTER_INVALID',
            'beforeAfter block must have at least one exchange in beforeExchanges.',
            `${base}.beforeExchanges`,
          ),
        );
      }
      if (block.afterExchanges.length === 0) {
        errors.push(
          err(
            'BEFORE_AFTER_INVALID',
            'beforeAfter block must have at least one exchange in afterExchanges.',
            `${base}.afterExchanges`,
          ),
        );
      }
      break;
    }

    case 'comparisonTable': {
      const colCount = block.headers.length;
      if (colCount < 2 || colCount > 4) {
        errors.push(
          err(
            'TABLE_SHAPE',
            `comparisonTable must have 2–4 columns; got ${colCount}.`,
            `${base}.headers`,
          ),
        );
      }
      const rowCount = block.rows.length;
      if (rowCount < 2 || rowCount > 8) {
        errors.push(
          err(
            'TABLE_SHAPE',
            `comparisonTable must have 2–8 rows; got ${rowCount}.`,
            `${base}.rows`,
          ),
        );
      }
      block.rows.forEach((row, i) => {
        if (row.length !== colCount) {
          errors.push(
            err(
              'TABLE_SHAPE',
              `Row ${i} has ${row.length} cells but there are ${colCount} headers.`,
              `${base}.rows[${i}]`,
            ),
          );
        }
      });
      break;
    }

    case 'customWidget': {
      if (!(WIDGET_IDS as ReadonlyArray<string>).includes(block.widgetId)) {
        errors.push(
          err(
            'WIDGET_UNKNOWN',
            `Unknown widgetId "${block.widgetId}". Must be one of: ${WIDGET_IDS.join(', ')}.`,
            `${base}.widgetId`,
          ),
        );
      }
      break;
    }

    default: {
      // TypeScript exhaustiveness guard — compile error if a new Block variant is missing.
      const _never: never = block;
      void _never;
    }
  }
}

// ─── Quiz validator ───────────────────────────────────────────────────────────

function validateQuiz(
  quiz: Lesson['quiz'],
  errors: LearnValidationError[],
): void {
  const { questions } = quiz;

  if (questions.length < 3 || questions.length > 5) {
    errors.push(
      err(
        'QUIZ_LENGTH',
        `Quiz must have 3–5 questions; got ${questions.length}.`,
        'quiz.questions',
      ),
    );
  }

  questions.forEach((q, i) => {
    const base = `quiz.questions[${i}]`;

    if (q.choices.length < 3 || q.choices.length > 4) {
      errors.push(
        err(
          'QUIZ_QUESTION_INVALID',
          `Question ${i} must have 3–4 choices; got ${q.choices.length}.`,
          `${base}.choices`,
        ),
      );
    }

    if (q.correctIndex < 0 || q.correctIndex >= q.choices.length) {
      errors.push(
        err(
          'QUIZ_QUESTION_INVALID',
          `Question ${i} correctIndex ${q.correctIndex} is out of range for ${q.choices.length} choices.`,
          `${base}.correctIndex`,
        ),
      );
    }

    if (q.explanation.trim() === '') {
      errors.push(
        err('QUIZ_QUESTION_INVALID', `Question ${i} explanation must not be empty.`, `${base}.explanation`),
      );
    }
  });
}

// ─── validateLesson ───────────────────────────────────────────────────────────

export function validateLesson(lesson: Lesson): LearnValidationResult {
  const errors: LearnValidationError[] = [];

  // minutes: integer 2–10
  if (
    !Number.isInteger(lesson.minutes) ||
    lesson.minutes < 2 ||
    lesson.minutes > 10
  ) {
    errors.push(
      err('MINUTES_RANGE', `minutes must be an integer from 2 to 10; got ${lesson.minutes}.`, 'minutes'),
    );
  }

  // applyCta href must start with /
  if (lesson.applyCta !== null && !lesson.applyCta.href.startsWith('/')) {
    errors.push(
      err(
        'CTA_HREF_INTERNAL',
        `applyCta.href must start with "/" (internal paths only); got "${lesson.applyCta.href}".`,
        'applyCta.href',
      ),
    );
  }

  // blocks
  lesson.blocks.forEach((block, i) => {
    validateBlock(block, i, errors);
  });

  // quiz
  validateQuiz(lesson.quiz, errors);

  return { valid: errors.length === 0, errors };
}

// ─── validateLessonSet ────────────────────────────────────────────────────────

export function validateLessonSet(lessons: Lesson[]): LearnValidationResult {
  const errors: LearnValidationError[] = [];

  // DUPLICATE_SLUG: each lesson slug must be unique
  const seenSlugs = new Map<string, number>();
  lessons.forEach((lesson, i) => {
    if (seenSlugs.has(lesson.slug)) {
      errors.push(
        err(
          'DUPLICATE_SLUG',
          `Duplicate slug "${lesson.slug}" found at indices ${seenSlugs.get(lesson.slug)} and ${i}.`,
          `lessons[${i}].slug`,
        ),
      );
    } else {
      seenSlugs.set(lesson.slug, i);
    }
  });

  // TRACK_ORDER: within each track, order values must be contiguous from 1
  const byTrack = new Map<string, Lesson[]>();
  lessons.forEach(lesson => {
    const group = byTrack.get(lesson.track) ?? [];
    group.push(lesson);
    byTrack.set(lesson.track, group);
  });

  byTrack.forEach((trackLessons, track) => {
    const sorted = [...trackLessons].sort((a, b) => a.order - b.order);
    sorted.forEach((lesson, i) => {
      if (lesson.order !== i + 1) {
        errors.push(
          err(
            'TRACK_ORDER',
            `Track "${track}" order values are not contiguous from 1. Expected ${i + 1} at position ${i}, got ${lesson.order}.`,
            `track:${track}`,
          ),
        );
      }
    });
  });

  return { valid: errors.length === 0, errors };
}
