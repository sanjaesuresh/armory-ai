'use client';

/**
 * SavedSetupsList — the populated "My setups" list (Phase 4 Task 3).
 *
 * Server-rendered view-models arrive already reconciled against the current
 * setup version (see app/my/setups/page.tsx). This client component owns the
 * interactions: resume (with the in-progress-conflict question), rename, and
 * delete (with a confirm step). Mutations go through the browser Supabase client
 * under RLS; after a successful write we refresh the server component.
 *
 * Resume writes the reconciled answers into the same sessionStorage key the
 * customize flow hydrates from (armory:answers:<slug>), and — when the saved
 * version drifted or answers were dropped — a companion note the customize page
 * surfaces once.
 */

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Answers } from '@/lib/setup/types';
import { isAnswerEmpty } from '@/lib/setup/answers';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { createSupabaseSavedSetupsStore } from '@/lib/saved/savedSetups';

export interface SavedRowVM {
  id: string;
  /** User-given name for the saved setup. */
  name: string;
  /** Current setup display name, or null if the setup is no longer available. */
  setupName: string | null;
  slug: string | null;
  available: boolean;
  complete: boolean;
  versionChanged: boolean;
  droppedKeys: string[];
  savedVersion: string;
  currentVersion: string | null;
  reconciledAnswers: Answers;
  updatedLabel: string;
  tags: string[];
}

const ANSWERS_KEY = (slug: string) => `armory:answers:${slug}`;
const RESUME_NOTE_KEY = (slug: string) => `armory:resume-note:${slug}`;

function normalizeForCompare(a: Answers): string {
  const keys = Object.keys(a).sort();
  return JSON.stringify(keys.map((k) => [k, a[k]]));
}

/** True when sessionStorage holds in-progress answers that differ from the saved ones. */
function hasConflict(slug: string, savedAnswers: Answers): boolean {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(ANSWERS_KEY(slug));
  } catch {
    return false;
  }
  if (!raw) return false;
  let existing: Answers;
  try {
    existing = JSON.parse(raw) as Answers;
  } catch {
    return false;
  }
  const hasRealProgress = Object.values(existing).some((v) => !isAnswerEmpty(v));
  if (!hasRealProgress) return false;
  return normalizeForCompare(existing) !== normalizeForCompare(savedAnswers);
}

function writeResume(row: SavedRowVM) {
  if (!row.slug) return;
  try {
    sessionStorage.setItem(ANSWERS_KEY(row.slug), JSON.stringify(row.reconciledAnswers));
    if (row.versionChanged || row.droppedKeys.length > 0) {
      sessionStorage.setItem(
        RESUME_NOTE_KEY(row.slug),
        JSON.stringify({
          droppedKeys: row.droppedKeys,
          savedVersion: row.savedVersion,
          currentVersion: row.currentVersion,
        }),
      );
    } else {
      sessionStorage.removeItem(RESUME_NOTE_KEY(row.slug));
    }
  } catch {
    // sessionStorage unavailable (private mode) — resume falls back to defaults.
  }
}

type Dialog =
  | { kind: 'conflict'; row: SavedRowVM }
  | { kind: 'delete'; row: SavedRowVM }
  | null;

export default function SavedSetupsList({ rows }: { rows: SavedRowVM[] }) {
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [error, setError] = useState<string | null>(null);

  function store() {
    return createSupabaseSavedSetupsStore(createSupabaseBrowserClient());
  }

  // Close the open kebab menu on Escape or outside click.
  useEffect(() => {
    if (!openMenuId) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenMenuId(null);
    }
    function onClick(e: MouseEvent) {
      const t = e.target as HTMLElement;
      if (!t.closest('.saved-menu-wrap')) setOpenMenuId(null);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [openMenuId]);

  function startResume(row: SavedRowVM) {
    setOpenMenuId(null);
    if (!row.slug) return;
    if (hasConflict(row.slug, row.reconciledAnswers)) {
      setDialog({ kind: 'conflict', row });
      return;
    }
    writeResume(row);
    router.push(`/setup/${row.slug}/customize`);
  }

  function startRename(row: SavedRowVM) {
    setOpenMenuId(null);
    setRenamingId(row.id);
    setRenameValue(row.name);
  }

  async function commitRename(row: SavedRowVM) {
    const name = renameValue.trim();
    if (!name || name === row.name) {
      setRenamingId(null);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await store().rename(row.id, name);
      setRenamingId(null);
      router.refresh();
    } catch {
      setError('Could not rename that setup. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete(row: SavedRowVM) {
    setBusy(true);
    setError(null);
    try {
      await store().remove(row.id);
      setDialog(null);
      router.refresh();
    } catch {
      setError('Could not delete that setup. Please try again.');
      setDialog(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div data-testid="saved-setups-list">
      {error && (
        <p role="alert" style={{ color: 'var(--bad)', fontSize: '0.88rem', fontWeight: 600, marginBottom: 12 }}>
          {error}
        </p>
      )}

      {rows.map((row) => (
        <div className="lib-row" key={row.id} data-testid="saved-row">
          <span
            className="icon-badge"
            style={{ background: 'var(--oat-deep)', width: 40, height: 40 }}
            aria-hidden="true"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6.5 3.5h7L18.5 8v11.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1z" />
              <path d="M13.5 3.5V8h4.5M9 12.5h6M9 16h6" />
            </svg>
          </span>

          {renamingId === row.id ? (
            <div className="saved-rename">
              <label htmlFor={`rename-${row.id}`} className="sr-only">
                New name for {row.name}
              </label>
              <input
                id={`rename-${row.id}`}
                className="input"
                value={renameValue}
                autoFocus
                disabled={busy}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitRename(row);
                  if (e.key === 'Escape') setRenamingId(null);
                }}
              />
              <button className="btn btn-primary btn-sm" disabled={busy} onClick={() => commitRename(row)}>
                Save
              </button>
              <button className="btn btn-outline btn-sm" disabled={busy} onClick={() => setRenamingId(null)}>
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div className="lib-body">
                <strong>{row.name}</strong>
                <span>
                  {row.setupName ?? 'Setup no longer available'}
                  {' · '}Edited {row.updatedLabel}
                  {row.available && row.versionChanged ? ' · setup updated since saved' : ''}
                </span>
              </div>

              {row.tags.length > 0 && (
                <div className="tags">
                  {row.tags.slice(0, 2).map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
              )}

              {row.available ? (
                <span className={row.complete ? 'status status-ready' : 'status status-draft'}>
                  {row.complete ? 'Ready to use' : 'Draft'}
                </span>
              ) : (
                <span className="status status-draft">Unavailable</span>
              )}

              <div className="saved-menu-wrap">
                <button
                  className="kebab"
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={openMenuId === row.id}
                  aria-label={`Actions for ${row.name}`}
                  onClick={() => setOpenMenuId((id) => (id === row.id ? null : row.id))}
                >
                  ⋯
                </button>
                {openMenuId === row.id && (
                  <ul className="saved-menu" role="menu" aria-label={`Actions for ${row.name}`}>
                    {row.available && (
                      <li role="none">
                        <button role="menuitem" type="button" onClick={() => startResume(row)}>
                          Resume
                        </button>
                      </li>
                    )}
                    <li role="none">
                      <button role="menuitem" type="button" onClick={() => startRename(row)}>
                        Rename
                      </button>
                    </li>
                    <li role="none">
                      <button
                        role="menuitem"
                        type="button"
                        className="danger"
                        onClick={() => {
                          setOpenMenuId(null);
                          setDialog({ kind: 'delete', row });
                        }}
                      >
                        Delete
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      ))}

      {dialog && (
        <ConfirmDialog
          dialog={dialog}
          busy={busy}
          onCancel={() => setDialog(null)}
          onKeepCurrent={() => {
            const row = dialog.row;
            setDialog(null);
            if (row.slug) router.push(`/setup/${row.slug}/customize`);
          }}
          onUseSaved={() => {
            const row = dialog.row;
            setDialog(null);
            writeResume(row);
            if (row.slug) router.push(`/setup/${row.slug}/customize`);
          }}
          onConfirmDelete={() => confirmDelete(dialog.row)}
        />
      )}
    </div>
  );
}

function ConfirmDialog({
  dialog,
  busy,
  onCancel,
  onKeepCurrent,
  onUseSaved,
  onConfirmDelete,
}: {
  dialog: NonNullable<Dialog>;
  busy: boolean;
  onCancel: () => void;
  onKeepCurrent: () => void;
  onUseSaved: () => void;
  onConfirmDelete: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div
      className="saved-dialog-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="saved-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="saved-dialog-title"
        tabIndex={-1}
        ref={ref}
        data-testid="saved-dialog"
      >
        {dialog.kind === 'conflict' ? (
          <>
            <h2 id="saved-dialog-title">You have unsaved changes here</h2>
            <p>
              You&apos;ve started customizing <strong>{dialog.row.setupName ?? dialog.row.name}</strong>{' '}
              in this browser. Which version would you like to keep?
            </p>
            <div className="saved-dialog-actions">
              <button className="btn btn-outline" onClick={onKeepCurrent}>
                Keep my current progress
              </button>
              <button className="btn btn-primary" onClick={onUseSaved}>
                Use the saved version
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 id="saved-dialog-title">Delete this saved setup?</h2>
            <p>
              <strong>{dialog.row.name}</strong> will be removed from your account. This can&apos;t be
              undone.
            </p>
            <div className="saved-dialog-actions">
              <button className="btn btn-outline" disabled={busy} onClick={onCancel}>
                Cancel
              </button>
              <button className="btn btn-primary" disabled={busy} onClick={onConfirmDelete}>
                {busy ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
