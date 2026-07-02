'use client';

export interface WizardStep {
  id: string;
  label: string;
}

interface Props {
  steps: WizardStep[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export default function StepRail({ steps, currentIndex, onNavigate }: Props) {
  return (
    <nav className="steps-rail" aria-label="Customization steps">
      {steps.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <button
            key={step.id}
            type="button"
            className={`rail-step${isDone ? ' done' : ''}`}
            aria-current={isCurrent ? 'step' : undefined}
            onClick={() => onNavigate(i)}
          >
            <span className="n" aria-hidden="true">
              {isDone ? (
                /* checkmark for done steps */
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            {step.label}
            {isDone && <span className="sr-only"> (completed)</span>}
          </button>
        );
      })}
    </nav>
  );
}
