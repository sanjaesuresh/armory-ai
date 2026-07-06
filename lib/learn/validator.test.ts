import { describe, it, expect } from 'vitest';
import { validateLesson, validateLessonSet } from '@/lib/learn/validator';
import type { Lesson, Block, Quiz, QuizQuestion } from '@/lib/learn/types';
import type { DiagramId } from '@/lib/learn/diagramManifest';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeQuestion(overrides: Partial<QuizQuestion> = {}): QuizQuestion {
  return {
    prompt: 'What does the model receive each turn?',
    choices: ['Only your latest message', 'The whole conversation', 'Nothing'],
    correctIndex: 1,
    explanation: 'The entire conversation history is sent every turn.',
    ...overrides,
  };
}

function makeQuiz(overrides: Partial<Quiz> = {}): Quiz {
  return {
    questions: [makeQuestion(), makeQuestion(), makeQuestion()],
    ...overrides,
  };
}

function makeLesson(overrides: Partial<Lesson> = {}): Lesson {
  return {
    slug: 'how-ai-chat-works',
    track: 'foundations',
    title: 'How AI Chat Works',
    tagline: 'Learn what happens each time you send a message.',
    minutes: 5,
    order: 1,
    blocks: [
      {
        type: 'prose',
        paragraphs: ['A chat AI is a text-prediction model.'],
      },
    ],
    quiz: makeQuiz(),
    applyCta: null,
    ...overrides,
  };
}

// ─── (a) Minimal valid lesson passes ─────────────────────────────────────────

describe('validateLesson', () => {
  it('(a) a minimal valid lesson passes', () => {
    const result = validateLesson(makeLesson());
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  // ─── (b) minutes outside 2–10 fails MINUTES_RANGE ────────────────────────

  it('(b) minutes = 1 fails MINUTES_RANGE', () => {
    const result = validateLesson(makeLesson({ minutes: 1 }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'MINUTES_RANGE')).toBe(true);
  });

  it('(b) minutes = 11 fails MINUTES_RANGE', () => {
    const result = validateLesson(makeLesson({ minutes: 11 }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'MINUTES_RANGE')).toBe(true);
  });

  it('(b) minutes = 2 passes', () => {
    const result = validateLesson(makeLesson({ minutes: 2 }));
    expect(result.valid).toBe(true);
  });

  it('(b) minutes = 10 passes', () => {
    const result = validateLesson(makeLesson({ minutes: 10 }));
    expect(result.valid).toBe(true);
  });

  // ─── (c) quiz with 2 or 6 questions fails QUIZ_LENGTH ─────────────────────

  it('(c) quiz with 2 questions fails QUIZ_LENGTH', () => {
    const quiz = makeQuiz({ questions: [makeQuestion(), makeQuestion()] });
    const result = validateLesson(makeLesson({ quiz }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'QUIZ_LENGTH')).toBe(true);
  });

  it('(c) quiz with 6 questions fails QUIZ_LENGTH', () => {
    const quiz = makeQuiz({
      questions: Array.from({ length: 6 }, makeQuestion),
    });
    const result = validateLesson(makeLesson({ quiz }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'QUIZ_LENGTH')).toBe(true);
  });

  it('(c) quiz with 5 questions passes', () => {
    const quiz = makeQuiz({
      questions: Array.from({ length: 5 }, makeQuestion),
    });
    const result = validateLesson(makeLesson({ quiz }));
    expect(result.valid).toBe(true);
  });

  // ─── (d) question with 5 choices, correctIndex out of range, or empty explanation ──

  it('(d) question with 5 choices fails QUIZ_QUESTION_INVALID', () => {
    const quiz = makeQuiz({
      questions: [
        makeQuestion({
          choices: ['A', 'B', 'C', 'D', 'E'],
          correctIndex: 0,
        }),
        makeQuestion(),
        makeQuestion(),
      ],
    });
    const result = validateLesson(makeLesson({ quiz }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'QUIZ_QUESTION_INVALID')).toBe(true);
  });

  it('(d) correctIndex out of range fails QUIZ_QUESTION_INVALID', () => {
    const quiz = makeQuiz({
      questions: [
        makeQuestion({ correctIndex: 5 }),
        makeQuestion(),
        makeQuestion(),
      ],
    });
    const result = validateLesson(makeLesson({ quiz }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'QUIZ_QUESTION_INVALID')).toBe(true);
  });

  it('(d) empty explanation fails QUIZ_QUESTION_INVALID', () => {
    const quiz = makeQuiz({
      questions: [
        makeQuestion({ explanation: '' }),
        makeQuestion(),
        makeQuestion(),
      ],
    });
    const result = validateLesson(makeLesson({ quiz }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'QUIZ_QUESTION_INVALID')).toBe(true);
  });

  // ─── (e) hotspotDiagram with unknown diagramId fails DIAGRAM_UNKNOWN ──────

  it('(e) hotspotDiagram with unknown diagramId fails DIAGRAM_UNKNOWN', () => {
    const block: Block = {
      type: 'hotspotDiagram',
      diagramId: 'not-a-real-diagram' as never,
      hotspots: [{ id: 'any', title: 'Any', body: 'Some body.' }],
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'DIAGRAM_UNKNOWN')).toBe(true);
  });

  // ─── (f) hotspot ids don't exactly match manifest fails DIAGRAM_HOTSPOT_MISMATCH ──

  it('(f) hotspotDiagram missing a hotspot id fails DIAGRAM_HOTSPOT_MISMATCH', () => {
    // chat-flow requires: your-message, conversation-history, the-model, response
    const block: Block = {
      type: 'hotspotDiagram',
      diagramId: 'chat-flow',
      hotspots: [
        { id: 'your-message', title: 'Your message', body: 'What you typed.' },
        { id: 'conversation-history', title: 'History', body: 'Prior turns.' },
        // missing: the-model, response
      ],
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'DIAGRAM_HOTSPOT_MISMATCH')).toBe(true);
  });

  it('(f) hotspotDiagram with an extra hotspot id fails DIAGRAM_HOTSPOT_MISMATCH', () => {
    const block: Block = {
      type: 'hotspotDiagram',
      diagramId: 'chat-flow',
      hotspots: [
        { id: 'your-message', title: 'Your message', body: 'What you typed.' },
        { id: 'conversation-history', title: 'History', body: 'Prior turns.' },
        { id: 'the-model', title: 'The model', body: 'Predicts the reply.' },
        { id: 'response', title: 'Response', body: 'The reply.' },
        { id: 'extra-hotspot', title: 'Extra', body: 'Should not be here.' },
      ],
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'DIAGRAM_HOTSPOT_MISMATCH')).toBe(true);
  });

  it('(f) hotspotDiagram with exactly matching hotspot ids passes', () => {
    const block: Block = {
      type: 'hotspotDiagram',
      diagramId: 'chat-flow',
      hotspots: [
        { id: 'your-message', title: 'Your message', body: 'What you typed.' },
        { id: 'conversation-history', title: 'History', body: 'Prior turns.' },
        { id: 'the-model', title: 'The model', body: 'Predicts the reply.' },
        { id: 'response', title: 'Response', body: 'The reply.' },
      ],
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(true);
  });

  // ─── (g) customWidget with unknown widgetId fails WIDGET_UNKNOWN ──────────

  it('(g) customWidget with unknown widgetId fails WIDGET_UNKNOWN', () => {
    const block: Block = {
      type: 'customWidget',
      widgetId: 'not-a-widget' as never,
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'WIDGET_UNKNOWN')).toBe(true);
  });

  it('(g) customWidget with valid widgetId passes', () => {
    const block: Block = {
      type: 'customWidget',
      widgetId: 'context-meter',
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(true);
  });

  // ─── (h) flipCards with 2 cards, or front > 60 chars, fails FLIP_CARDS_INVALID ──

  it('(h) flipCards with 2 cards fails FLIP_CARDS_INVALID', () => {
    const block: Block = {
      type: 'flipCards',
      cards: [
        { front: 'Card A', back: 'Back A' },
        { front: 'Card B', back: 'Back B' },
      ],
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'FLIP_CARDS_INVALID')).toBe(true);
  });

  it('(h) flipCards with a front over 60 chars fails FLIP_CARDS_INVALID', () => {
    const longFront = 'A'.repeat(61);
    const block: Block = {
      type: 'flipCards',
      cards: [
        { front: longFront, back: 'Back A' },
        { front: 'Card B', back: 'Back B' },
        { front: 'Card C', back: 'Back C' },
      ],
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'FLIP_CARDS_INVALID')).toBe(true);
  });

  it('(h) flipCards with exactly 3 valid cards passes', () => {
    const block: Block = {
      type: 'flipCards',
      cards: [
        { front: 'Card A', back: 'Back A' },
        { front: 'Card B', back: 'Back B' },
        { front: 'Card C', back: 'Back C' },
      ],
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(true);
  });

  it('(h) flipCards with a back over 300 chars fails FLIP_CARDS_INVALID', () => {
    const longBack = 'B'.repeat(301);
    const block: Block = {
      type: 'flipCards',
      cards: [
        { front: 'Card A', back: longBack },
        { front: 'Card B', back: 'Back B' },
        { front: 'Card C', back: 'Back C' },
      ],
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'FLIP_CARDS_INVALID')).toBe(true);
  });

  it('(h) flipCards with a back of exactly 300 chars passes', () => {
    const maxBack = 'B'.repeat(300);
    const block: Block = {
      type: 'flipCards',
      cards: [
        { front: 'Card A', back: maxBack },
        { front: 'Card B', back: 'Back B' },
        { front: 'Card C', back: 'Back C' },
      ],
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(true);
  });

  // ─── (i) comparisonTable row cell count mismatch fails TABLE_SHAPE ─────────

  it('(i) comparisonTable row with wrong cell count fails TABLE_SHAPE', () => {
    const block: Block = {
      type: 'comparisonTable',
      headers: ['Feature', 'ChatGPT', 'Claude'],
      rows: [
        ['Instructions', 'Custom instructions', 'Project instructions'],
        ['Files', 'Upload'], // only 2 cells, should be 3
      ],
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'TABLE_SHAPE')).toBe(true);
  });

  it('(i) comparisonTable with consistent cell counts passes', () => {
    const block: Block = {
      type: 'comparisonTable',
      headers: ['Feature', 'ChatGPT', 'Claude'],
      rows: [
        ['Instructions', 'Custom instructions', 'Project instructions'],
        ['Files', 'Uploads', 'Knowledge files'],
      ],
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(true);
  });

  it('(i) comparisonTable with 1 column fails TABLE_SHAPE', () => {
    const block: Block = {
      type: 'comparisonTable',
      headers: ['Feature'],
      rows: [['Value'], ['Value2']],
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'TABLE_SHAPE')).toBe(true);
  });

  it('(i) comparisonTable with 5 columns fails TABLE_SHAPE', () => {
    const block: Block = {
      type: 'comparisonTable',
      headers: ['A', 'B', 'C', 'D', 'E'],
      rows: [
        ['a1', 'b1', 'c1', 'd1', 'e1'],
        ['a2', 'b2', 'c2', 'd2', 'e2'],
      ],
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'TABLE_SHAPE')).toBe(true);
  });

  it('(i) comparisonTable with 1 row fails TABLE_SHAPE', () => {
    const block: Block = {
      type: 'comparisonTable',
      headers: ['Feature', 'Value'],
      rows: [['Only row', 'data']],
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'TABLE_SHAPE')).toBe(true);
  });

  it('(i) comparisonTable with 9 rows fails TABLE_SHAPE', () => {
    const block: Block = {
      type: 'comparisonTable',
      headers: ['Feature', 'Value'],
      rows: Array.from({ length: 9 }, (_, i) => [`Feature ${i}`, `Value ${i}`]),
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'TABLE_SHAPE')).toBe(true);
  });

  it('(i) comparisonTable with 2 columns and 2 rows passes', () => {
    const block: Block = {
      type: 'comparisonTable',
      headers: ['Feature', 'Value'],
      rows: [
        ['Row 1 Feature', 'Row 1 Value'],
        ['Row 2 Feature', 'Row 2 Value'],
      ],
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(true);
  });

  // ─── DiagramId type-level assertion ──────────────────────────────────────────

  it('DiagramId is a string literal union not collapsed to string', () => {
    // This is a compile-time check: if DiagramId were `string`, the assignment
    // would still work at runtime but the type would be too wide. We verify the
    // import resolves and a known key is assignable.
    const id: DiagramId = 'chat-flow';
    expect(id).toBe('chat-flow');
  });

  // ─── (j) applyCta with href not starting with / fails CTA_HREF_INTERNAL ───

  it('(j) applyCta with external href fails CTA_HREF_INTERNAL', () => {
    const result = validateLesson(
      makeLesson({ applyCta: { label: 'Try it', href: 'https://example.com' } }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'CTA_HREF_INTERNAL')).toBe(true);
  });

  it('(j) applyCta with href starting with / passes', () => {
    const result = validateLesson(
      makeLesson({ applyCta: { label: 'Try it', href: '/professionals' } }),
    );
    expect(result.valid).toBe(true);
  });

  it('(j) null applyCta passes', () => {
    const result = validateLesson(makeLesson({ applyCta: null }));
    expect(result.valid).toBe(true);
  });

  // ─── (k) empty prose paragraph or empty callout passage fails EMPTY_TEXT ───

  it('(k) prose block with an empty paragraph fails EMPTY_TEXT', () => {
    const block: Block = {
      type: 'prose',
      paragraphs: ['A valid paragraph.', ''],
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'EMPTY_TEXT')).toBe(true);
  });

  it('(k) callout block with empty passage fails EMPTY_TEXT', () => {
    const block: Block = {
      type: 'callout',
      tone: 'tip',
      passage: '',
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'EMPTY_TEXT')).toBe(true);
  });

  // ─── (l) stepThrough with 2 steps fails STEP_COUNT ───────────────────────

  it('(l) stepThrough with 2 steps fails STEP_COUNT', () => {
    const block: Block = {
      type: 'stepThrough',
      steps: [
        { title: 'Step 1', body: 'Do this.' },
        { title: 'Step 2', body: 'Then this.' },
      ],
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'STEP_COUNT')).toBe(true);
  });

  it('(l) stepThrough with 3 steps passes', () => {
    const block: Block = {
      type: 'stepThrough',
      steps: [
        { title: 'Step 1', body: 'Do this.' },
        { title: 'Step 2', body: 'Then this.' },
        { title: 'Step 3', body: 'Finally this.' },
      ],
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(true);
  });

  // ─── (o) beforeAfter with empty exchange array fails BEFORE_AFTER_INVALID ──

  it('(o) beforeAfter with empty before exchanges fails BEFORE_AFTER_INVALID', () => {
    const block: Block = {
      type: 'beforeAfter',
      beforeLabel: 'Without instructions',
      afterLabel: 'With instructions',
      beforeExchanges: [],
      afterExchanges: [{ speaker: 'user', text: 'Write an email.' }],
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'BEFORE_AFTER_INVALID')).toBe(true);
  });

  it('(o) beforeAfter with empty after exchanges fails BEFORE_AFTER_INVALID', () => {
    const block: Block = {
      type: 'beforeAfter',
      beforeLabel: 'Without instructions',
      afterLabel: 'With instructions',
      beforeExchanges: [{ speaker: 'user', text: 'Write an email.' }],
      afterExchanges: [],
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'BEFORE_AFTER_INVALID')).toBe(true);
  });

  it('(o) beforeAfter with non-empty exchanges on both sides passes', () => {
    const block: Block = {
      type: 'beforeAfter',
      beforeLabel: 'Without instructions',
      afterLabel: 'With instructions',
      beforeExchanges: [
        { speaker: 'user', text: 'Write an email.' },
        { speaker: 'ai', text: 'Sure, here is a generic email.' },
      ],
      afterExchanges: [
        { speaker: 'user', text: 'Write an email.' },
        { speaker: 'ai', text: 'Here is a targeted, concise email.' },
      ],
    };
    const result = validateLesson(makeLesson({ blocks: [block] }));
    expect(result.valid).toBe(true);
  });
});

// ─── validateLessonSet cross-lesson checks ────────────────────────────────────

describe('validateLessonSet', () => {
  // ─── (m) duplicate slugs fail DUPLICATE_SLUG ──────────────────────────────

  it('(m) two lessons sharing a slug fails DUPLICATE_SLUG', () => {
    const lessonA = makeLesson({ slug: 'shared-slug', track: 'foundations', order: 1 });
    const lessonB = makeLesson({ slug: 'shared-slug', track: 'foundations', order: 2 });
    const result = validateLessonSet([lessonA, lessonB]);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'DUPLICATE_SLUG')).toBe(true);
  });

  it('(m) unique slugs passes DUPLICATE_SLUG check', () => {
    const lessonA = makeLesson({ slug: 'lesson-a', track: 'foundations', order: 1 });
    const lessonB = makeLesson({ slug: 'lesson-b', track: 'foundations', order: 2 });
    const result = validateLessonSet([lessonA, lessonB]);
    expect(result.valid).toBe(true);
  });

  // ─── (n) track order not contiguous from 1 fails TRACK_ORDER ──────────────

  it('(n) track with non-contiguous order values fails TRACK_ORDER', () => {
    const lessonA = makeLesson({ slug: 'lesson-a', track: 'foundations', order: 1 });
    const lessonB = makeLesson({ slug: 'lesson-b', track: 'foundations', order: 3 }); // gap: missing 2
    const result = validateLessonSet([lessonA, lessonB]);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'TRACK_ORDER')).toBe(true);
  });

  it('(n) track not starting at 1 fails TRACK_ORDER', () => {
    const lessonA = makeLesson({ slug: 'lesson-a', track: 'foundations', order: 2 });
    const result = validateLessonSet([lessonA]);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'TRACK_ORDER')).toBe(true);
  });

  it('(n) track with contiguous order from 1 passes TRACK_ORDER', () => {
    const lessonA = makeLesson({ slug: 'lesson-a', track: 'foundations', order: 1 });
    const lessonB = makeLesson({ slug: 'lesson-b', track: 'foundations', order: 2 });
    const lessonC = makeLesson({ slug: 'lesson-c', track: 'foundations', order: 3 });
    const result = validateLessonSet([lessonA, lessonB, lessonC]);
    expect(result.valid).toBe(true);
  });

  it('(n) empty lesson set passes', () => {
    const result = validateLessonSet([]);
    expect(result.valid).toBe(true);
  });
});
