'use client';

/**
 * VariablesEditor — step 2b of the community builder wizard.
 *
 * Manages the variables array (value.variables). Each variable matches the
 * Variable shape from @/lib/setup/types so validateSetup / compileSetup
 * accept them without coercion.
 *
 * Features:
 *   - Add / edit / reorder (up/down) / delete variables
 *   - Key auto-suggested from label (slugified to a valid identifier);
 *     inline error shown for duplicate keys
 *   - Options textarea for select / multiselect; inline error when empty
 *   - All six types: text, multiline, select, multiselect, number, boolean
 *
 * Contract (matches MetadataEditor):
 *   value    — the full DraftInput
 *   onChange — called with a partial patch; BuilderView merges it into state
 *   findings — accepted per the editor contract; inline errors are computed
 *               from value directly
 */

import { useRef, useState, useEffect } from 'react';
import type { DraftInput } from '@/lib/community/drafts';
import type { Variable } from '@/lib/setup/types';
import type { MetadataFinding } from './MetadataEditor';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VariablesEditorProps {
  value: DraftInput;
  onChange: (patch: Partial<DraftInput>) => void;
  findings?: MetadataFinding[];
}

/** Valid identifier pattern — must match the PLAIN_RE in lib/setup/tokens.ts. */
const KEY_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

const VARIABLE_TYPES: { value: Variable['type']; label: string }[] = [
  { value: 'text', label: 'Short text' },
  { value: 'multiline', label: 'Long text' },
  { value: 'select', label: 'Choose one' },
  { value: 'multiselect', label: 'Choose many' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Yes / No' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts a human label into a valid identifier key.
 * Rules: lowercase, spaces/special → underscore, collapse runs,
 * strip leading/trailing underscores, prefix 'var_' if first char is a digit.
 */
function labelToKey(label: string): string {
  const s = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  if (!s) return '';
  if (/^[0-9]/.test(s)) return `var_${s}`;
  return s;
}

/** A blank variable used when adding a new item. */
function blankVariable(): Variable {
  return { key: '', label: '', type: 'text', required: false };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VariablesEditor({ value, onChange }: VariablesEditorProps) {
  const variables = (value.variables ?? []) as Variable[];
  // Track which items had their key field manually typed so we stop
  // overwriting it when the label changes. We use a ref (not state) so
  // updates don't trigger a re-render; the ref is synchronised before render.
  const keyEditedRef = useRef<Set<number>>(new Set());

  // ── Stable UIDs for card keys and focus management (Fix 2) ─────────────────
  // Each variable gets a monotonic uid so React can track card identity across
  // reorders. The uid array stays in a ref to avoid re-renders; it is never
  // written into the persisted variables payload.
  const uidCounterRef = useRef(0);
  const varUidsRef = useRef<string[]>([]);

  // Synchronise uid array length with variables array in the render body.
  // Explicit operations (add/delete/move) manipulate the array directly in
  // their handlers; this sync covers initial mount and any external changes.
  while (varUidsRef.current.length < variables.length) {
    varUidsRef.current.push(`v${uidCounterRef.current++}`);
  }
  if (varUidsRef.current.length > variables.length) {
    varUidsRef.current.length = variables.length;
  }

  // After a reorder, imperatively focus the same move-button in the card's
  // new position. State triggers the effect; the ref holds the target details
  // to avoid an extra render cycle.
  const pendingFocusRef = useRef<{ uid: string; btn: 'up' | 'down' } | null>(null);
  const [focusTick, setFocusTick] = useState(0);

  useEffect(() => {
    const pf = pendingFocusRef.current;
    if (!pf) return;
    pendingFocusRef.current = null;
    const btn = document.querySelector<HTMLButtonElement>(
      `[data-card-uid="${pf.uid}"] [data-move="${pf.btn}"]`,
    );
    btn?.focus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusTick]);

  function patch(updated: Variable[]) {
    onChange({ variables: updated });
  }

  function handleAdd() {
    varUidsRef.current.push(`v${uidCounterRef.current++}`);
    const next = [...variables, blankVariable()];
    patch(next);
    // New item (last index) starts with auto-suggest enabled
    keyEditedRef.current.delete(next.length - 1);
  }

  function handleDelete(index: number) {
    varUidsRef.current.splice(index, 1);
    const next = variables.filter((_, i) => i !== index);
    // Rebuild the manually-edited set, shifting indices down
    const rebuilt = new Set<number>();
    for (const idx of keyEditedRef.current) {
      if (idx < index) rebuilt.add(idx);
      else if (idx > index) rebuilt.add(idx - 1);
    }
    keyEditedRef.current = rebuilt;
    patch(next);
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const movedUid = varUidsRef.current[index];
    [varUidsRef.current[index - 1], varUidsRef.current[index]] = [
      varUidsRef.current[index],
      varUidsRef.current[index - 1],
    ];
    const next = [...variables];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    // Swap the manually-edited flags as well
    const prevEdited = keyEditedRef.current.has(index - 1);
    const currEdited = keyEditedRef.current.has(index);
    const rebuilt = new Set(keyEditedRef.current);
    prevEdited ? rebuilt.add(index) : rebuilt.delete(index);
    currEdited ? rebuilt.add(index - 1) : rebuilt.delete(index - 1);
    keyEditedRef.current = rebuilt;
    patch(next);
    pendingFocusRef.current = { uid: movedUid, btn: 'up' };
    setFocusTick((t) => t + 1);
  }

  function handleMoveDown(index: number) {
    if (index >= variables.length - 1) return;
    const movedUid = varUidsRef.current[index];
    [varUidsRef.current[index], varUidsRef.current[index + 1]] = [
      varUidsRef.current[index + 1],
      varUidsRef.current[index],
    ];
    const next = [...variables];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    const currEdited = keyEditedRef.current.has(index);
    const nextEdited = keyEditedRef.current.has(index + 1);
    const rebuilt = new Set(keyEditedRef.current);
    nextEdited ? rebuilt.add(index) : rebuilt.delete(index);
    currEdited ? rebuilt.add(index + 1) : rebuilt.delete(index + 1);
    keyEditedRef.current = rebuilt;
    patch(next);
    pendingFocusRef.current = { uid: movedUid, btn: 'down' };
    setFocusTick((t) => t + 1);
  }

  function updateAt(index: number, field: Partial<Variable>) {
    const next = variables.map((v, i) => (i === index ? { ...v, ...field } : v));
    patch(next);
  }

  function handleLabelChange(index: number, newLabel: string) {
    const v = variables[index];
    const isAutoKey = !keyEditedRef.current.has(index);
    const update: Partial<Variable> = { label: newLabel };
    if (isAutoKey) {
      update.key = labelToKey(newLabel);
    }
    updateAt(index, update);
  }

  function handleKeyChange(index: number, newKey: string) {
    keyEditedRef.current.add(index);
    updateAt(index, { key: newKey });
  }

  function handleOptionsChange(index: number, raw: string) {
    const opts = raw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    updateAt(index, { options: opts });
  }

  // Compute duplicate key counts (for inline error)
  const keyCounts = new Map<string, number>();
  for (const v of variables) {
    if (v.key) keyCounts.set(v.key, (keyCounts.get(v.key) ?? 0) + 1);
  }

  const isEmpty = variables.length === 0;

  return (
    <div data-testid="variables-editor">

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <span style={{ display: 'block', fontWeight: 700, fontSize: '0.94rem' }}>
            Variables
          </span>
          <p className="help" style={{ margin: '4px 0 0' }}>
            Each variable becomes a form field the user fills in — its answer is
            inserted into the template via the matching placeholder.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={handleAdd}
          style={{ flexShrink: 0, marginLeft: 16 }}
        >
          + Add variable
        </button>
      </div>

      {isEmpty && (
        <p
          style={{
            color: 'var(--muted)',
            fontSize: '0.88rem',
            padding: '16px 0',
            borderTop: '1px solid var(--hairline)',
          }}
        >
          No variables yet. Add one to make this setup customizable.
        </p>
      )}

      {variables.map((v, index) => {
        const isDuplicate = (keyCounts.get(v.key) ?? 0) > 1;
        const isInvalidKey = v.key !== '' && !KEY_RE.test(v.key);
        const needsOptions =
          (v.type === 'select' || v.type === 'multiselect') &&
          (!v.options || v.options.length === 0);
        const isFirst = index === 0;
        const isLast = index === variables.length - 1;

        const keyId = `bVar${index}Key`;
        const labelId = `bVar${index}Label`;
        const typeId = `bVar${index}Type`;
        const requiredId = `bVar${index}Required`;
        const optionsId = `bVar${index}Options`;
        const defaultId = `bVar${index}Default`;
        const helpId = `bVar${index}Help`;
        const groupId = `bVar${index}Group`;

        return (
          <div
            key={varUidsRef.current[index]}
            data-card-uid={varUidsRef.current[index]}
            data-testid={`variable-item-${index}`}
            style={{
              border: '1px solid var(--hairline)',
              borderRadius: 'var(--r-md)',
              padding: '20px',
              marginBottom: 14,
              background: 'var(--paper)',
            }}
          >
            {/* Item header: variable number + reorder/delete controls */}
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
                Variable {index + 1}
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  aria-label={`Move variable ${index + 1} up`}
                  onClick={() => handleMoveUp(index)}
                  disabled={isFirst}
                  data-move="up"
                  style={{ padding: '4px 10px', fontSize: '0.82rem' }}
                >
                  {/* Up arrow */}
                  <svg
                    width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  aria-label={`Move variable ${index + 1} down`}
                  onClick={() => handleMoveDown(index)}
                  disabled={isLast}
                  data-move="down"
                  style={{ padding: '4px 10px', fontSize: '0.82rem' }}
                >
                  {/* Down arrow */}
                  <svg
                    width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  aria-label={`Delete variable ${index + 1}`}
                  onClick={() => handleDelete(index)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.82rem',
                    color: 'var(--bad)',
                  }}
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Label + Key (two-col) */}
            <div className="field two-col" style={{ marginBottom: 14 }}>
              <div>
                <label htmlFor={labelId} style={{ display: 'block', fontWeight: 700, fontSize: '0.94rem', marginBottom: 6 }}>
                  Label <span className="req" aria-hidden="true">*</span>
                </label>
                <p className="help">What the form field is called.</p>
                <input
                  className="input"
                  id={labelId}
                  type="text"
                  value={v.label}
                  onChange={(e) => handleLabelChange(index, e.target.value)}
                  placeholder="e.g. Company name"
                  data-testid={`var-label-${index}`}
                />
              </div>
              <div className={(isDuplicate || isInvalidKey) ? 'invalid' : ''}>
                <label htmlFor={keyId} style={{ display: 'block', fontWeight: 700, fontSize: '0.94rem', marginBottom: 6 }}>
                  Template key <span className="req" aria-hidden="true">*</span>
                </label>
                <p className="help">
                  Used in the template as{' '}
                  <code style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>
                    {'{{'}
                    {v.key || 'key'}
                    {'}}'}
                  </code>
                </p>
                <input
                  className="input"
                  id={keyId}
                  type="text"
                  value={v.key}
                  onChange={(e) => handleKeyChange(index, e.target.value)}
                  placeholder="e.g. company_name"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-describedby={
                    [isDuplicate && `${keyId}-err`, isInvalidKey && `${keyId}-invalid-err`]
                      .filter(Boolean)
                      .join(' ') || undefined
                  }
                  data-testid={`var-key-${index}`}
                />
                {isDuplicate && (
                  <p
                    className="error-msg"
                    id={`${keyId}-err`}
                    role="alert"
                    data-testid={`var-key-err-${index}`}
                  >
                    Duplicate key — each variable must have a unique key.
                  </p>
                )}
                {isInvalidKey && (
                  <p
                    className="error-msg"
                    id={`${keyId}-invalid-err`}
                    role="alert"
                    data-testid={`var-key-invalid-err-${index}`}
                  >
                    Keys use letters, digits, and underscores, and can&apos;t start with a digit.
                  </p>
                )}
              </div>
            </div>

            {/* Type + Required */}
            <div className="field two-col" style={{ marginBottom: 14 }}>
              <div>
                <label htmlFor={typeId} style={{ display: 'block', fontWeight: 700, fontSize: '0.94rem', marginBottom: 6 }}>
                  Type
                </label>
                <select
                  className="select-el"
                  id={typeId}
                  value={v.type}
                  onChange={(e) =>
                    updateAt(index, { type: e.target.value as Variable['type'] })
                  }
                  data-testid={`var-type-${index}`}
                >
                  {VARIABLE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ paddingTop: 28 }}>
                <label className="check" style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id={requiredId}
                    checked={v.required}
                    onChange={(e) => updateAt(index, { required: e.target.checked })}
                    style={{ position: 'static', opacity: 1, width: 'auto', height: 'auto' }}
                    data-testid={`var-required-${index}`}
                  />
                  <span style={{
                    fontWeight: 600, fontSize: '0.88rem',
                    background: 'none', border: 'none', padding: 0
                  }}>
                    Required
                  </span>
                </label>
              </div>
            </div>

            {/* Options — only for select / multiselect */}
            {(v.type === 'select' || v.type === 'multiselect') && (
              <div className={`field${needsOptions ? ' invalid' : ''}`} style={{ marginBottom: 14 }}>
                <label htmlFor={optionsId} style={{ display: 'block', fontWeight: 700, fontSize: '0.94rem', marginBottom: 6 }}>
                  Options <span className="req" aria-hidden="true">*</span>
                </label>
                <p className="help">One option per line.</p>
                <textarea
                  className="input"
                  id={optionsId}
                  rows={4}
                  value={(v.options ?? []).join('\n')}
                  onChange={(e) => handleOptionsChange(index, e.target.value)}
                  placeholder="Option A&#10;Option B&#10;Option C"
                  aria-describedby={needsOptions ? `${optionsId}-err` : undefined}
                  data-testid={`var-options-${index}`}
                />
                {needsOptions && (
                  <p
                    className="error-msg"
                    id={`${optionsId}-err`}
                    role="alert"
                    data-testid={`var-options-err-${index}`}
                  >
                    No options defined — {v.type} variables require at least one option in the options list.
                  </p>
                )}
              </div>
            )}

            {/* Default value */}
            <div className="field" style={{ marginBottom: 14 }}>
              <label htmlFor={defaultId} style={{ display: 'block', fontWeight: 700, fontSize: '0.94rem', marginBottom: 6 }}>
                Default{' '}
                <span className="muted" style={{ fontWeight: 600 }}>
                  (optional)
                </span>
              </label>
              {v.type === 'boolean' ? (
                <label className="check" style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id={defaultId}
                    checked={v.default === true || v.default === 'true'}
                    onChange={(e) => updateAt(index, { default: e.target.checked })}
                    style={{ position: 'static', opacity: 1, width: 'auto', height: 'auto' }}
                    data-testid={`var-default-${index}`}
                  />
                  <span style={{
                    fontWeight: 600, fontSize: '0.88rem',
                    background: 'none', border: 'none', padding: 0,
                  }}>
                    On by default
                  </span>
                </label>
              ) : v.type === 'number' ? (
                <input
                  className="input"
                  id={defaultId}
                  type="number"
                  value={v.default !== undefined ? String(v.default) : ''}
                  onChange={(e) =>
                    updateAt(index, {
                      default: e.target.value === '' ? undefined : Number(e.target.value),
                    })
                  }
                  placeholder="0"
                  data-testid={`var-default-${index}`}
                />
              ) : (
                <input
                  className="input"
                  id={defaultId}
                  type="text"
                  value={v.default !== undefined ? String(v.default) : ''}
                  onChange={(e) =>
                    updateAt(index, {
                      default: e.target.value === '' ? undefined : e.target.value,
                    })
                  }
                  placeholder="Leave blank for no default"
                  data-testid={`var-default-${index}`}
                />
              )}
            </div>

            {/* Help text + Group (two-col) */}
            <div className="field two-col" style={{ marginBottom: 0 }}>
              <div>
                <label htmlFor={helpId} style={{ display: 'block', fontWeight: 700, fontSize: '0.94rem', marginBottom: 6 }}>
                  Help text{' '}
                  <span className="muted" style={{ fontWeight: 600 }}>
                    (optional)
                  </span>
                </label>
                <input
                  className="input"
                  id={helpId}
                  type="text"
                  value={v.helpText ?? ''}
                  onChange={(e) =>
                    updateAt(index, { helpText: e.target.value || undefined })
                  }
                  placeholder="Short hint shown under the field"
                  data-testid={`var-helptext-${index}`}
                />
              </div>
              <div>
                <label htmlFor={groupId} style={{ display: 'block', fontWeight: 700, fontSize: '0.94rem', marginBottom: 6 }}>
                  Group{' '}
                  <span className="muted" style={{ fontWeight: 600 }}>
                    (optional)
                  </span>
                </label>
                <input
                  className="input"
                  id={groupId}
                  type="text"
                  value={v.group ?? ''}
                  onChange={(e) =>
                    updateAt(index, { group: e.target.value || undefined })
                  }
                  placeholder="e.g. About you"
                  data-testid={`var-group-${index}`}
                />
              </div>
            </div>

          </div>
        );
      })}

      {/* Bottom add button (secondary, shown when list is non-empty) */}
      {!isEmpty && (
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={handleAdd}
          style={{ marginTop: 4 }}
        >
          + Add another variable
        </button>
      )}

    </div>
  );
}
