'use client';

export interface RailStep {
  label: string;
}

interface Props {
  steps: RailStep[];
  currentIndex: number;
  onStepClick: (index: number) => void;
}

/**
 * Horizontal numbered step rail for the install walkthrough.
 * Each step is a button with aria-current="step" on the active one
 * and a "done" class on completed ones. Connector lines come from CSS.
 */
export default function WalkRail({ steps, currentIndex, onStepClick }: Props) {
  return (
    <div className="walk-rail" role="group" aria-label="Install steps">
      {steps.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <button
            key={i}
            type="button"
            className={`walk-step${isDone ? ' done' : ''}`}
            aria-current={isCurrent ? 'step' : undefined}
            onClick={() => onStepClick(i)}
          >
            <span className="wn" aria-hidden="true">
              {isDone ? (
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 6.5l3.5 3.5 5.5-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <span className="wt">{step.label}</span>
            {isDone && <span className="sr-only"> (completed)</span>}
          </button>
        );
      })}
    </div>
  );
}
