'use client';

/**
 * ScenariosEditor — step 3b of the community builder wizard.
 *
 * Edits the scenarios array of a DraftInput. Each Scenario has:
 *   id, title, userInput, expectedBehavior (all required to count as complete)
 *   mustContain, mustNotContain (optional phrase lists)
 *
 * An inline hint is shown when a scenario is missing title, userInput, or
 * expectedBehavior so the author knows it won't count as a complete scenario.
 *
 * Contract (matches MetadataEditor):
 *   value    — the full DraftInput
 *   onChange — called with a partial patch; BuilderView merges it into state
 *   findings — accepted per the editor contract; not used directly here
 *             (inline validation is computed from value)
 */

import { useRef } from 'react';
import type { DraftInput } from '@/lib/community/drafts';
import type { Scenario } from '@/lib/setup/types';
import type { MetadataFinding } from './MetadataEditor';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScenariosEditorProps {
  value: DraftInput;
  onChange: (patch: Partial<DraftInput>) => void;
  findings?: MetadataFinding[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** A scenario is complete when all three required prose fields are non-empty. */
function isScenarioComplete(scenario: Scenario): boolean {
  return (
    scenario.title.trim().length > 0 &&
    scenario.userInput.trim().length > 0 &&
    scenario.expectedBehavior.trim().length > 0
  );
}

function parseLines(raw: string): string[] {
  return raw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScenariosEditor({ value, onChange }: ScenariosEditorProps) {
  const scenarios = (value.scenarios ?? []) as Scenario[];
  const idCounterRef = useRef(0);

  function patch(updated: Scenario[]) {
    onChange({ scenarios: updated });
  }

  function handleAdd() {
    const id = `s${++idCounterRef.current}-${Date.now()}`;
    patch([
      ...scenarios,
      { id, title: '', userInput: '', expectedBehavior: '' },
    ]);
  }

  function handleDelete(index: number) {
    patch(scenarios.filter((_, i) => i !== index));
  }

  function updateAt(index: number, update: Partial<Scenario>) {
    patch(scenarios.map((s, i) => (i === index ? { ...s, ...update } : s)));
  }

  function handleMustContainChange(index: number, raw: string) {
    updateAt(index, { mustContain: parseLines(raw) });
  }

  function handleMustNotContainChange(index: number, raw: string) {
    updateAt(index, { mustNotContain: parseLines(raw) });
  }

  const isEmpty = scenarios.length === 0;

  return (
    <div data-testid="scenarios-editor">

      {/* Section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <div>
          <span style={{ display: 'block', fontWeight: 700, fontSize: '0.94rem' }}>
            Test scenarios
          </span>
          <p className="help" style={{ margin: '4px 0 0' }}>
            Example tasks that show what the setup can do. The first scenario
            also appears in the live preview so users know what to expect.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={handleAdd}
          style={{ flexShrink: 0, marginLeft: 16 }}
        >
          + Add scenario
        </button>
      </div>

      {/* Empty state */}
      {isEmpty && (
        <p
          style={{
            color: 'var(--muted)',
            fontSize: '0.88rem',
            padding: '16px 0',
            borderTop: '1px solid var(--hairline)',
          }}
        >
          No scenarios yet. Add one to give users a concrete sense of what
          the setup handles.
        </p>
      )}

      {/* Scenario cards */}
      {scenarios.map((scenario, index) => {
        const complete = isScenarioComplete(scenario);
        const titleId    = `bSc${index}Title`;
        const inputId    = `bSc${index}Input`;
        const behaviorId = `bSc${index}Behavior`;
        const mustId     = `bSc${index}Must`;
        const mustNotId  = `bSc${index}MustNot`;

        return (
          <div
            key={scenario.id}
            data-testid={`scenario-item-${index}`}
            style={{
              border: '1px solid var(--hairline)',
              borderRadius: 'var(--r-md)',
              padding: '20px',
              marginBottom: 14,
              background: 'var(--paper)',
            }}
          >
            {/* Card header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  color: 'var(--muted)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Scenario {index + 1}
                {complete && (
                  <span
                    style={{ color: 'var(--good)', marginLeft: 8, letterSpacing: 0 }}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                )}
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                aria-label={`Remove scenario ${index + 1}`}
                onClick={() => handleDelete(index)}
                style={{ padding: '4px 10px', fontSize: '0.82rem', color: 'var(--bad)' }}
              >
                Remove
              </button>
            </div>

            {/* Incomplete hint */}
            {!complete && (
              <p
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--muted)',
                  background: 'var(--oat)',
                  borderRadius: 'var(--r-sm)',
                  padding: '8px 12px',
                  margin: '0 0 14px',
                }}
                data-testid={`scenario-incomplete-${index}`}
              >
                Fill in the title, user message, and expected behavior to complete this scenario.
              </p>
            )}

            {/* Title */}
            <div className="field" style={{ marginBottom: 14 }}>
              <label
                htmlFor={titleId}
                style={{ display: 'block', fontWeight: 700, fontSize: '0.94rem', marginBottom: 6 }}
              >
                Title <span className="req" aria-hidden="true">*</span>
              </label>
              <p className="help">A short name for this scenario.</p>
              <input
                className="input"
                id={titleId}
                type="text"
                value={scenario.title}
                onChange={(e) => updateAt(index, { title: e.target.value })}
                placeholder="e.g. Write a launch post"
                data-testid={`scenario-title-${index}`}
              />
            </div>

            {/* User input */}
            <div className="field" style={{ marginBottom: 14 }}>
              <label
                htmlFor={inputId}
                style={{ display: 'block', fontWeight: 700, fontSize: '0.94rem', marginBottom: 6 }}
              >
                Message to send <span className="req" aria-hidden="true">*</span>
              </label>
              <p className="help">The exact message the user types to trigger this scenario.</p>
              <textarea
                className="input"
                id={inputId}
                rows={3}
                value={scenario.userInput}
                onChange={(e) => updateAt(index, { userInput: e.target.value })}
                placeholder={'e.g. "Write a launch post for our new feature, for Instagram and LinkedIn."'}
                data-testid={`scenario-input-${index}`}
              />
            </div>

            {/* Expected behavior */}
            <div className="field" style={{ marginBottom: 14 }}>
              <label
                htmlFor={behaviorId}
                style={{ display: 'block', fontWeight: 700, fontSize: '0.94rem', marginBottom: 6 }}
              >
                Expected behavior <span className="req" aria-hidden="true">*</span>
              </label>
              <p className="help">
                Prose description of what a good response looks like, shown in the preview.
              </p>
              <textarea
                className="input"
                id={behaviorId}
                rows={3}
                value={scenario.expectedBehavior}
                onChange={(e) => updateAt(index, { expectedBehavior: e.target.value })}
                placeholder="e.g. Two platform-ready drafts in the setup's tone, each with an A/B variant."
                data-testid={`scenario-behavior-${index}`}
              />
            </div>

            {/* Phrase checks (two-col) */}
            <div className="field two-col" style={{ marginBottom: 0 }}>
              <div>
                <label
                  htmlFor={mustId}
                  style={{ display: 'block', fontWeight: 700, fontSize: '0.94rem', marginBottom: 6 }}
                >
                  Must contain{' '}
                  <span className="muted" style={{ fontWeight: 600 }}>
                    (optional)
                  </span>
                </label>
                <p className="help">One phrase per line, phrases a good response will include.</p>
                <textarea
                  className="input"
                  id={mustId}
                  rows={3}
                  value={(scenario.mustContain ?? []).join('\n')}
                  onChange={(e) => handleMustContainChange(index, e.target.value)}
                  placeholder={'e.g.\nInstagram\nLinkedIn'}
                  data-testid={`scenario-must-${index}`}
                />
              </div>
              <div>
                <label
                  htmlFor={mustNotId}
                  style={{ display: 'block', fontWeight: 700, fontSize: '0.94rem', marginBottom: 6 }}
                >
                  Must not contain{' '}
                  <span className="muted" style={{ fontWeight: 600 }}>
                    (optional)
                  </span>
                </label>
                <p className="help">One phrase per line, phrases a good response won&apos;t include.</p>
                <textarea
                  className="input"
                  id={mustNotId}
                  rows={3}
                  value={(scenario.mustNotContain ?? []).join('\n')}
                  onChange={(e) => handleMustNotContainChange(index, e.target.value)}
                  placeholder={'e.g.\nclichés\nfiller phrases'}
                  data-testid={`scenario-mustnot-${index}`}
                />
              </div>
            </div>

          </div>
        );
      })}

      {/* Bottom add button (shown when list is non-empty) */}
      {!isEmpty && (
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={handleAdd}
          style={{ marginTop: 4 }}
        >
          + Add another scenario
        </button>
      )}

    </div>
  );
}
