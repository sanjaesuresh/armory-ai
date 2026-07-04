'use client';

/**
 * BuilderPreview — step 4 of the community builder wizard (Preview & submit).
 *
 * The author supplies sample answers for their declared variables and sees
 * EXACTLY the three-layer preview a real user will see, driven by the SAME
 * PreviewPanel + compileSetup the customization flow uses. This guarantees the
 * author's preview is not a separate implementation.
 *
 * Setup construction: builds a Setup object from DraftInput with server-owned
 * fields filled with stable placeholders (id='preview', source='community',
 * reviewStatus='draft', etc.). The compiler only cares about the content fields;
 * placeholder values let preview-time validateSetup surface real content issues.
 *
 * Validation summary: runs validateSetup on the built Setup and lists all
 * remaining errors so the author knows what to fix before submission.
 *
 * Submit button: always present; disabled and describes why when errors exist.
 * Calls onSubmit prop when clicked (no-op until the next task wires it up).
 *
 * Contract (matches MetadataEditor):
 *   value    — the full DraftInput
 *   onChange — accepted per the editor contract (not used internally; preview
 *              derives everything from value)
 *   findings — accepted per the editor contract
 *   onSubmit — called when the enabled submit button is clicked
 */

import { useState } from 'react';
import type { DraftInput } from '@/lib/community/drafts';
import type {
  Setup,
  Answers,
  Variable,
  KnowledgeFile,
  Scenario,
  Category,
  ExportTarget,
} from '@/lib/setup/types';
import { validateSetup } from '@/lib/setup/validator';
import PreviewPanel from '@/components/PreviewPanel';
import type { MetadataFinding } from './MetadataEditor';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BuilderPreviewProps {
  value: DraftInput;
  onChange: (patch: Partial<DraftInput>) => void;
  findings?: MetadataFinding[];
  onSubmit?: () => void;
  /** True while the submit POST is in flight — disables the button and shows a busy label. */
  isSubmitting?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Builds a full Setup from a DraftInput, filling server-owned fields with
 *  stable placeholders. The compiler only reads the content fields; these
 *  placeholders let validateSetup surface real content issues at preview time. */
function buildPreviewSetup(input: DraftInput): Setup {
  return {
    id: 'preview',
    slug: input.slug || 'preview',
    name: input.name,
    tagline: input.tagline,
    description: input.description,
    role: input.role,
    industry: input.industry ?? null,
    tags: input.tags ?? [],
    category: (input.category || 'general') as Category,
    source: 'community',
    author: null,
    version: '0.1.0',
    // Stable placeholder dates so re-renders don't change the Setup reference.
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    reviewStatus: 'draft',
    upvotes: 0,
    featured: null,
    targets: (input.targets ?? ['claude-app']) as ExportTarget[],
    tier: input.tier ?? 'core',
    instructionTemplate: input.instructionTemplate,
    variables: (input.variables ?? []) as Variable[],
    knowledgeFiles: (input.knowledgeFiles ?? []) as KnowledgeFile[],
    scenarios: (input.scenarios ?? []) as Scenario[],
  };
}

/** Initialize sample answers from variable defaults. */
function initSampleAnswers(variables: Variable[]): Answers {
  const answers: Answers = {};
  for (const v of variables) {
    if (v.default !== undefined) {
      answers[v.key] = v.default;
    }
  }
  return answers;
}

// ─── Sample answer field ──────────────────────────────────────────────────────

interface SampleFieldProps {
  variable: Variable;
  value: string | number | boolean | string[] | undefined;
  onChange: (val: string | number | boolean | string[]) => void;
}

function SampleAnswerField({ variable, value, onChange }: SampleFieldProps) {
  const id = `sample-${variable.key}`;
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontWeight: 600,
    fontSize: '0.88rem',
    marginBottom: 4,
    color: 'var(--ink)',
  };

  switch (variable.type) {
    case 'text':
      return (
        <div className="field" style={{ marginBottom: 14 }}>
          <label htmlFor={id} style={labelStyle}>{variable.label}</label>
          {variable.helpText && <p className="help">{variable.helpText}</p>}
          <input
            className="input"
            id={id}
            type="text"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Sample ${variable.label}`}
            data-testid={`sample-${variable.key}`}
          />
        </div>
      );

    case 'multiline':
      return (
        <div className="field" style={{ marginBottom: 14 }}>
          <label htmlFor={id} style={labelStyle}>{variable.label}</label>
          {variable.helpText && <p className="help">{variable.helpText}</p>}
          <textarea
            className="input"
            id={id}
            rows={3}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Sample ${variable.label}`}
            data-testid={`sample-${variable.key}`}
          />
        </div>
      );

    case 'number':
      return (
        <div className="field" style={{ marginBottom: 14 }}>
          <label htmlFor={id} style={labelStyle}>{variable.label}</label>
          {variable.helpText && <p className="help">{variable.helpText}</p>}
          <input
            className="input"
            id={id}
            type="number"
            value={typeof value === 'number' ? value : ''}
            onChange={(e) =>
              onChange(e.target.value === '' ? '' : Number(e.target.value))
            }
            placeholder="0"
            data-testid={`sample-${variable.key}`}
          />
        </div>
      );

    case 'boolean':
      return (
        <div className="field" style={{ marginBottom: 14 }}>
          <label
            className="check"
            style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}
          >
            <input
              type="checkbox"
              id={id}
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              style={{ position: 'static', opacity: 1, width: 'auto', height: 'auto' }}
              data-testid={`sample-${variable.key}`}
            />
            <span
              style={{ fontWeight: 600, fontSize: '0.88rem', background: 'none', border: 'none', padding: 0 }}
            >
              {variable.label}
            </span>
          </label>
          {variable.helpText && <p className="help" style={{ marginTop: 4 }}>{variable.helpText}</p>}
        </div>
      );

    case 'select': {
      const options = variable.options ?? [];
      return (
        <div className="field" style={{ marginBottom: 14 }}>
          <label htmlFor={id} style={labelStyle}>{variable.label}</label>
          {variable.helpText && <p className="help">{variable.helpText}</p>}
          <select
            className="select-el"
            id={id}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            data-testid={`sample-${variable.key}`}
          >
            <option value="">Select…</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );
    }

    case 'multiselect': {
      const options = variable.options ?? [];
      const selected = Array.isArray(value) ? value as string[] : [];
      return (
        <div className="field" style={{ marginBottom: 14 }}>
          <span style={labelStyle}>{variable.label}</span>
          {variable.helpText && <p className="help">{variable.helpText}</p>}
          <div className="checks" role="group" aria-label={variable.label}>
            {options.map((opt) => (
              <label key={opt} className="check">
                <input
                  type="checkbox"
                  value={opt}
                  checked={selected.includes(opt)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...selected, opt]
                      : selected.filter((s) => s !== opt);
                    onChange(next);
                  }}
                  data-testid={`sample-${variable.key}-${opt}`}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BuilderPreview({
  value,
  onSubmit,
  isSubmitting = false,
}: BuilderPreviewProps) {
  const variables = (value.variables ?? []) as Variable[];

  // Sample answers — initialized from variable defaults; updated by the small form.
  const [sampleAnswers, setSampleAnswers] = useState<Answers>(() =>
    initSampleAnswers(variables),
  );

  // Build the full Setup object for preview and validation.
  const setup = buildPreviewSetup(value);

  // Run full validation so the author sees exactly what's blocking submission.
  const validation = validateSetup(setup);
  const hasErrors = !validation.valid;

  function handleSampleAnswerChange(key: string, val: string | number | boolean | string[]) {
    setSampleAnswers((prev) => ({ ...prev, [key]: val }));
  }

  return (
    <div data-testid="builder-preview">

      {/* Sample answers form */}
      {variables.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <span style={{ display: 'block', fontWeight: 700, fontSize: '0.94rem', marginBottom: 6 }}>
            Try it with sample answers
          </span>
          <p className="help">
            Fill in sample values to see what the compiled setup will look like
            for a real user. These answers are not saved.
          </p>
          {variables.map((v) => (
            <SampleAnswerField
              key={v.key}
              variable={v}
              value={sampleAnswers[v.key]}
              onChange={(val) => handleSampleAnswerChange(v.key, val)}
            />
          ))}
        </div>
      )}

      {/* Live preview — the SAME PreviewPanel the customization flow uses */}
      <PreviewPanel setup={setup} answers={sampleAnswers} />

      {/* Validation summary */}
      {hasErrors && (
        <div
          style={{
            background: 'var(--bad-tint)',
            border: '1px solid rgba(179,64,47,0.2)',
            borderRadius: 'var(--r-md)',
            padding: '16px 20px',
            marginTop: 24,
          }}
          aria-label="Validation issues"
          data-testid="builder-validation-summary"
        >
          <p
            style={{
              fontWeight: 700,
              fontSize: '0.9rem',
              color: 'var(--bad)',
              margin: '0 0 10px',
            }}
          >
            {validation.errors.length}{' '}
            {validation.errors.length === 1 ? 'issue' : 'issues'} to fix before submitting
          </p>
          <ul
            style={{
              margin: 0,
              padding: '0 0 0 18px',
              display: 'grid',
              gap: 6,
            }}
          >
            {validation.errors.map((err, i) => (
              <li key={i} style={{ fontSize: '0.85rem', color: 'var(--bad)' }}>
                {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit button */}
      <div style={{ marginTop: 24 }}>
        <button
          type="button"
          className="btn btn-primary"
          data-testid="builder-submit"
          disabled={hasErrors || isSubmitting}
          aria-disabled={hasErrors || isSubmitting}
          onClick={hasErrors || isSubmitting ? undefined : onSubmit}
        >
          {isSubmitting ? 'Submitting…' : 'Submit for review'}
        </button>
        {hasErrors && !isSubmitting && (
          <p className="help" style={{ marginTop: 8, color: 'var(--muted)' }}>
            Fix the issues listed above before submitting.
          </p>
        )}
      </div>

    </div>
  );
}
