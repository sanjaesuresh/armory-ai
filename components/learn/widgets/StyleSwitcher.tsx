'use client';

import { useRef, useState } from 'react';

/**
 * StyleSwitcher — teaches Claude Styles by letting the learner pick one of
 * four styles (Default, Concise, Formal, Explanatory) and watch the SAME
 * answer, to the SAME question, rewrite instantly in that voice. The
 * question and per-style answers are lifted from / consistent with the
 * claude-styles lesson's before/after block (email open-rate example).
 *
 * Deterministic: each style maps to a precomputed answer, no randomness, no
 * network. Pills are a single-select radiogroup with roving tabindex + arrow
 * keys, mirroring QuizBlock's pattern. No props — fully self-contained.
 */

interface StyleDef {
  id: string;
  label: string;
  /** One-line note on what this style optimizes for, shown under the answer. */
  optimizesFor: string;
  answer: string;
}

const QUESTION = "Give me three ways to improve this week's email open rate.";

const STYLES: StyleDef[] = [
  {
    id: 'default',
    label: 'Default',
    optimizesFor: 'A balanced, general-purpose answer, some explanation, no strict length limit.',
    answer:
      "Here are three ways to improve your email open rate this week:\n\n1. Test a different subject line. Subject lines have a significant impact on whether people open your emails, try a question or a specific number to draw curiosity.\n\n2. Check your send time. Timing can affect open rates meaningfully; many audiences respond better to emails sent on Tuesday or Wednesday morning.\n\n3. Segment your list. Sending to a smaller, more targeted group tends to improve relevance and, with it, open rates.",
  },
  {
    id: 'concise',
    label: 'Concise',
    optimizesFor: 'Shortest useful answer, no filler, one clear next step.',
    answer:
      'Three levers this week:\n\n1. Rewrite the subject line, test a question or a specific number ("3 things you missed").\n2. Move the send time, try Tuesday or Wednesday, 8–10 AM.\n3. Narrow the segment, email the 20% who opened last time before blasting the full list.\n\nStart with subject line; it has the fastest feedback loop.',
  },
  {
    id: 'formal',
    label: 'Formal',
    optimizesFor: 'Buttoned-up, precise language, suited for a report or a client.',
    answer:
      'Three recommendations to improve this week\'s email open rate:\n\n1. Revise the subject line. A/B test a question-based phrasing against a specific-number phrasing to determine which yields a higher open rate.\n\n2. Reassess the send schedule. Industry data suggests Tuesday or Wednesday morning delivery windows typically outperform other days for open rates.\n\n3. Apply audience segmentation. Restricting delivery to previously engaged recipients before a broader send tends to improve relevance and, consequently, open performance.\n\nI recommend prioritizing the subject line test, as it produces measurable results most quickly.',
  },
  {
    id: 'explanatory',
    label: 'Explanatory',
    optimizesFor: 'Longer, walks through the reasoning, includes a worked example.',
    answer:
      "Here are three ways to improve your email open rate this week, with the reasoning behind each:\n\n1. Test a different subject line. The subject line is the only thing a recipient sees before deciding to open, so small changes here tend to move open rate more than anything else. Example: instead of \"March Newsletter,\" try \"3 things you missed this week\", it signals concrete value up front.\n\n2. Check your send time. Open rate depends partly on when your audience is actually checking email. If you've always sent on Monday at 9am, try Tuesday or Wednesday morning instead and compare, timing shifts can surface an audience habit you didn't know about.\n\n3. Segment your list. A send to your most-engaged 20% (people who opened last time) will almost always show a higher open rate than a send to your full list, because you're testing on people already inclined to open. Use that smaller send to validate a change before rolling it out broadly.\n\nIf you only have time for one change, start with the subject line, it's the fastest to test and the easiest to attribute results to.",
  },
];

const DEFAULT_STYLE_INDEX = 0;

export default function StyleSwitcher() {
  const [selectedIndex, setSelectedIndex] = useState(DEFAULT_STYLE_INDEX);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selected = STYLES[selectedIndex];

  // Roving tabindex + arrow-key navigation, matching QuizBlock's radiogroup pattern.
  function onGroupKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) return;
    e.preventDefault();
    const count = STYLES.length;
    const next =
      e.key === 'ArrowDown' || e.key === 'ArrowRight'
        ? (selectedIndex + 1) % count
        : (selectedIndex - 1 + count) % count;
    setSelectedIndex(next);
    pillRefs.current[next]?.focus();
  }

  return (
    <section className="lblock wgt-style-switcher" aria-labelledby="ss-heading">
      <h2 id="ss-heading">Pick a Style, watch the answer change</h2>
      <p>
        Same question, same knowledge, different voice. Choose a Style below and
        see how it reshapes the same answer, tone, length, and formality change;
        the underlying facts don&apos;t.
      </p>

      {/* Style pills — single-select radiogroup, roving tabindex */}
      <div
        className="ss-pills"
        role="radiogroup"
        aria-label="Claude Style"
        onKeyDown={onGroupKeyDown}
      >
        {STYLES.map((style, i) => {
          const isSelected = i === selectedIndex;
          return (
            <button
              key={style.id}
              ref={(el) => { pillRefs.current[i] = el; }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              className={`ss-pill${isSelected ? ' ss-pill-active' : ''}`}
              onClick={() => setSelectedIndex(i)}
            >
              {style.label}
            </button>
          );
        })}
      </div>

      {/* Optimizes-for note */}
      <p className="ss-optimizes" aria-live="polite">
        <strong>{selected.label}</strong> optimizes for: {selected.optimizesFor}
      </p>

      {/* Fixed question + rewritten answer, chat-bubble panel */}
      <div className="ss-panel">
        <p className="chat-bub cb-user">{QUESTION}</p>
        <p className="chat-bub cb-ai ss-answer" aria-live="polite" aria-atomic="true">
          {selected.answer}
        </p>
      </div>
    </section>
  );
}
