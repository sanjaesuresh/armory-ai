'use client';

/**
 * BuilderView — client-side wizard shell for the community setup builder.
 *
 * Holds the full DraftInput state, renders the 4-step rail, and plugs in
 * the per-step editor. Only the Details editor (step 0) is built here;
 * steps 1–3 render a placeholder until later tasks complete them.
 *
 * Step editor contract (implemented by MetadataEditor; later steps must match):
 *   value:    DraftInput   — current draft state
 *   onChange: (patch: Partial<DraftInput>) => void — merge patch into state
 *   findings: MetadataFinding[] — inline validation messages keyed by field
 *
 * Persistence: debounced autosave (1.5 s after last change) via the browser
 * Supabase client. The client is created only inside handlers, never at
 * render time, so unit tests that render this component don't need env vars.
 */

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { SetupRow } from '@/lib/catalog/repository';
import type { Category, ExportTarget, Setup, Variable } from '@/lib/setup/types';
import {
  type DraftInput,
  buildDraftUpdate,
  createSupabaseDraftsStore,
} from '@/lib/community/drafts';
import { validateSetup } from '@/lib/setup/validator';
import { collectReferencedKeys, hasNestedIfBlock } from '@/lib/setup/tokens';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import MetadataEditor, { type MetadataFinding } from './MetadataEditor';
import TemplateEditor from './TemplateEditor';
import VariablesEditor from './VariablesEditor';
import KnowledgeEditor from './KnowledgeEditor';
import ScenariosEditor from './ScenariosEditor';
import BuilderPreview from './BuilderPreview';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rowToDraftInput(row: SetupRow): DraftInput {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    role: row.role,
    industry: row.industry,
    category: row.category,
    tags: row.tags,
    targets: row.targets,
    tier: row.tier as 'core' | 'advanced',
    instructionTemplate: row.instruction_template,
    variables: row.variables as unknown[],
    knowledgeFiles: row.knowledge_files as unknown[],
    scenarios: row.scenarios as unknown[],
  };
}

/** Paths that correspond to metadata fields (step 0). */
const METADATA_PATHS = new Set(['name', 'tagline', 'description', 'role', 'category', 'slug']);

/**
 * Runs a partial validation against the metadata fields only. The instruction
 * template is filled with a placeholder so the validator doesn't surface
 * template errors (those belong to step 2).
 */
function validateMetadata(input: DraftInput): MetadataFinding[] {
  const partial: Setup = {
    kind: 'setup',
    id: 'validate',
    slug: input.slug,
    name: input.name,
    tagline: input.tagline,
    description: input.description,
    role: input.role,
    industry: input.industry ?? null,
    tags: input.tags ?? [],
    // Cast required — we deliberately pass potentially-invalid values to
    // surface the error messages. The validator handles empty/invalid strings.
    category: input.category as Category,
    source: 'community',
    author: null,
    version: '0.1.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviewStatus: 'draft',
    upvotes: 0,
    featured: null,
    targets: (input.targets ?? ['claude-app']) as ExportTarget[],
    tier: input.tier ?? 'core',
    // Placeholder to pass the non-empty check (template errors belong to step 2)
    instructionTemplate: '(placeholder)',
    variables: [],
    knowledgeFiles: [],
    scenarios: [],
    // Registry-only fields — community builder only produces setups.
    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  };

  const result = validateSetup(partial);
  return result.errors
    .filter((e) => METADATA_PATHS.has(e.path))
    .map((e) => ({ field: e.path, message: e.message }));
}

/**
 * Validates the template and variables fields (step 1).
 * Uses the shared token utilities so findings match what validateSetup
 * enforces on the server. Returns only errors (warnings don't block Continue).
 */
function validateTemplate(input: DraftInput): MetadataFinding[] {
  const template = input.instructionTemplate ?? '';
  const variables = (input.variables ?? []) as Variable[];
  const errors: MetadataFinding[] = [];

  if (!template.trim()) {
    errors.push({
      field: 'instructionTemplate',
      message: 'The instruction template cannot be empty.',
    });
    return errors;
  }

  if (hasNestedIfBlock(template)) {
    errors.push({
      field: 'instructionTemplate',
      message:
        'The template contains a {{#if}} block nested inside another. Nested conditionals are not supported.',
    });
  }

  const referencedKeys = collectReferencedKeys(template);
  const declaredKeys = new Set(variables.map((v) => v.key).filter(Boolean));

  for (const key of referencedKeys) {
    if (!declaredKeys.has(key)) {
      errors.push({
        field: 'instructionTemplate',
        message: `Template references "{{${key}}}" but no variable named "${key}" is declared.`,
      });
    }
  }

  // select / multiselect variables must have non-empty options
  for (const v of variables) {
    if (
      (v.type === 'select' || v.type === 'multiselect') &&
      (!v.options || v.options.length === 0)
    ) {
      errors.push({
        field: `variables.${v.key}.options`,
        message: `Variable "${v.key}" has type "${v.type}" but declares no options.`,
      });
    }
  }

  return errors;
}

// ─── Steps ────────────────────────────────────────────────────────────────────

const BUILDER_STEPS = [
  { id: 'details', label: 'Details' },
  { id: 'template', label: 'Template & variables' },
  { id: 'knowledge', label: 'Knowledge & scenarios' },
  { id: 'submit', label: 'Preview & submit' },
];

// ─── Save state ───────────────────────────────────────────────────────────────

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  draft: SetupRow;
}

export default function BuilderView({ draft }: Props) {
  const router = useRouter();
  const [input, setInput] = useState<DraftInput>(() => rowToDraftInput(draft));
  const [currentStep, setCurrentStep] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [findings, setFindings] = useState<MetadataFinding[]>([]);
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [submitErrors, setSubmitErrors] = useState<Array<{ message: string; path?: string }>>([]);

  // Refs for debounced autosave — kept outside state to avoid re-renders
  const inputRef = useRef<DraftInput>(input);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  // Set to true if the most recent executeSave call threw; checked by handleSubmit
  // to abort the POST when the pre-submit flush save failed.
  const saveFailedRef = useRef(false);

  // Keep inputRef in sync so the debounce closure always reads the latest value.
  // Synchronous write to a ref is allowed in the render body per React docs.
  inputRef.current = input;

  // ── Persistence ─────────────────────────────────────────────────────────────

  const executeSave = useCallback(
    async (currentInput: DraftInput) => {
      setSaveState('saving');
      // Reset before the attempt so handleSubmit reads an accurate result after
      // awaiting this call.
      saveFailedRef.current = false;
      try {
        // Client is created only here — never at module or render time.
        const client = createSupabaseBrowserClient();
        const store = createSupabaseDraftsStore(client);
        await store.updateDraftFields(
          draft.id,
          buildDraftUpdate(currentInput, new Date().toISOString()),
        );
        setSaveState('saved');
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        savedTimerRef.current = setTimeout(() => setSaveState('idle'), 2000);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (/duplicate key|already exists|unique constraint/i.test(msg)) {
          setFindings([{ field: 'slug', message: 'That slug is already taken, choose another.' }]);
        }
        setSaveState('error');
        // Signal to handleSubmit that this save failed so the POST is aborted.
        saveFailedRef.current = true;
      }
    },
    [draft.id],
  );

  function scheduleSave() {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      void executeSave(inputRef.current);
    }, 1500);
  }

  // ── Change handler ───────────────────────────────────────────────────────────

  function handleChange(patch: Partial<DraftInput>) {
    setInput((prev) => ({ ...prev, ...patch }));
    scheduleSave();
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  function goToStep(index: number) {
    const clamped = Math.max(0, Math.min(BUILDER_STEPS.length - 1, index));
    setCurrentStep(clamped);
    setFindings([]);
    requestAnimationFrame(() => stepHeadingRef.current?.focus());
  }

  function handleContinue() {
    if (currentStep === 0) {
      const errors = validateMetadata(inputRef.current);
      if (errors.length > 0) {
        setFindings(errors);
        return;
      }
      setFindings([]);
    }
    if (currentStep === 1) {
      const errors = validateTemplate(inputRef.current);
      if (errors.length > 0) {
        setFindings(errors);
        return;
      }
      setFindings([]);
    }
    // Fire save before advancing (non-blocking)
    void executeSave(inputRef.current);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    goToStep(currentStep + 1);
  }

  // ── Submit ───────────────────────────────────────────────────────────────────

  function handleSubmit() {
    // Cancel any pending debounced save and flush synchronously first so the
    // server sees the latest draft content.
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSubmitState('submitting');
    setSubmitErrors([]);

    void (async () => {
      try {
        // Flush the latest input before posting.
        await executeSave(inputRef.current);

        // Abort if the flush save failed — the server would see stale data.
        if (saveFailedRef.current) {
          setSubmitState('error');
          setSubmitErrors([{
            message: "Your changes couldn't be saved, check your connection and try again.",
          }]);
          return;
        }

        const res = await fetch('/api/community/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ setupId: draft.id }),
        });

        const data: unknown = await res.json();
        const json = data as {
          ok: boolean;
          errors?: Array<{ message: string; path?: string }>;
          error?: string;
        };

        if (json.ok) {
          router.push('/my/submissions?submitted=1');
        } else {
          setSubmitState('error');
          setSubmitErrors(
            json.errors ?? [{ message: json.error ?? 'Submit failed. Please try again.' }],
          );
        }
      } catch {
        setSubmitState('error');
        setSubmitErrors([{ message: 'Could not connect. Check your connection and try again.' }]);
      }
    })();
  }

  // ── Derived ─────────────────────────────────────────────────────────────────

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === BUILDER_STEPS.length - 1;
  const step = BUILDER_STEPS[currentStep];

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <Link href="/account" className="back-link" data-testid="builder-back-link">
        <svg
          width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          strokeLinejoin="round" aria-hidden="true"
        >
          <path d="M19.5 12h-15M10 6.5 4.5 12 10 17.5" />
        </svg>
        My account
      </Link>

      <h1 style={{ fontSize: 'clamp(1.7rem,3.2vw,2.2rem)', marginBottom: 4 }}>
        Build a setup to share
      </h1>
      <p className="muted" style={{ marginBottom: 0, maxWidth: '44em' }}>
        Author a setup other people can pick up and customize. Every submission is
        reviewed by the Armory team before it goes live, we check each one for
        safety, not polish.
      </p>

      {/* 3-column wizard layout */}
      <div className="cust-layout">

        {/* Left: step rail */}
        <nav className="steps-rail" aria-label="Builder steps">
          {BUILDER_STEPS.map((s, i) => {
            const isDone = i < currentStep;
            const isCurrent = i === currentStep;
            return (
              <button
                key={s.id}
                type="button"
                className={`rail-step${isDone ? ' done' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
                onClick={() => goToStep(i)}
              >
                <span className="n" aria-hidden="true">
                  {isDone ? (
                    <svg
                      width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                {s.label}
                {isDone && <span className="sr-only"> (completed)</span>}
              </button>
            );
          })}
        </nav>

        {/* Center: form card */}
        <form
          className="form-card"
          onSubmit={(e) => e.preventDefault()}
          noValidate
          aria-label={`Builder step: ${step.label}`}
        >
          <h2
            ref={stepHeadingRef}
            tabIndex={-1}
            style={{ outline: 'none' }}
          >
            {step.label}
          </h2>
          <p className="lede">
            {step.id === 'details' &&
              'Plain-language basics so people can find your setup and know what it’s for.'}
            {step.id === 'template' &&
              'The instruction template your setup generates, add variables for customization.'}
            {step.id === 'knowledge' &&
              'Reference files and test scenarios that ship with your setup.'}
            {step.id === 'submit' &&
              'Review your setup and submit it for the Armory team to check.'}
          </p>

          {/* Step 0: Details (MetadataEditor) */}
          {step.id === 'details' && (
            <MetadataEditor
              value={input}
              onChange={handleChange}
              findings={findings}
            />
          )}

          {/* Step 1: Template & variables */}
          {step.id === 'template' && (
            <>
              <TemplateEditor
                value={input}
                onChange={handleChange}
                findings={findings}
              />
              <VariablesEditor
                value={input}
                onChange={handleChange}
                findings={findings}
              />
            </>
          )}

          {/* Step 2: Knowledge & scenarios */}
          {step.id === 'knowledge' && (
            <>
              <KnowledgeEditor
                value={input}
                onChange={handleChange}
                findings={findings}
              />
              <div style={{ marginTop: 28 }}>
                <ScenariosEditor
                  value={input}
                  onChange={handleChange}
                  findings={findings}
                />
              </div>
            </>
          )}

          {/* Step 3: Preview & submit */}
          {step.id === 'submit' && (
            <>
              <BuilderPreview
                value={input}
                onChange={handleChange}
                findings={findings}
                onSubmit={handleSubmit}
                isSubmitting={submitState === 'submitting'}
              />
              {submitState === 'error' && submitErrors.length > 0 && (
                <div
                  style={{
                    background: 'var(--bad-tint)',
                    border: '1px solid rgba(179,64,47,0.2)',
                    borderRadius: 'var(--r-md)',
                    padding: '16px 20px',
                    marginTop: 16,
                  }}
                  role="alert"
                  data-testid="builder-submit-error"
                >
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--bad)', margin: '0 0 8px' }}>
                    Your setup could not be submitted
                  </p>
                  <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'grid', gap: 4 }}>
                    {submitErrors.map((e, i) => (
                      <li key={i} style={{ fontSize: '0.85rem', color: 'var(--bad)' }}>
                        {e.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Form nav */}
          <div className="form-nav">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => goToStep(currentStep - 1)}
              style={{ visibility: isFirstStep ? 'hidden' : 'visible' }}
              aria-hidden={isFirstStep}
            >
              Back
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Save-state indicator */}
              {saveState === 'saving' && (
                <span className="save-indicator save-indicator--saving" aria-live="polite">
                  Saving…
                </span>
              )}
              {saveState === 'saved' && (
                <span className="save-indicator save-indicator--saved" aria-live="polite">
                  <svg
                    width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                  Saved
                </span>
              )}
              {saveState === 'error' && (
                <span className="save-indicator save-indicator--error" role="alert">
                  Could not save, check your connection
                </span>
              )}

              {!isLastStep && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleContinue}
                  data-testid="builder-continue"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Right: live preview */}
        <aside className="live-panel" aria-label="Live preview">
          <div className="live-card">
            <h3>
              <svg
                width="17" height="17" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: 'var(--iris)' }}
                aria-hidden="true"
              >
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>{' '}
              How it&apos;ll look in the catalog
            </h3>

            <div
              className="lib-row"
              style={{ margin: 0, border: '1px solid var(--hairline)' }}
              aria-label="Catalog card preview"
            >
              <span
                className="icon-badge"
                style={{ background: 'var(--mint)', flexShrink: 0 }}
                aria-hidden="true"
              >
                <svg
                  width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.75"
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
              </span>
              <div className="lib-body">
                <strong>
                  {input.name || (
                    <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
                      Setup name
                    </span>
                  )}
                </strong>
                <span>
                  {input.tagline || (
                    <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
                      Your one-line description
                    </span>
                  )}
                </span>
              </div>
              <span className="badge badge-community">Member post</span>
            </div>
          </div>

          <div className="live-card">
            <h3>Before it goes live</h3>
            <ul className="understand-list">
              <li>Structural check, required fields, valid template</li>
              <li>Automated safety screen, no hidden or hostile instructions</li>
              <li className="pending">Human review by the Armory team</li>
            </ul>
            <p className="small muted" style={{ margin: '10px 0 0' }}>
              Nothing you submit is published automatically.
            </p>
          </div>
        </aside>

      </div>
    </>
  );
}
