'use client';

/**
 * TemplateEditor — step 2a of the community builder wizard.
 *
 * Renders the instruction-template textarea with LIVE validation findings
 * driven by the shared token utilities (collectReferencedKeys,
 * hasNestedIfBlock). The live findings here agree with what validateSetup
 * enforces on the server because they use the same utilities.
 *
 * Findings computed:
 *   - Nested {{#if}} block → error
 *   - {{key}} with no matching declared variable → error (per key)
 *   - Declared variable never referenced in template → warning (per key)
 *
 * Contract (matches MetadataEditor):
 *   value    — the full DraftInput
 *   onChange — called with a partial patch; BuilderView merges it into state
 *   findings — inline validation messages keyed by field name; the
 *               instructionTemplate finding (e.g. "cannot be empty") is
 *               rendered as a role="alert" under the textarea, matching the
 *               MetadataEditor fieldError pattern. Live findings from
 *               computeLiveFindings are rendered in addition.
 */

import type { DraftInput } from '@/lib/community/drafts';
import type { Variable } from '@/lib/setup/types';
import type { MetadataFinding } from './MetadataEditor';
import { collectReferencedKeys, hasNestedIfBlock } from '@/lib/setup/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TemplateEditorProps {
  value: DraftInput;
  onChange: (patch: Partial<DraftInput>) => void;
  findings?: MetadataFinding[];
}

type LiveFinding = { kind: 'error' | 'warning'; message: string; key?: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Computes live findings for the template textarea.
 * Only called when template is non-empty — an empty template is handled
 * by the required-field marker; no false alarms on a blank draft.
 */
function computeLiveFindings(template: string, variables: Variable[]): LiveFinding[] {
  if (!template.trim()) return [];

  const results: LiveFinding[] = [];

  if (hasNestedIfBlock(template)) {
    results.push({
      kind: 'error',
      message:
        'The template contains a {{#if}} block nested inside another. Nested conditionals are not supported.',
    });
  }

  const referencedKeys = collectReferencedKeys(template);
  const declaredKeys = new Set(variables.map((v) => v.key).filter(Boolean));

  for (const key of referencedKeys) {
    if (!declaredKeys.has(key)) {
      results.push({
        kind: 'error',
        message: `Template references "{{${key}}}" but no variable named "${key}" is declared below.`,
      });
    }
  }

  const referencedSet = new Set(referencedKeys);
  for (const key of declaredKeys) {
    if (!referencedSet.has(key)) {
      results.push({
        kind: 'warning',
        key,
        message: `Variable "${key}" is declared but never used in the template.`,
      });
    }
  }

  return results;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fieldError(findings: MetadataFinding[] | undefined, field: string): string | undefined {
  return findings?.find((f) => f.field === field)?.message;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TemplateEditor({ value, onChange, findings }: TemplateEditorProps) {
  const template = value.instructionTemplate ?? '';
  const variables = (value.variables ?? []) as Variable[];

  const liveFindings = computeLiveFindings(template, variables);
  const errors = liveFindings.filter((f) => f.kind === 'error');
  const warnings = liveFindings.filter((f) => f.kind === 'warning');
  const templateErr = fieldError(findings, 'instructionTemplate');
  const hasError = errors.length > 0 || !!templateErr;

  return (
    <div data-testid="template-editor">

      {/* Template textarea */}
      <div className={`field${hasError ? ' invalid' : ''}`}>
        <label htmlFor="bTemplate">
          Instruction template <span className="req" aria-hidden="true">*</span>
        </label>
        <p className="help">
          Write the system-prompt instructions for this setup. Use the placeholders below
          to insert each user&apos;s answers into the final instruction.
        </p>
        <textarea
          className="input"
          id="bTemplate"
          rows={14}
          value={template}
          onChange={(e) => onChange({ instructionTemplate: e.target.value })}
          data-testid="field-template"
          spellCheck={false}
          aria-describedby={hasError ? 'bTemplate-errs' : undefined}
          style={{ fontFamily: 'var(--mono)', fontSize: '0.86rem', resize: 'vertical' }}
        />

        {/* Errors — findings-based (e.g. empty template) and live errors */}
        {(templateErr || errors.length > 0) && (
          <div id="bTemplate-errs">
            {templateErr && (
              <p className="error-msg" role="alert">
                {templateErr}
              </p>
            )}
            {errors.map((e, i) => (
              <p key={i} className="error-msg" role="alert">
                {e.message}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Live warnings */}
      {warnings.length > 0 && (
        <div aria-live="polite">
          {warnings.map((w, i) => (
            <div key={i} className="inline-warning" data-testid={`template-warning-${w.key ?? i}`}>
              {w.message}
            </div>
          ))}
        </div>
      )}

      {/* Placeholder syntax reference */}
      <div
        style={{
          background: 'var(--oat)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)',
          padding: '16px 20px',
          marginBottom: 8,
        }}
      >
        <p style={{ fontWeight: 700, fontSize: '0.88rem', margin: '0 0 12px' }}>
          Placeholder syntax
        </p>
        <dl style={{ margin: 0, display: 'grid', gap: 12 }}>
          <div>
            <dt
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--ink)',
              }}
            >
              {'{{key}}'}
            </dt>
            <dd style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: '2px 0 0' }}>
              Inserts the user&apos;s answer for that variable inline. Example:{' '}
              <code style={{ fontFamily: 'var(--mono)' }}>{'You work at {{company_name}}.'}</code>
            </dd>
          </div>
          <div>
            <dt
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--ink)',
              }}
            >
              {'{{#if key}}…{{/if}}'}
            </dt>
            <dd style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: '2px 0 0' }}>
              Includes that section only when the variable has a value. Nesting is not supported.
            </dd>
          </div>
          <div>
            <dt
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--ink)',
              }}
            >
              {'{{tone}}'}  (select or multiselect variable key)
            </dt>
            <dd style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: '2px 0 0' }}>
              Use any select or multiselect variable&apos;s key, it expands as a
              comma-separated list of the user&apos;s chosen values. The key name is up
              to you; there is no special reserved keyword.
            </dd>
          </div>
        </dl>
      </div>

    </div>
  );
}
