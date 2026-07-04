'use client';

/**
 * ResumeNotice — shown once on the customize page after resuming a saved setup
 * whose version had drifted (Phase 4 Task 3). It reads the companion note written
 * by SavedSetupsList, names any answers that were dropped because the current
 * setup no longer defines those variables, then clears the note so it appears
 * only once.
 */

import { useEffect, useState } from 'react';

interface Note {
  droppedKeys: string[];
  savedVersion: string;
  currentVersion: string | null;
}

export default function ResumeNotice({ slug }: { slug: string }) {
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    const key = `armory:resume-note:${slug}`;
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return;
      sessionStorage.removeItem(key);
      const parsed = JSON.parse(raw) as Note;
      setNote(parsed);
    } catch {
      // No readable note — nothing to show.
    }
  }, [slug]);

  if (!note) return null;

  const versionDrifted =
    note.currentVersion != null && note.currentVersion !== note.savedVersion;

  return (
    <div className="info-note" role="status" data-testid="resume-notice">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none', marginTop: 1 }}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8h.01M11 12h1v4h1" />
      </svg>
      <div style={{ flex: 1 }}>
        {versionDrifted ? (
          <>
            This setup was updated since you saved it. We kept your answers and
            loaded them here.
          </>
        ) : (
          <>We loaded your saved answers here.</>
        )}
        {note.droppedKeys.length > 0 && (
          <>
            {' '}
            A few no longer apply to the current setup and were left out:{' '}
            <strong>{note.droppedKeys.join(', ')}</strong>.
          </>
        )}
      </div>
      <button type="button" aria-label="Dismiss" onClick={() => setNote(null)}>
        ✕
      </button>
    </div>
  );
}
