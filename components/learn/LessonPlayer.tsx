'use client';

/**
 * LessonPlayer — client component that renders a full lesson: page chrome
 * (breadcrumb, header), the ordered block sequence, the quiz, and the
 * completion banner.
 *
 * Auth pattern mirrors Nav.tsx: subscribe to onAuthStateChange (fires
 * INITIAL_SESSION synchronously from the session cookie) to resolve the
 * userId before creating the progress store. markStarted is called exactly
 * once on mount via a ref guard; recordQuiz is called on each quiz completion
 * (retakes re-fire, allowing the store to update bestScorePct).
 *
 * The block dispatch switch is exhaustive over the Block union — a new block
 * type that is added to lib/learn/types.ts without a matching case here will
 * cause a TypeScript compile error via the assertNever default arm.
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Lesson, Block } from '@/lib/learn/types';
import { TRACKS } from '@/lib/learn/types';
import ProseBlock from '@/components/learn/blocks/ProseBlock';
import CalloutBlock from '@/components/learn/blocks/CalloutBlock';
import HotspotDiagramBlock from '@/components/learn/blocks/HotspotDiagramBlock';
import FlipCardsBlock from '@/components/learn/blocks/FlipCardsBlock';
import StepThroughBlock from '@/components/learn/blocks/StepThroughBlock';
import BeforeAfterBlock from '@/components/learn/blocks/BeforeAfterBlock';
import ComparisonTableBlock from '@/components/learn/blocks/ComparisonTableBlock';
import CustomWidgetBlock from '@/components/learn/blocks/CustomWidgetBlock';
import QuizBlock from '@/components/learn/blocks/QuizBlock';
import { createLearnProgressStore } from '@/lib/learn/progressStore';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

// ─── Exhaustiveness helper ─────────────────────────────────────────────────────
// The TypeScript compiler enforces that every Block variant is handled. Any
// future variant not covered by the switch will cause a compile error here.
function assertNever(x: never): never {
  throw new Error(
    `Unhandled block type: ${(x as { type: string }).type}`,
  );
}

// ─── Block dispatcher ─────────────────────────────────────────────────────────
function renderBlock(block: Block, index: number): React.ReactNode {
  switch (block.type) {
    case 'prose':
      return <ProseBlock key={index} block={block} />;
    case 'callout':
      return <CalloutBlock key={index} block={block} />;
    case 'hotspotDiagram':
      return <HotspotDiagramBlock key={index} block={block} />;
    case 'flipCards':
      return <FlipCardsBlock key={index} block={block} />;
    case 'stepThrough':
      return <StepThroughBlock key={index} block={block} />;
    case 'beforeAfter':
      return <BeforeAfterBlock key={index} block={block} />;
    case 'comparisonTable':
      return <ComparisonTableBlock key={index} block={block} />;
    case 'customWidget':
      return <CustomWidgetBlock key={index} block={block} />;
    default:
      return assertNever(block);
  }
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ArrowLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
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

function ArrowRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface QuizScore {
  correct: number;
  total: number;
}

interface Props {
  lesson: Lesson;
}

export default function LessonPlayer({ lesson }: Props) {
  const [score, setScore] = useState<QuizScore | null>(null);

  // storeRef holds the progress store once auth resolves so both markStarted
  // (on mount) and recordQuiz (on quiz completion) share the same store instance.
  const storeRef = useRef<ReturnType<typeof createLearnProgressStore> | null>(null);

  // markedRef guards markStarted so it fires exactly once across the
  // component's lifetime, regardless of how many auth events fire.
  const markedRef = useRef(false);

  const track = TRACKS.find((t) => t.slug === lesson.track) ?? TRACKS[0];

  // ── Auth + initial progress mark ──────────────────────────────────────────
  // Mirrors Nav.tsx: create the browser client, subscribe to onAuthStateChange
  // (fires INITIAL_SESSION almost immediately from the session cookie), then
  // create the store with the resolved userId and call markStarted once.
  //
  // markedRef guards markStarted so it fires exactly once even if
  // onAuthStateChange fires multiple events (sign-in → sign-out etc.).
  // The subscription is cleaned up on unmount via the effect return.
  //
  // Important: do NOT reference `subscription` inside the callback — the
  // callback may fire synchronously (in tests), before the destructuring
  // assignment completes (TDZ). The cleanup function handles unsubscription.
  useEffect(() => {
    let supabase: SupabaseClient | null = null;
    try {
      supabase = createSupabaseBrowserClient();
    } catch {
      // Supabase env vars absent (e.g. dev without .env.local or unit tests).
      if (!markedRef.current) {
        markedRef.current = true;
        const store = createLearnProgressStore(null, {} as SupabaseClient);
        storeRef.current = store;
        store.markStarted(lesson.slug);
      }
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!markedRef.current) {
        markedRef.current = true;
        const userId = session?.user?.id ?? null;
        const store = createLearnProgressStore(userId, supabase!);
        storeRef.current = store;
        store.markStarted(lesson.slug);
      }
    });

    return () => subscription.unsubscribe();
  }, [lesson.slug]);

  // ── Quiz completion handler ───────────────────────────────────────────────
  // Called by QuizBlock each time the results screen is reached (retakes re-fire).
  // storeRef is set by the time any user can complete the quiz, since
  // onAuthStateChange fires INITIAL_SESSION synchronously from the cookie.
  const handleQuizComplete = (correct: number, total: number) => {
    setScore({ correct, total });
    storeRef.current?.recordQuiz(lesson.slug, correct, total);
  };

  const pct = score ? Math.round((score.correct / score.total) * 100) : null;

  return (
    <div className="lesson-page-wrap">
      {/* ── Breadcrumb ──────────────────────────────────────────────── */}
      <nav className="lesson-breadcrumb" aria-label="Breadcrumb">
        <Link href={`/learn#${lesson.track}`}>
          <ArrowLeftIcon />
          Back to Learn AI
        </Link>
      </nav>

      {/* ── Lesson header ───────────────────────────────────────────── */}
      <header className="lesson-lede">
        <div className="lesson-track-tag">
          <BookIcon />
          {track.title}
        </div>
        <h1>{lesson.title}</h1>
        <p className="lesson-tagline">{lesson.tagline}</p>
        <div className="lesson-meta-row">
          <span className="lm-item">
            <ClockIcon />
            {lesson.minutes} min
          </span>
        </div>
      </header>

      {/* ── Block sequence ──────────────────────────────────────────── */}
      {lesson.blocks.map((block, i) => renderBlock(block, i))}

      {/* ── Quiz (always last in the sequence) ──────────────────────── */}
      <QuizBlock block={lesson.quiz} onComplete={handleQuizComplete} />

      {/* ── Completion banner — visible after quiz results screen ────── */}
      {score !== null && (
        <section className="completion-banner" aria-label="Lesson complete">
          <h3>Lesson complete</h3>
          <p>
            You scored {score.correct} of {score.total} ({pct}%). You can
            retake the quiz above to improve your score.
          </p>
          {lesson.applyCta ? (
            <Link className="btn btn-primary" href={lesson.applyCta.href}>
              {lesson.applyCta.label}
              <ArrowRightIcon />
            </Link>
          ) : null}
        </section>
      )}
    </div>
  );
}
