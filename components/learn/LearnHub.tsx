'use client';

/**
 * LearnHub — client component, the body of the /learn page.
 *
 * Hydration contract: progress state starts NEUTRAL ({} / loaded=false)
 * on the server and on the first client render. After mount the component
 * loads the actual progress from the store and re-renders. This prevents
 * React hydration mismatches between the server HTML and the first paint.
 *
 * Auth pattern mirrors LessonPlayer.tsx and Nav.tsx:
 *   1. Try to create the Supabase browser client.
 *   2. If env vars are absent (tests, dev), fall back to a null-userId store.
 *   3. If Supabase is available, subscribe to onAuthStateChange (fires
 *      INITIAL_SESSION synchronously from the cookie) to resolve the userId
 *      before loading progress.
 *   4. Cleanup: unsubscribe on unmount.
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import type { Lesson, ProgressMap } from '@/lib/learn/types';
import { TRACKS } from '@/lib/learn/types';
import { continueTarget } from '@/lib/learn/progress';
import { createLearnProgressStore } from '@/lib/learn/progressStore';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import TrackSection from './TrackSection';
import type { SupabaseClient } from '@supabase/supabase-js';

// ── Check icon (used in the hero progress pill) ───────────────────────────────

function PillCheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m2.5 7 3 3 6-6" />
    </svg>
  );
}

// ── Play icon (used in the continue banner) ───────────────────────────────────

function PlayIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m10 8 6 4-6 4V8z" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  lessons: Lesson[];
}

export default function LearnHub({ lessons }: Props) {
  /**
   * progressMap starts empty — renders NEUTRAL on server and first client
   * paint. The effect below loads the real map after mount.
   */
  const [progressMap, setProgressMap] = useState<ProgressMap>({});

  /**
   * loaded becomes true only after the async store.load() resolves.
   * The continue banner and status treatments are suppressed until then
   * to avoid hydration mismatches.
   */
  const [loaded, setLoaded] = useState(false);

  /**
   * pillTarget is the DOM element to portal the progress pill into.
   * Resolved after mount from #learn-progress-pill-slot (present in page.tsx).
   * Null in tests (slot not present) → pill renders inline instead.
   */
  const [pillTarget, setPillTarget] = useState<Element | null>(null);

  useEffect(() => {
    setPillTarget(document.getElementById('learn-progress-pill-slot'));
  }, []);

  useEffect(() => {
    let supabase: SupabaseClient | null = null;

    async function loadWithStore(userId: string | null, client: SupabaseClient) {
      const store = createLearnProgressStore(userId, client);
      const map = await store.load();
      setProgressMap(map);
      setLoaded(true);
    }

    try {
      supabase = createSupabaseBrowserClient();
    } catch {
      // Supabase env vars absent (tests / dev without .env.local).
      // Use a null-userId store backed by localStorage only.
      const fallbackClient = {} as SupabaseClient;
      void loadWithStore(null, fallbackClient);
      return;
    }

    // Mirror Nav.tsx / LessonPlayer.tsx: subscribe to onAuthStateChange.
    // INITIAL_SESSION fires synchronously from the cookie on mount.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const userId = session?.user?.id ?? null;
      void loadWithStore(userId, supabase!);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Derive the continue target only after progress has loaded.
  const target = loaded ? continueTarget(lessons, progressMap) : null;

  // Pass the actual progressMap to sections once loaded; empty map before that.
  const activeMap = loaded ? progressMap : {};

  // Count completed lessons from the loaded map, restricted to known lesson
  // slugs — stale entries in a returning user's storage must not inflate the pill.
  const completedCount = loaded
    ? lessons.filter((l) => progressMap[l.slug]?.status === 'completed').length
    : 0;

  // Progress pill: null (neutral) before load; "{n} of {total} lessons completed" after.
  // Portals into #learn-progress-pill-slot in the hero when the slot exists;
  // renders inline otherwise (tests, environments without the page wrapper).
  const pillContent = loaded ? (
    <span className="progress-note">
      <PillCheckIcon />
      {completedCount} of {lessons.length} lessons completed
    </span>
  ) : null;

  return (
    <>
      {/* Hero progress pill — portaled into the server-rendered hero-meta slot */}
      {pillTarget ? createPortal(pillContent, pillTarget) : pillContent}

      {/* Continue banner — only shown after load and only when there is an
          in-progress lesson. aria-label makes the banner's purpose clear to
          screen reader users who may navigate by landmarks.                  */}
      {target && (
        <div className="continue-banner" aria-label="Continue where you left off">
          <span className="cb-icon">
            <PlayIcon />
          </span>
          <div className="cb-body">
            <span className="cb-eyebrow">Continue where you left off</span>
            <p className="cb-title">{target.title}</p>
            <span className="cb-meta">
              {TRACKS.find((t) => t.slug === target.track)?.title} &middot;{' '}
              {target.minutes} min &middot; in progress
            </span>
          </div>
          <Link
            className="btn btn-iris btn-sm"
            href={`/learn/${target.track}/${target.slug}`}
          >
            Continue lesson
          </Link>
        </div>
      )}

      {/* Four track sections in TRACKS order */}
      {TRACKS.map((track) => {
        const trackLessons = lessons
          .filter((l) => l.track === track.slug)
          .sort((a, b) => a.order - b.order);
        return (
          <TrackSection
            key={track.slug}
            track={track}
            lessons={trackLessons}
            progressMap={activeMap}
          />
        );
      })}
    </>
  );
}
