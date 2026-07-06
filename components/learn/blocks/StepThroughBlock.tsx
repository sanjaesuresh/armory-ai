'use client';

import { useState, type KeyboardEvent } from 'react';
import type { StepThroughBlock as StepThroughBlockData } from '@/lib/learn/types';

/**
 * StepThroughBlock — one step at a time with a dot-progress rail and a
 * "Step N of M" indicator. Previous is disabled on the first step; Next becomes
 * a subdued done state on the last. Arrow keys move between steps when the card
 * (or a control inside it) has focus.
 */
function ArrowLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12l5 5 9-11" />
    </svg>
  );
}

export default function StepThroughBlock({ block }: { block: StepThroughBlockData }) {
  const total = block.steps.length;
  const [index, setIndex] = useState(0);
  const atStart = index === 0;
  const atEnd = index === total - 1;

  const go = (next: number) => setIndex(Math.max(0, Math.min(total - 1, next)));

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(index - 1);
    }
  };

  return (
    <section className="lblock">
      {block.intro ? <p>{block.intro}</p> : null}
      <div
        className="step-through-card"
        role="group"
        aria-label="Step-through — use the arrow keys to move between steps"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <div className="step-pips" aria-hidden="true">
          {block.steps.map((_, i) => (
            <span
              key={i}
              className={`step-pip${i < index ? ' pip-done' : ''}${i === index ? ' pip-active' : ''}`}
            />
          ))}
        </div>

        {block.steps.map((step, i) => (
          <div className="step-panel" key={i} hidden={i !== index}>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
        ))}

        <div className="step-nav-row">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => go(index - 1)}
            disabled={atStart}
            aria-label="Previous step"
          >
            <ArrowLeft />
            Previous
          </button>
          <button
            type="button"
            className={`btn btn-sm ${atEnd ? 'btn-ghost step-done' : 'btn-outline'}`}
            onClick={() => go(index + 1)}
            disabled={atEnd}
            aria-label={atEnd ? 'Last step reached' : 'Next step'}
          >
            {atEnd ? (
              <>
                Done
                <Check />
              </>
            ) : (
              <>
                Next
                <ArrowRight />
              </>
            )}
          </button>
          <span className="step-of" aria-live="polite">
            Step {index + 1} of {total}
          </span>
        </div>
      </div>
    </section>
  );
}
