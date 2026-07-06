/**
 * LearnHub — DOM tests (vitest + jsdom + React Testing Library).
 *
 * Store is stubbed via vi.mock; Supabase is stubbed to throw (no env vars),
 * forcing the null-userId path in the component.
 *
 * TDD order: write all failing cases here first (Step 1 / Step 2), then
 * implement the components (Step 3), then verify green (Step 5).
 */

import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Lesson, LessonProgress, ProgressMap } from '@/lib/learn/types';
import { TRACKS } from '@/lib/learn/types';

// ── Module mocks ──────────────────────────────────────────────────────────────

vi.mock('@/lib/supabase/client', () => ({
  createSupabaseBrowserClient: vi.fn(() => {
    throw new Error('No Supabase env in tests');
  }),
}));

vi.mock('@/lib/learn/progressStore', () => ({
  createLearnProgressStore: vi.fn(),
  loadLocalProgress: vi.fn(() => ({})),
  saveLocalProgress: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/learn'),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

import { createLearnProgressStore } from '@/lib/learn/progressStore';
import LearnHub from '@/components/learn/LearnHub';

// ── Fixture lessons: one per track ───────────────────────────────────────────

const makeLesson = (
  slug: string,
  track: Lesson['track'],
  title: string,
  minutes = 5,
): Lesson => ({
  slug,
  track,
  title,
  tagline: `Tagline for ${title}`,
  minutes,
  order: 1,
  blocks: [],
  quiz: { questions: [] },
  applyCta: null,
});

const FIXTURE_LESSONS: Lesson[] = [
  makeLesson('l-foundations-1', 'foundations', 'Foundations Lesson 1'),
  makeLesson('l-chatgpt-1', 'chatgpt', 'ChatGPT Lesson 1'),
  makeLesson('l-claude-app-1', 'claude-app', 'Claude App Lesson 1'),
  makeLesson('l-claude-code-1', 'claude-code', 'Claude Code Lesson 1'),
];

// ── Store stub factory ────────────────────────────────────────────────────────

type PartialProgress = Partial<LessonProgress>;

function makeProgressEntry(
  status: LessonProgress['status'],
  bestScorePct: number | null = null,
  completedAt: string | null = null,
): LessonProgress {
  return { status, bestScorePct, completedAt };
}

function stubStore(map: ProgressMap) {
  const mockLoad = vi.fn().mockResolvedValue(map);
  const mockStore = {
    load: mockLoad,
    markStarted: vi.fn().mockResolvedValue(undefined),
    recordQuiz: vi.fn().mockResolvedValue(undefined),
  };
  vi.mocked(createLearnProgressStore).mockReturnValue(mockStore);
  return { mockStore, mockLoad };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('LearnHub', () => {
  beforeEach(() => {
    // Default: empty progress
    stubStore({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ── Four sections in TRACKS order ──────────────────────────────────────────

  it('renders four track sections in the verbatim TRACKS order', async () => {
    render(<LearnHub lessons={FIXTURE_LESSONS} />);

    // Wait for sections to appear (effect has fired, state updated)
    await waitFor(() => {
      const sections = screen.getAllByRole('region');
      expect(sections.length).toBeGreaterThanOrEqual(4);
    });

    // Heading order must match TRACKS order exactly
    const headings = screen.getAllByRole('heading', { level: 2 });
    const titles = headings.map((h) => h.textContent);
    const trackTitles = TRACKS.map((t) => t.title);
    // All track titles must appear in TRACKS order as h2s
    let lastIdx = -1;
    for (const title of trackTitles) {
      const idx = titles.indexOf(title);
      expect(idx).toBeGreaterThan(lastIdx);
      lastIdx = idx;
    }
  });

  // ── Card links to lesson path ───────────────────────────────────────────────

  it('each lesson card links to /learn/<track>/<slug>', async () => {
    render(<LearnHub lessons={FIXTURE_LESSONS} />);

    await waitFor(() => {
      for (const lesson of FIXTURE_LESSONS) {
        const link = screen.getByRole('link', { name: new RegExp(lesson.title, 'i') });
        expect(link).toHaveAttribute('href', `/learn/${lesson.track}/${lesson.slug}`);
      }
    });
  });

  // ── Completed card shows check + score badge + ring reads N completed ───────

  it('a completed lesson card shows the status check and score badge', async () => {
    const completedSlug = 'l-foundations-1';
    const map: ProgressMap = {
      [completedSlug]: makeProgressEntry('completed', 80, '2025-01-01T00:00:00Z'),
    };
    stubStore(map);

    render(<LearnHub lessons={FIXTURE_LESSONS} />);

    await waitFor(() => {
      // The "Completed" status label must appear
      expect(screen.getByText('Completed')).toBeInTheDocument();
      // Score badge with 80%
      expect(screen.getByText('80%')).toBeInTheDocument();
    });
  });

  it('the foundations progress ring reads "1 of 1 completed" when one lesson done', async () => {
    const map: ProgressMap = {
      'l-foundations-1': makeProgressEntry('completed', 100, '2025-01-01T00:00:00Z'),
    };
    stubStore(map);

    render(<LearnHub lessons={FIXTURE_LESSONS} />);

    await waitFor(() => {
      // The ProgressRing container has an accessible aria-label
      const ring = screen.getByLabelText('1 of 1 completed');
      expect(ring).toBeInTheDocument();
    });
  });

  // ── In-progress lesson renders the continue banner naming that lesson ────────

  it('renders the continue banner naming the in-progress lesson', async () => {
    const map: ProgressMap = {
      'l-foundations-1': makeProgressEntry('in-progress'),
    };
    stubStore(map);

    render(<LearnHub lessons={FIXTURE_LESSONS} />);

    await waitFor(() => {
      // "Continue where you left off" eyebrow must be present
      expect(screen.getByText(/continue where you left off/i)).toBeInTheDocument();
      // The cb-title paragraph inside the banner names the lesson
      const banner = screen
        .getByText(/continue where you left off/i)
        .closest('[aria-label="Continue where you left off"]');
      expect(banner).not.toBeNull();
      expect(banner!.textContent).toContain('Foundations Lesson 1');
    });
  });

  it('the continue banner links to the in-progress lesson page', async () => {
    const map: ProgressMap = {
      'l-chatgpt-1': makeProgressEntry('in-progress'),
    };
    stubStore(map);

    render(<LearnHub lessons={FIXTURE_LESSONS} />);

    await waitFor(() => {
      const link = screen.getByRole('link', { name: /continue lesson/i });
      expect(link).toHaveAttribute('href', '/learn/chatgpt/l-chatgpt-1');
    });
  });

  // ── Empty progressMap renders no banner, neutral cards ──────────────────────

  it('renders no continue banner when progressMap is empty', async () => {
    // Default stubStore({}) already set in beforeEach
    render(<LearnHub lessons={FIXTURE_LESSONS} />);

    // Wait for mount to have resolved
    await waitFor(() => {
      expect(screen.queryByText(/continue where you left off/i)).toBeNull();
    });
  });

  it('cards show no status treatment when progressMap is empty (neutral)', async () => {
    render(<LearnHub lessons={FIXTURE_LESSONS} />);

    await waitFor(() => {
      // No "Completed" or "In progress" status labels
      expect(screen.queryByText('Completed')).toBeNull();
      expect(screen.queryByText('In progress')).toBeNull();
    });
  });

  // ── Section anchor ids ──────────────────────────────────────────────────────

  it('each track section wrapper has the track slug as its element id', async () => {
    render(<LearnHub lessons={FIXTURE_LESSONS} />);

    await waitFor(() => {
      for (const track of TRACKS) {
        const section = document.getElementById(track.slug);
        expect(section).not.toBeNull();
        expect(section!.tagName.toLowerCase()).toBe('section');
      }
    });
  });

  // ── Neutral first render (hydration safety) ──────────────────────────────────
  // The component must show NEUTRAL progress on the synchronous (server/first
  // client) render — before the async load() resolves. This prevents a React
  // hydration mismatch between server-rendered HTML and the first client render.

  it('neutral first render: no continue banner before progress loads', () => {
    // Even though the store resolves with an in-progress lesson,
    // the synchronous first render must show no banner.
    const map: ProgressMap = {
      'l-foundations-1': makeProgressEntry('in-progress'),
    };
    stubStore(map);

    render(<LearnHub lessons={FIXTURE_LESSONS} />);

    // Synchronously — before any awaits — the banner must be absent.
    expect(screen.queryByText(/continue where you left off/i)).toBeNull();
    // Card status treatments must also be absent before load.
    expect(screen.queryByText('In progress')).toBeNull();
    expect(screen.queryByText('Completed')).toBeNull();
    // Progress pill must not show any completion numbers before load.
    expect(screen.queryByText(/lessons completed/i)).toBeNull();
  });

  // ── Hero progress pill ────────────────────────────────────────────────────────

  it('progress pill: no "lessons completed" text before load resolves (neutral)', () => {
    const map: ProgressMap = {
      'l-foundations-1': makeProgressEntry('completed', 90, '2025-01-01T00:00:00Z'),
    };
    stubStore(map);

    render(<LearnHub lessons={FIXTURE_LESSONS} />);

    // Synchronously — before any awaits — the pill must be absent.
    expect(screen.queryByText(/lessons completed/i)).toBeNull();
  });

  it('progress pill: shows "{completed} of {total} lessons completed" after load', async () => {
    const map: ProgressMap = {
      'l-foundations-1': makeProgressEntry('completed', 90, '2025-01-01T00:00:00Z'),
    };
    stubStore(map);

    render(<LearnHub lessons={FIXTURE_LESSONS} />);

    await waitFor(() => {
      // FIXTURE_LESSONS has 4 lessons; 1 is completed.
      expect(screen.getByText(/1 of 4 lessons completed/i)).toBeInTheDocument();
    });
  });

  // ── Renders gracefully with no lessons (ALL_LESSONS empty) ─────────────────

  it('renders four track section headings even when lessons array is empty', async () => {
    render(<LearnHub lessons={[]} />);

    await waitFor(() => {
      for (const track of TRACKS) {
        expect(screen.getByRole('heading', { level: 2, name: track.title })).toBeInTheDocument();
      }
    });
  });

  it('shows no continue banner when lessons array is empty', async () => {
    render(<LearnHub lessons={[]} />);

    await waitFor(() => {
      expect(screen.queryByText(/continue where you left off/i)).toBeNull();
    });
  });
});
