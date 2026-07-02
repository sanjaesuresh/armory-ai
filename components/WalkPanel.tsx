'use client';

import type { ReactNode, RefObject } from 'react';
import Link from 'next/link';

export interface PanelStep {
  label: string;
  heading: string;
  body: ReactNode;
  imageKey: string;
}

// Known image dimensions — set explicitly to prevent CLS.
const IMG_DIMS: Record<string, { width: number; height: number }> = {
  'create-project':       { width: 480, height: 300 },
  'name-project':         { width: 480, height: 300 },
  'paste-instructions':   { width: 480, height: 300 },
  'upload-knowledge-file':{ width: 480, height: 300 },
  'project-ready':        { width: 480, height: 300 },
};

interface Props {
  step: PanelStep;
  stepNumber: number;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
  /** Setup slug — used to build the "Adjust your setup" link on the final step. */
  slug: string;
  /** Ref forwarded to the h2 heading so focus can be moved on step change. */
  headingRef?: RefObject<HTMLHeadingElement | null>;
  onNext: () => void;
  onBack: () => void;
}

/**
 * Renders one step panel: instruction text (left) + screenshot (right).
 * The right column is aria-hidden because the adjacent text describes the action.
 */
export default function WalkPanel({
  step,
  stepNumber,
  totalSteps,
  isFirst,
  isLast,
  slug,
  headingRef,
  onNext,
  onBack,
}: Props) {
  const dims = IMG_DIMS[step.imageKey] ?? { width: 480, height: 300 };

  return (
    <div className="walk-panel">
      {/* ── Instruction column ──────────────────────────────────────────── */}
      <div>
        <span className="eyebrow">
          Step {stepNumber} of {totalSteps}
        </span>

        {/* tabIndex={-1} so we can focus it programmatically; outline suppressed
            because the focus is for assistive-tech cue, not keyboard styling. */}
        <h2
          ref={headingRef}
          tabIndex={-1}
          style={{ outline: 'none' }}
        >
          {step.heading}
        </h2>

        <p className="muted" style={{ marginBottom: 0 }}>
          {step.body}
        </p>

        {/* Back / Next nav */}
        <div className="walk-nav">
          {!isFirst && (
            <button type="button" className="btn btn-outline" onClick={onBack}>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M9.5 3L5 7.5 9.5 12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </button>
          )}
          {!isLast && (
            <button type="button" className="btn btn-primary" onClick={onNext}>
              Next
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5.5 3L10 7.5 5.5 12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Final step: secondary action */}
        {isLast && (
          <p className="small" style={{ marginTop: '14px' }}>
            <Link href={`/setup/${slug}/customize`}>
              Want to change something? Adjust your setup
            </Link>
          </p>
        )}
      </div>

      {/* ── Screenshot column (decorative) ──────────────────────────────── */}
      <div aria-hidden="true">
        <img
          src={`/walkthrough/${step.imageKey}.svg`}
          alt=""
          width={dims.width}
          height={dims.height}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: 'var(--r-md)',
            border: '1px solid var(--hairline)',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
}
