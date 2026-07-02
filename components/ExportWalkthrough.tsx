'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { WalkthroughStep } from '@/lib/export/claudeApp';
import CopyBlock from './CopyBlock';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EmbeddedBlock {
  label: string;
  content: string;
}

/** WalkthroughStep extended with optional inline copy blocks. */
export interface StepWithBlocks extends WalkthroughStep {
  embeddedBlocks?: EmbeddedBlock[];
}

interface Props {
  steps: StepWithBlocks[];
  slug: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ExportWalkthrough({ steps, slug }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentStep = steps[currentIndex];
  const stepNum = currentIndex + 1;
  const totalSteps = steps.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSteps - 1;

  return (
    <div
      style={{
        border: '1px solid #e5e5e5',
        borderRadius: '6px',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Progress tracker — aria-live so screen readers announce step changes */}
      <div
        aria-live="polite"
        style={{
          padding: '0.75rem 1rem',
          background: '#f5f5f5',
          borderBottom: '1px solid #e5e5e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#555',
            letterSpacing: '0.03em',
          }}
        >
          Step {stepNum} of {totalSteps}
        </span>
        <div
          style={{
            display: 'flex',
            gap: '4px',
          }}
        >
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                width: '24px',
                height: '3px',
                borderRadius: '2px',
                background: i <= currentIndex ? '#1a1a1a' : '#d1d5db',
              }}
            />
          ))}
        </div>
      </div>

      {/* Screenshot */}
      <div
        style={{
          background: '#f9f9f9',
          borderBottom: '1px solid #e5e5e5',
          display: 'flex',
          justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <img
          data-testid="walkthrough-img"
          src={'/walkthrough/' + currentStep.imageKey + '.svg'}
          alt={currentStep.title}
          width={400}
          height={225}
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '4px',
            border: '1px solid #e5e5e5',
          }}
        />
      </div>

      {/* Step content */}
      <div style={{ padding: '1.25rem 1.5rem' }}>
        {isLast ? (
          <>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1a1a1a',
                margin: '0 0 0.5rem',
              }}
            >
              You&apos;re set up
            </h3>
            <p
              style={{
                fontSize: '0.95rem',
                color: '#555',
                margin: '0 0 1rem',
                lineHeight: 1.6,
              }}
            >
              {currentStep.body}
            </p>
            <Link
              href={`/setup/${slug}`}
              style={{
                fontSize: '0.85rem',
                color: '#1a1a1a',
                textDecoration: 'underline',
              }}
            >
              Adjust your setup
            </Link>
          </>
        ) : (
          <>
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#1a1a1a',
                margin: '0 0 0.5rem',
              }}
            >
              {currentStep.title}
            </h3>
            <p
              style={{
                fontSize: '0.9rem',
                color: '#555',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {currentStep.body}
            </p>
          </>
        )}

        {/* Inline copy blocks embedded in this step */}
        {currentStep.embeddedBlocks && currentStep.embeddedBlocks.length > 0 && (
          <div
            style={{
              marginTop: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {currentStep.embeddedBlocks.map((block, i) => (
              <CopyBlock key={i} label={block.label} content={block.content} />
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div
        style={{
          padding: '0.75rem 1.5rem 1rem',
          display: 'flex',
          gap: '0.75rem',
        }}
      >
        {!isFirst && (
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => i - 1)}
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              background: '#fff',
              color: '#1a1a1a',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Back
          </button>
        )}
        {!isLast && (
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => i + 1)}
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              background: '#1a1a1a',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
