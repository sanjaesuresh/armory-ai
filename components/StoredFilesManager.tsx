'use client';

/**
 * StoredFilesManager — account-level management of opt-in stored knowledge files
 * (Phase 4 Task 5). Lists the user's saved files and lets them delete each one
 * (with a confirm step). Deletion removes both the storage object and its
 * metadata via the browser Supabase client under RLS, then refreshes the page.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { createSupabaseStoredFilesStore } from '@/lib/saved/storedFiles';

export interface StoredFileVM {
  id: string;
  knowledgeFileName: string;
  storagePath: string;
  sizeLabel: string;
  updatedLabel: string;
}

export default function StoredFilesManager({ files }: { files: StoredFileVM[] }) {
  const router = useRouter();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function remove(file: StoredFileVM) {
    setBusyId(file.id);
    setError(null);
    try {
      const store = createSupabaseStoredFilesStore(createSupabaseBrowserClient());
      await store.remove({ id: file.id, storagePath: file.storagePath });
      setConfirmingId(null);
      router.refresh();
    } catch {
      setError('Could not delete that file. Please try again.');
    } finally {
      setBusyId(null);
    }
  }

  if (files.length === 0) {
    return (
      <p className="muted small" data-testid="stored-files-empty">
        No saved files yet. When you customize a setup, you can save an attached
        knowledge file to your account.
      </p>
    );
  }

  return (
    <div data-testid="stored-files-manager">
      {error && (
        <p role="alert" style={{ color: 'var(--bad)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 10 }}>
          {error}
        </p>
      )}
      {files.map((f) => (
        <div className="lib-row" key={f.id} data-testid="stored-file-row">
          <span className="icon-badge" style={{ background: 'var(--oat-deep)', width: 36, height: 36 }} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6.5 3.5h7L18.5 8v11.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1z" />
              <path d="M13.5 3.5V8h4.5" />
            </svg>
          </span>
          <div className="lib-body">
            <strong>{f.knowledgeFileName}</strong>
            <span>
              {f.sizeLabel} · saved {f.updatedLabel}
            </span>
          </div>
          {confirmingId === f.id ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-outline btn-sm"
                disabled={busyId === f.id}
                onClick={() => remove(f)}
                data-testid="stored-file-confirm-delete"
              >
                {busyId === f.id ? 'Deleting…' : 'Confirm delete'}
              </button>
              <button className="btn btn-outline btn-sm" disabled={busyId === f.id} onClick={() => setConfirmingId(null)}>
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setConfirmingId(f.id)}
              data-testid="stored-file-delete"
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
