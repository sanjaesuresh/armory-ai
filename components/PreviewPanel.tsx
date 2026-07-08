'use client';

import { useState, useRef } from 'react';
import type { Setup, Answers } from '@/lib/setup/types';
import { compileSetup } from '@/lib/setup/compiler';
import { isAnswerEmpty } from '@/lib/setup/answers';

// ─── Types ───────────────────────────────────────────────────────────────────

interface UnderstandItem {
  ok: boolean;
  text: string;
}

interface Props {
  setup: Setup;
  answers: Answers;
  /** When true, show the flag-gated "Test-drive with your answers" button. */
  testDriveEnabled?: boolean;
  /** Called with the first scenario's id when the test-drive button is clicked. */
  onTestDrive?: (scenarioId: string) => void;
}

function computeUnderstandItems(setup: Setup, answers: Answers): UnderstandItem[] {
  return setup.variables.map((v) => {
    const val = answers[v.key];
    if (isAnswerEmpty(val)) {
      return { ok: false, text: v.label };
    }
    if (typeof val === 'boolean') {
      return { ok: val, text: `${v.label}: ${val ? 'Yes' : 'No'}` };
    }
    const formatted = Array.isArray(val)
      ? (val as string[]).join(', ')
      : String(val);
    return { ok: true, text: `${v.label}: ${formatted}` };
  });
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PreviewPanel({ setup, answers, testDriveEnabled = false, onTestDrive }: Props) {
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const prevCompiledNull = useRef<boolean | null>(null);

  let compiled;
  try {
    compiled = compileSetup(setup, answers);
  } catch {
    compiled = null;
  }

  const compiledNull = compiled === null;

  // Collapse disclosure when compile recovers from failure
  if (prevCompiledNull.current === true && !compiledNull && instructionsOpen) {
    setInstructionsOpen(false);
  }
  prevCompiledNull.current = compiledNull;

  const understandItems = computeUnderstandItems(setup, answers);
  const firstScenario = setup.scenarios[0] ?? null;

  // Incomplete state: guide without surfacing error text
  if (!compiled) {
    return (
      <aside className="live-panel live-doodle" aria-label="Live preview">
        <span className="doodle-note" aria-hidden="true">
          updates as you type
          <svg width="40" height="34" viewBox="0 0 46 42" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 4c10 8 20 20 30 32" />
            <path d="M36 36l-1.5-9M36 36l-9-1" />
          </svg>
        </span>
        <div className="live-card">
          <h3>
            <svg width="17" height="17" style={{ color: 'var(--iris)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
            What Armory understands so far
          </h3>
          <ul className="understand-list" aria-live="polite">
            {understandItems.map((item, i) => (
              <li key={i} className={item.ok ? '' : 'pending'}>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
        <div className="live-card">
          <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--ink-soft)' }}>
            Fill in the required fields to see your preview.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="live-panel live-doodle" aria-label="Live preview">
      <span className="doodle-note" aria-hidden="true">
        updates as you type
        <svg width="40" height="34" viewBox="0 0 46 42" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 4c10 8 20 20 30 32" />
          <path d="M36 36l-1.5-9M36 36l-9-1" />
        </svg>
      </span>

      {/* Card 1: understand-list */}
      <div className="live-card">
        <h3>
          <svg width="17" height="17" style={{ color: 'var(--iris)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
          What Armory understands so far
        </h3>
        <ul className="understand-list" aria-live="polite">
          {understandItems.map((item, i) => (
            <li key={i} className={item.ok ? '' : 'pending'}>
              {item.text}
            </li>
          ))}
        </ul>
      </div>

      {/* Card 2: static Q&A from first scenario */}
      {firstScenario && (
        <div className="live-card">
          <h3>Try it in your head</h3>
          <div className="qa">
            <span className="q-label">If you ask</span>
            <p className="q-bubble" style={{ marginTop: 0 }}>
              {firstScenario.userInput}
            </p>
            <span className="q-label">{"You'd get"}</span>
            <p className="a-bubble" style={{ margin: 0 }}>
              {firstScenario.expectedBehavior}
            </p>
          </div>
          {testDriveEnabled && onTestDrive && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              data-testid="test-drive-preview-btn"
              onClick={() => onTestDrive(firstScenario.id)}
              style={{ marginTop: '14px' }}
            >
              Test-drive with your answers
            </button>
          )}
        </div>
      )}

      {/* Card 3: full instructions behind a toggle */}
      <div className="live-card">
        <div className="raw-toggle">
          <button
            type="button"
            aria-expanded={instructionsOpen}
            onClick={() => setInstructionsOpen((open) => !open)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.86rem',
              color: 'var(--iris-deep)',
              fontFamily: 'inherit',
            }}
          >
            View the full instructions
          </button>
          {instructionsOpen && (
            <pre className="code" style={{ border: '1px solid var(--hairline)', borderRadius: '10px' }}>
              {compiled.instruction}
            </pre>
          )}
        </div>
        <p className="small" style={{ color: 'var(--ink-soft)', margin: '10px 0 0' }}>
          This is the exact text you&apos;ll paste into Claude, nothing hidden.
        </p>
      </div>
    </aside>
  );
}
