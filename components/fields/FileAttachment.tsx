'use client';

import { useRef, useState } from 'react';
import type { KnowledgeFile } from '@/lib/setup/types';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { createSupabaseStoredFilesStore } from '@/lib/saved/storedFiles';

interface Props {
  knowledgeFile: KnowledgeFile & { kind: 'user-provided' };
  value: string | undefined;
  onChange: (content: string | null) => void;
  /** Whether a user session exists — gates the opt-in "save to account" control. */
  signedIn?: boolean;
  /** The signed-in user's id, when present. */
  userId?: string;
  /** Metadata of an existing stored copy of THIS file, if the user has one. */
  savedMeta?: { id: string; storagePath: string } | null;
}

/**
 * Maximum size (in characters) for an attached file. Attachments are carried to
 * the export page via sessionStorage (~5MB quota), so an oversize file is
 * rejected here rather than silently failing the handoff later.
 */
export const MAX_ATTACHMENT_CHARS = 1_000_000;

export default function FileAttachment({
  knowledgeFile,
  value,
  onChange,
  signedIn = false,
  userId,
  savedMeta = null,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [readError, setReadError] = useState<string | null>(null);
  const inputId = `file-attachment-${knowledgeFile.name.replace(/\s+/g, '-').toLowerCase()}`;

  // Opt-in account-storage state (Task 5). Nothing uploads without the explicit
  // action below; `saved` reflects an existing or just-saved stored copy.
  const [saved, setSaved] = useState<{ id: string; storagePath: string } | null>(savedMeta);
  const [storeBusy, setStoreBusy] = useState(false);
  const [storeError, setStoreError] = useState<string | null>(null);

  async function handleSaveToAccount() {
    if (!userId || value === undefined || value === null || value === '') return;
    setStoreBusy(true);
    setStoreError(null);
    try {
      const store = createSupabaseStoredFilesStore(createSupabaseBrowserClient());
      const meta = await store.save({
        userId,
        knowledgeFileName: knowledgeFile.name,
        content: value,
      });
      setSaved({ id: meta.id, storagePath: meta.storagePath });
    } catch {
      setStoreError('Could not save this file to your account. Please try again.');
    } finally {
      setStoreBusy(false);
    }
  }

  async function handleRemoveFromAccount() {
    if (!saved) return;
    setStoreBusy(true);
    setStoreError(null);
    try {
      const store = createSupabaseStoredFilesStore(createSupabaseBrowserClient());
      await store.remove(saved);
      setSaved(null);
    } catch {
      setStoreError('Could not remove the saved copy. Please try again.');
    } finally {
      setStoreBusy(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    file.text().then((text) => {
      if (text.length > MAX_ATTACHMENT_CHARS) {
        setReadError('That file is too large to attach. Try a smaller file.');
        onChange(null);
        return;
      }
      setReadError(null);
      onChange(text);
    }).catch(() => {
      setReadError("We couldn't read that file. Try attaching it again, or use a plain text file.");
      onChange(null);
    });
  }

  function handleRemove() {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setReadError(null);
    onChange(null);
  }

  const isAttached = value !== undefined && value !== null && value !== '';

  return (
    <div className="field">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <label htmlFor={inputId} className="label">
          {knowledgeFile.name}
        </label>
        {knowledgeFile.required && (
          <span aria-hidden="true" className="req"> *</span>
        )}
        {!knowledgeFile.required && (
          <span className="muted" style={{ fontWeight: 600 }}> (optional)</span>
        )}
      </div>

      {knowledgeFile.guidance && (
        <p className="help">{knowledgeFile.guidance}</p>
      )}

      {!isAttached ? (
        <div
          className="file-slot"
          onClick={() => inputRef.current?.click()}
          style={{ cursor: 'pointer' }}
        >
          <strong>Drop a file here, or click to browse</strong>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept=".txt,.md,.csv,.text,text/*"
            onChange={handleFileChange}
            style={{ display: 'block', marginTop: '8px', fontSize: '0.85rem' }}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--good)', fontWeight: 600 }}>
            ✓ Attached
          </span>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleRemove}
          >
            Remove
          </button>
        </div>
      )}

      {readError && (
        <span
          role="alert"
          style={{ fontSize: '0.82rem', color: 'var(--bad)', display: 'block', marginTop: '6px' }}
        >
          {readError}
        </span>
      )}

      {/* Opt-in account storage (Task 5). Signed-in only; nothing uploads unless
          the user explicitly chooses to save the file. */}
      {signedIn && (
        <div style={{ marginTop: 10 }} data-testid="stored-file-optin">
          {saved ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--good)', fontWeight: 600 }} data-testid="stored-file-saved">
                ✓ Saved to your account
              </span>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                disabled={storeBusy}
                onClick={handleRemoveFromAccount}
                data-testid="stored-file-remove"
              >
                {storeBusy ? 'Removing…' : 'Remove saved copy'}
              </button>
            </div>
          ) : (
            isAttached && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                disabled={storeBusy}
                onClick={handleSaveToAccount}
                data-testid="stored-file-save"
              >
                {storeBusy ? 'Saving…' : 'Save this file to my account'}
              </button>
            )
          )}
          {storeError && (
            <span role="alert" style={{ fontSize: '0.82rem', color: 'var(--bad)', display: 'block', marginTop: '6px' }}>
              {storeError}
            </span>
          )}
        </div>
      )}

      {saved ? (
        <p className="inline-warning" style={{ marginBottom: 0, color: 'var(--ink-soft)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
          Saved to your account — this file will be used at export even after a refresh. Only you can access it.
        </p>
      ) : (
        <p className="inline-warning" style={{ marginBottom: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 4 2.8 19.5h18.4z" />
            <path d="M12 10v4.5M12 17.2v.1" />
          </svg>
          Files stay in your browser and are never uploaded — but if you refresh the page you will need to attach them again.
        </p>
      )}
    </div>
  );
}
