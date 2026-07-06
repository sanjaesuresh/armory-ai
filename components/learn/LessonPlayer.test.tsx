/**
 * LessonPlayer dom tests — store stubbed, no network.
 *
 * Tests: block rendering (one of every type), lesson header, markStarted
 * (exactly once on mount), quiz completion → recordQuiz + completion banner,
 * banner with and without applyCta, back-link href anchored to the track.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Hoisted module mocks ─────────────────────────────────────────────────────

vi.mock('@/lib/learn/progressStore', () => ({
  createLearnProgressStore: vi.fn(),
  loadLocalProgress: vi.fn(() => ({})),
  saveLocalProgress: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
  createSupabaseBrowserClient: vi.fn(),
}));

// next/link is used in LessonPlayer for the back link and applyCta.
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    [k: string]: unknown;
  }) => (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  ),
}));

import LessonPlayer from './LessonPlayer';
import { createLearnProgressStore } from '@/lib/learn/progressStore';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Lesson } from '@/lib/learn/types';

// ─── Fixture lesson ───────────────────────────────────────────────────────────
// One of every block type. quiz has 1 question for easy interaction.

const FIXTURE_LESSON: Lesson = {
  slug: 'test-lesson',
  track: 'foundations',
  title: 'Test Lesson Title',
  tagline: 'This is the lesson tagline.',
  minutes: 5,
  order: 1,
  blocks: [
    { type: 'prose', heading: 'The Prose Heading', paragraphs: ['First paragraph.'] },
    { type: 'callout', tone: 'tip', passage: 'A tip passage.' },
    {
      type: 'hotspotDiagram',
      diagramId: 'chat-flow',
      hotspots: [{ id: 'your-message', title: 'Your Message', body: 'What you typed.' }],
    },
    { type: 'flipCards', cards: [{ front: 'Token', back: 'A chunk of text.' }] },
    { type: 'stepThrough', steps: [{ title: 'Step One', body: 'Do this first.' }] },
    {
      type: 'beforeAfter',
      beforeLabel: 'Before',
      afterLabel: 'After',
      beforeExchanges: [{ speaker: 'user', text: 'Before question.' }],
      afterExchanges: [{ speaker: 'user', text: 'After question.' }],
    },
    {
      type: 'comparisonTable',
      headers: ['Feature', 'Claude', 'ChatGPT'],
      rows: [['Context size', '200k', '128k']],
    },
    { type: 'customWidget', widgetId: 'context-meter' },
  ],
  quiz: {
    questions: [
      {
        prompt: 'What is a context window?',
        choices: ['The browser window', 'The working memory'],
        correctIndex: 1,
        explanation: 'Context is working memory.',
      },
    ],
  },
  applyCta: { label: 'Browse setups', href: '/professionals' },
};

// Variant with no applyCta to test the banner-without-CTA path.
const FIXTURE_NO_CTA: Lesson = {
  ...FIXTURE_LESSON,
  slug: 'no-cta-lesson',
  applyCta: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeMockStore() {
  return {
    markStarted: vi.fn().mockResolvedValue(undefined),
    recordQuiz: vi.fn().mockResolvedValue(undefined),
    load: vi.fn().mockResolvedValue({}),
  };
}

/** Fake Supabase browser client. Fires INITIAL_SESSION synchronously. */
function makeMockSupabase(userId: string | null = 'user-123') {
  const session = userId ? { user: { id: userId } } : null;
  const unsubscribe = vi.fn();
  return {
    auth: {
      onAuthStateChange: vi.fn(
        (cb: (event: string, session: unknown) => void) => {
          cb('INITIAL_SESSION', session);
          return { data: { subscription: { unsubscribe } } };
        },
      ),
    },
  };
}

// ─── Per-test setup ───────────────────────────────────────────────────────────

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(createLearnProgressStore).mockReturnValue(makeMockStore());
  vi.mocked(createSupabaseBrowserClient).mockReturnValue(
    makeMockSupabase() as unknown as ReturnType<typeof createSupabaseBrowserClient>,
  );
});

// ─── Block rendering ──────────────────────────────────────────────────────────

describe('LessonPlayer — block rendering', () => {
  it('renders the prose block heading', () => {
    render(<LessonPlayer lesson={FIXTURE_LESSON} />);
    expect(
      screen.getByRole('heading', { name: 'The Prose Heading' }),
    ).toBeInTheDocument();
  });

  it('renders the callout block passage', () => {
    render(<LessonPlayer lesson={FIXTURE_LESSON} />);
    expect(screen.getByText('A tip passage.')).toBeInTheDocument();
  });

  it('renders the hotspot diagram block', () => {
    render(<LessonPlayer lesson={FIXTURE_LESSON} />);
    expect(document.querySelector('.hotspot-block')).toBeInTheDocument();
  });

  it('renders the flip cards block term', () => {
    render(<LessonPlayer lesson={FIXTURE_LESSON} />);
    expect(screen.getByText('Token')).toBeInTheDocument();
  });

  it('renders the step-through block body', () => {
    render(<LessonPlayer lesson={FIXTURE_LESSON} />);
    expect(screen.getByText('Do this first.')).toBeInTheDocument();
  });

  it('renders the before-after block as a tablist', () => {
    render(<LessonPlayer lesson={FIXTURE_LESSON} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('renders the comparison table', () => {
    render(<LessonPlayer lesson={FIXTURE_LESSON} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders the custom widget block (context-meter)', () => {
    render(<LessonPlayer lesson={FIXTURE_LESSON} />);
    expect(document.querySelector('.wgt-context-meter')).toBeInTheDocument();
  });

  it('renders the quiz question last', () => {
    render(<LessonPlayer lesson={FIXTURE_LESSON} />);
    expect(screen.getByText('What is a context window?')).toBeInTheDocument();
  });
});

// ─── Lesson header ────────────────────────────────────────────────────────────

describe('LessonPlayer — lesson header', () => {
  it('renders lesson title as the page h1', () => {
    render(<LessonPlayer lesson={FIXTURE_LESSON} />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Test Lesson Title' }),
    ).toBeInTheDocument();
  });

  it('renders the lesson tagline', () => {
    render(<LessonPlayer lesson={FIXTURE_LESSON} />);
    expect(screen.getByText('This is the lesson tagline.')).toBeInTheDocument();
  });

  it('renders estimated reading time', () => {
    render(<LessonPlayer lesson={FIXTURE_LESSON} />);
    expect(screen.getByText(/5 min/)).toBeInTheDocument();
  });

  it('back link points to /learn anchored at the track slug', () => {
    render(<LessonPlayer lesson={FIXTURE_LESSON} />);
    const link = screen.getByRole('link', { name: /Back to Learn AI/i });
    expect(link).toHaveAttribute('href', '/learn#foundations');
  });
});

// ─── markStarted — exactly once on mount ─────────────────────────────────────

describe('LessonPlayer — markStarted', () => {
  it('calls markStarted exactly once on mount with the lesson slug', async () => {
    const store = makeMockStore();
    vi.mocked(createLearnProgressStore).mockReturnValue(store);

    render(<LessonPlayer lesson={FIXTURE_LESSON} />);

    await waitFor(() => expect(store.markStarted).toHaveBeenCalledTimes(1));
    expect(store.markStarted).toHaveBeenCalledWith('test-lesson');
  });
});

// ─── Quiz completion ──────────────────────────────────────────────────────────

/** Answers the single-question quiz correctly and advances to results. */
async function completeQuiz() {
  const user = userEvent.setup();
  const choices = screen.getAllByRole('radio');
  await user.click(choices[1]); // index 1 = 'The working memory' (correctIndex = 1)
  await user.click(screen.getByRole('button', { name: /Submit answer/i }));
  await user.click(screen.getByRole('button', { name: /See results/i }));
}

describe('LessonPlayer — quiz completion', () => {
  it('fires recordQuiz with correct counts and shows the completion banner with score and applyCta', async () => {
    const store = makeMockStore();
    vi.mocked(createLearnProgressStore).mockReturnValue(store);

    render(<LessonPlayer lesson={FIXTURE_LESSON} />);
    await completeQuiz();

    await waitFor(() =>
      expect(store.recordQuiz).toHaveBeenCalledWith('test-lesson', 1, 1),
    );

    const banner = await screen.findByRole('region', { name: /Lesson complete/i });
    expect(banner).toBeInTheDocument();
    // Score line is visible in the banner
    expect(banner).toHaveTextContent(/1 of 1/);
    // applyCta link is rendered with the correct href
    const ctaLink = screen.getByRole('link', { name: /Browse setups/i });
    expect(ctaLink).toHaveAttribute('href', '/professionals');
  });

  it('shows the completion banner without a CTA link when applyCta is null', async () => {
    render(<LessonPlayer lesson={FIXTURE_NO_CTA} />);
    await completeQuiz();

    const banner = await screen.findByRole('region', { name: /Lesson complete/i });
    expect(banner).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Browse setups/i })).not.toBeInTheDocument();
  });
});

// ─── Block sequence order ─────────────────────────────────────────────────────

describe('LessonPlayer — block sequence order', () => {
  it('renders every content block in the fixture-declared order', () => {
    render(<LessonPlayer lesson={FIXTURE_LESSON} />);

    // One distinctive landmark per block, matching the fixture's declaration order.
    const landmarks = [
      screen.getByRole('heading', { name: 'The Prose Heading' }), // 0 prose
      document.querySelector('.block-callout')!,                    // 1 callout
      document.querySelector('.hotspot-block')!,                    // 2 hotspotDiagram
      document.querySelector('.flip-cards')!,                       // 3 flipCards
      document.querySelector('.step-through-card')!,                // 4 stepThrough
      screen.getByRole('tablist'),                                  // 5 beforeAfter
      screen.getByRole('table'),                                    // 6 comparisonTable
      document.querySelector('.wgt-context-meter')!,                // 7 customWidget
    ];

    for (let i = 0; i < landmarks.length - 1; i++) {
      expect(
        landmarks[i].compareDocumentPosition(landmarks[i + 1]) & Node.DOCUMENT_POSITION_FOLLOWING,
        `block[${i}] must precede block[${i + 1}] in the DOM`,
      ).toBeTruthy();
    }
  });

  it('quiz radiogroup appears after the last content block in document order', () => {
    render(<LessonPlayer lesson={FIXTURE_LESSON} />);

    const lastContentBlock = document.querySelector('.wgt-context-meter')!;
    const quizLandmark = screen.getByRole('radiogroup');

    expect(
      lastContentBlock.compareDocumentPosition(quizLandmark) & Node.DOCUMENT_POSITION_FOLLOWING,
      'quiz radiogroup must follow the last content block in the DOM',
    ).toBeTruthy();
  });
});
