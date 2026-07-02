'use client';

import { useState, useRef } from 'react';
import type { Setup, Answers } from '@/lib/setup/types';
import { compileSetup } from '@/lib/setup/compiler';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Props {
  setup: Setup;
  answers: Answers;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PreviewPanel({ setup, answers }: Props) {
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  // Track whether compiled was null on the previous render so we can detect
  // the failed→success transition and reset the disclosure without a flicker.
  const prevCompiledNull = useRef<boolean | null>(null);

  // Attempt to compile. A missing required answer throws — treat as incomplete.
  let compiled;
  try {
    compiled = compileSetup(setup, answers);
  } catch {
    compiled = null;
  }

  const compiledNull = compiled === null;

  // "Adjusting state during render" — React discards this render and immediately
  // re-runs with instructionsOpen = false, so the browser never paints the
  // briefly-expanded state.
  if (prevCompiledNull.current === true && !compiledNull && instructionsOpen) {
    setInstructionsOpen(false);
  }
  prevCompiledNull.current = compiledNull;

  // Incomplete state: guide the user without surfacing internal error text.
  if (!compiled) {
    return (
      <div
        style={{
          fontFamily: 'system-ui, sans-serif',
          color: '#555',
          padding: '1.25rem',
          background: '#f9f9f9',
          borderRadius: '8px',
          border: '1px solid #e5e5e5',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.95rem' }}>
          Fill in the required fields to see your preview.
        </p>
      </div>
    );
  }

  const firstScenario = setup.scenarios[0] ?? null;

  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      {/* Layer 1: Plain-English summary — primary layer */}
      <div
        style={{
          padding: '1rem 1.25rem',
          background: '#f0f4ff',
          borderRadius: '8px',
          border: '1px solid #d0daff',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '1rem',
            lineHeight: '1.6',
            color: '#1a1a2e',
            fontWeight: 500,
          }}
        >
          {compiled.summary}
        </p>
      </div>

      {/* Layer 2: Static example Q&A from the first scenario */}
      {firstScenario && (
        <div
          style={{
            padding: '1rem 1.25rem',
            background: '#fafafa',
            borderRadius: '8px',
            border: '1px solid #e5e5e5',
          }}
        >
          <p
            style={{
              margin: '0 0 0.75rem',
              fontSize: '0.75rem',
              color: '#888',
              fontStyle: 'italic',
            }}
          >
            Example using a sample brand — your setup will use your answers
          </p>

          <p
            style={{
              margin: '0 0 0.25rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#555',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            If you ask:
          </p>
          <p
            style={{
              margin: '0 0 1rem',
              fontSize: '0.9rem',
              color: '#333',
              lineHeight: '1.5',
            }}
          >
            {firstScenario.userInput}
          </p>

          <p
            style={{
              margin: '0 0 0.25rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#555',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {"You'd get:"}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '0.9rem',
              color: '#333',
              lineHeight: '1.5',
            }}
          >
            {firstScenario.expectedBehavior}
          </p>
        </div>
      )}

      {/* Layer 3: Full instructions behind a toggle — collapsed by default */}
      <div>
        <button
          type="button"
          aria-expanded={instructionsOpen}
          onClick={() => setInstructionsOpen((open) => !open)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontSize: '0.875rem',
            color: '#4a6cf7',
            textDecoration: 'underline',
            textUnderlineOffset: '2px',
            fontFamily: 'inherit',
          }}
        >
          View the full instructions
        </button>

        {instructionsOpen && (
          <pre
            style={{
              marginTop: '0.75rem',
              padding: '1rem',
              background: '#f5f5f5',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '0.8rem',
              lineHeight: '1.6',
              color: '#333',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowX: 'auto',
            }}
          >
            {compiled.instruction}
          </pre>
        )}
      </div>
    </div>
  );
}
