'use client';

/**
 * KnowledgeEditor — step 3a of the community builder wizard.
 *
 * Edits the knowledgeFiles array of a DraftInput. Each entry is a KnowledgeFile
 * (discriminated on kind):
 *   'starter'       — bundled content included in the export; requires non-empty content.
 *   'user-provided' — instructs the user what to upload; requires non-empty guidance.
 *
 * Contract (matches MetadataEditor):
 *   value    — the full DraftInput
 *   onChange — called with a partial patch; BuilderView merges it into state
 *   findings — accepted per the editor contract (errors keyed by field)
 */

import { useRef } from 'react';
import type { DraftInput } from '@/lib/community/drafts';
import type { KnowledgeFile } from '@/lib/setup/types';
import type { MetadataFinding } from './MetadataEditor';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface KnowledgeEditorProps {
  value: DraftInput;
  onChange: (patch: Partial<DraftInput>) => void;
  findings?: MetadataFinding[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function blankStarter(): KnowledgeFile {
  return { name: '', purpose: '', kind: 'starter', content: '', required: false };
}

function blankUserProvided(): KnowledgeFile {
  return { name: '', purpose: '', kind: 'user-provided', guidance: '', required: false };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function KnowledgeEditor({ value, onChange }: KnowledgeEditorProps) {
  const files = (value.knowledgeFiles ?? []) as KnowledgeFile[];

  // Stable UIDs for card keys — keeps keyboard focus correct on mid-list delete.
  // Mirrors VariablesEditor's varUidsRef/uidCounterRef pattern. The uid array
  // is never written into the persisted knowledgeFiles payload.
  const uidCounterRef = useRef(0);
  const kfUidsRef = useRef<string[]>([]);

  // Synchronise uid array length with files array in the render body.
  // Explicit operations (add/delete) manipulate the array in their handlers;
  // this sync covers initial mount and any external changes.
  while (kfUidsRef.current.length < files.length) {
    kfUidsRef.current.push(`kf${uidCounterRef.current++}`);
  }
  if (kfUidsRef.current.length > files.length) {
    kfUidsRef.current.length = files.length;
  }

  function patch(updated: KnowledgeFile[]) {
    onChange({ knowledgeFiles: updated });
  }

  function handleAdd(kind: 'starter' | 'user-provided') {
    kfUidsRef.current.push(`kf${uidCounterRef.current++}`);
    patch([...files, kind === 'starter' ? blankStarter() : blankUserProvided()]);
  }

  function handleDelete(index: number) {
    kfUidsRef.current.splice(index, 1);
    patch(files.filter((_, i) => i !== index));
  }

  /** Update fields shared by both kinds (name, purpose, required). */
  function handleSharedChange(
    index: number,
    update: { name?: string; purpose?: string; required?: boolean },
  ) {
    patch(
      files.map((f, i): KnowledgeFile => {
        if (i !== index) return f;
        if (f.kind === 'starter') return { ...f, ...update };
        return { ...f, ...update };
      }),
    );
  }

  function handleKindChange(index: number, newKind: 'starter' | 'user-provided') {
    patch(
      files.map((f, i): KnowledgeFile => {
        if (i !== index) return f;
        if (newKind === 'starter') {
          return { name: f.name, purpose: f.purpose, kind: 'starter', content: '', required: f.required };
        }
        return { name: f.name, purpose: f.purpose, kind: 'user-provided', guidance: '', required: f.required };
      }),
    );
  }

  function handleContentChange(index: number, content: string) {
    patch(
      files.map((f, i): KnowledgeFile => {
        if (i !== index) return f;
        if (f.kind !== 'starter') return f;
        return { ...f, content };
      }),
    );
  }

  function handleGuidanceChange(index: number, guidance: string) {
    patch(
      files.map((f, i): KnowledgeFile => {
        if (i !== index) return f;
        if (f.kind !== 'user-provided') return f;
        return { ...f, guidance };
      }),
    );
  }

  const isEmpty = files.length === 0;

  return (
    <div data-testid="knowledge-editor">

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
            Knowledge files
          </span>
          <p className="help" style={{ margin: '4px 0 0' }}>
            Starter files include their content in the export. User-provided files
            prompt the user to upload their own material.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 16 }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => handleAdd('starter')}
          >
            + Starter file
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => handleAdd('user-provided')}
          >
            + User-provided
          </button>
        </div>
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
          No knowledge files yet. Add a starter file to bundle reference content,
          or a user-provided file to ask users to upload their own.
        </p>
      )}

      {/* File cards */}
      {files.map((file, index) => {
        const starterEmpty = file.kind === 'starter' && !file.content.trim();
        const guidanceEmpty = file.kind === 'user-provided' && !file.guidance.trim();
        const nameId    = `bKf${index}Name`;
        const purposeId = `bKf${index}Purpose`;
        const kindId    = `bKf${index}Kind`;
        const reqId     = `bKf${index}Required`;
        const contentId = `bKf${index}Content`;
        const guidId    = `bKf${index}Guidance`;

        return (
          <div
            key={kfUidsRef.current[index]}
            data-testid={`knowledge-item-${index}`}
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
                {file.kind === 'starter' ? 'Starter file' : 'User-provided file'}{' '}
                {index + 1}
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                aria-label={`Remove knowledge file ${index + 1}`}
                onClick={() => handleDelete(index)}
                style={{ padding: '4px 10px', fontSize: '0.82rem', color: 'var(--bad)' }}
              >
                Remove
              </button>
            </div>

            {/* Name */}
            <div className="field" style={{ marginBottom: 14 }}>
              <label
                htmlFor={nameId}
                style={{ display: 'block', fontWeight: 700, fontSize: '0.94rem', marginBottom: 6 }}
              >
                Name <span className="req" aria-hidden="true">*</span>
              </label>
              <input
                className="input"
                id={nameId}
                type="text"
                value={file.name}
                onChange={(e) => handleSharedChange(index, { name: e.target.value })}
                placeholder="e.g. Brand quick-facts"
                data-testid={`kf-name-${index}`}
              />
            </div>

            {/* Kind + Required (two-col) */}
            <div className="field two-col" style={{ marginBottom: 14 }}>
              <div>
                <label
                  htmlFor={kindId}
                  style={{ display: 'block', fontWeight: 700, fontSize: '0.94rem', marginBottom: 6 }}
                >
                  Kind
                </label>
                <select
                  className="select-el"
                  id={kindId}
                  value={file.kind}
                  onChange={(e) =>
                    handleKindChange(index, e.target.value as 'starter' | 'user-provided')
                  }
                  data-testid={`kf-kind-${index}`}
                >
                  <option value="starter">Starter, bundled content</option>
                  <option value="user-provided">User-provided, user uploads their own</option>
                </select>
              </div>
              <div style={{ paddingTop: 28 }}>
                <label
                  className="check"
                  style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}
                >
                  <input
                    type="checkbox"
                    id={reqId}
                    checked={file.required}
                    onChange={(e) => handleSharedChange(index, { required: e.target.checked })}
                    style={{ position: 'static', opacity: 1, width: 'auto', height: 'auto' }}
                    data-testid={`kf-required-${index}`}
                  />
                  <span
                    style={{ fontWeight: 600, fontSize: '0.88rem', background: 'none', border: 'none', padding: 0 }}
                  >
                    Required
                  </span>
                </label>
              </div>
            </div>

            {/* Purpose */}
            <div className="field" style={{ marginBottom: 14 }}>
              <label
                htmlFor={purposeId}
                style={{ display: 'block', fontWeight: 700, fontSize: '0.94rem', marginBottom: 6 }}
              >
                Purpose{' '}
                <span className="muted" style={{ fontWeight: 600 }}>
                  (optional)
                </span>
              </label>
              <p className="help">
                What this file is for, shown on the setup detail page.
              </p>
              <input
                className="input"
                id={purposeId}
                type="text"
                value={file.purpose}
                onChange={(e) => handleSharedChange(index, { purpose: e.target.value })}
                placeholder="e.g. Your positioning, mission, and product overview"
                data-testid={`kf-purpose-${index}`}
              />
            </div>

            {/* Content (starter) */}
            {file.kind === 'starter' && (
              <div className={`field${starterEmpty ? ' invalid' : ''}`} style={{ marginBottom: 0 }}>
                <label
                  htmlFor={contentId}
                  style={{ display: 'block', fontWeight: 700, fontSize: '0.94rem', marginBottom: 6 }}
                >
                  Content <span className="req" aria-hidden="true">*</span>
                </label>
                <p className="help">
                  This text is included in the export bundle, Claude reads it as context.
                </p>
                <textarea
                  className="input"
                  id={contentId}
                  rows={6}
                  value={file.content}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                  aria-describedby={starterEmpty ? `${contentId}-err` : undefined}
                  data-testid={`kf-content-${index}`}
                />
                {starterEmpty && (
                  <p
                    className="error-msg"
                    id={`${contentId}-err`}
                    role="alert"
                    data-testid={`kf-content-err-${index}`}
                  >
                    A starter file must have content, this is what gets included in the setup.
                  </p>
                )}
              </div>
            )}

            {/* Guidance (user-provided) */}
            {file.kind === 'user-provided' && (
              <div className={`field${guidanceEmpty ? ' invalid' : ''}`} style={{ marginBottom: 0 }}>
                <label
                  htmlFor={guidId}
                  style={{ display: 'block', fontWeight: 700, fontSize: '0.94rem', marginBottom: 6 }}
                >
                  Guidance <span className="req" aria-hidden="true">*</span>
                </label>
                <p className="help">
                  Instructions telling the user what to put in this file.
                </p>
                <textarea
                  className="input"
                  id={guidId}
                  rows={4}
                  value={file.guidance}
                  onChange={(e) => handleGuidanceChange(index, e.target.value)}
                  aria-describedby={guidanceEmpty ? `${guidId}-err` : undefined}
                  placeholder="e.g. Upload a PDF of your brand voice guide, or paste its text."
                  data-testid={`kf-guidance-${index}`}
                />
                {guidanceEmpty && (
                  <p
                    className="error-msg"
                    id={`${guidId}-err`}
                    role="alert"
                    data-testid={`kf-guidance-err-${index}`}
                  >
                    Tell users what to put in this file, guidance is required for user-provided files.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Bottom add buttons (shown when list is non-empty) */}
      {!isEmpty && (
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => handleAdd('starter')}
          >
            + Another starter file
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => handleAdd('user-provided')}
          >
            + Another user-provided
          </button>
        </div>
      )}

    </div>
  );
}
