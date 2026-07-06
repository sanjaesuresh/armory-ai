/**
 * Learn hub page — server component.
 *
 * Passes ALL_LESSONS to the client-side LearnHub component.
 * When ALL_LESSONS is empty (Tasks 9–12 not yet run), LearnHub renders
 * four track section headers gracefully with empty card grids.
 *
 * Page title: "Learn AI — Armory" (suffixed by the metadata template in
 * layout.tsx; the short title "Learn AI" is the visible browser tab text).
 */

import type { Metadata } from 'next';
import { ALL_LESSONS } from '@/data/lessons';
import LearnHub from '@/components/learn/LearnHub';

export const metadata: Metadata = {
  title: 'Learn AI',
  description:
    'Interactive lessons on how AI tools actually work — context, instructions, projects, and agents. Free, no sign-in required.',
};

export default function LearnPage() {
  return (
    <main>
      {/* Header strip */}
      <div className="learn-hero">
        <div className="wrap">
          <div className="learn-hero-inner">
            <div className="learn-hero-text">
              <span className="eyebrow">Learn AI</span>
              <h1>Understand what you&apos;re exporting</h1>
              <p className="sub">
                Interactive lessons on how AI tools actually work — context,
                instructions, projects, and agents. No jargon, no fluff. Each
                lesson ends with a quiz.
              </p>
              <div className="learn-hero-meta">
                {/* Pill slot: LearnHub portals the progress pill here after load */}
                <div id="learn-progress-pill-slot" />
                <span>Free &middot; no sign-in required to learn</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hub body: continue banner + four track sections */}
      <div className="wrap learn-hub-body">
        <LearnHub lessons={ALL_LESSONS} />
      </div>
    </main>
  );
}
