'use client';

import { useRef, useState } from 'react';
import type { KnowledgeFile } from '@/lib/setup/types';

interface Props {
  knowledgeFile: KnowledgeFile & { kind: 'user-provided' };
  value: string | undefined;
  onChange: (content: string | null) => void;
}

/**
 * Maximum size (in characters) for an attached file. Attachments are carried to
 * the export page via sessionStorage (~5MB quota), so an oversize file is
 * rejected here rather than silently failing the handoff later.
 */
export const MAX_ATTACHMENT_CHARS = 1_000_000;

export default function FileAttachment({ knowledgeFile, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [readError, setReadError] = useState<string | null>(null);
  const inputId = `file-attachment-${knowledgeFile.name.replace(/\s+/g, '-').toLowerCase()}`;

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <label htmlFor={inputId} style={{ fontWeight: 500, fontSize: '0.9rem' }}>
          {knowledgeFile.name}
        </label>
        {knowledgeFile.required && (
          <span aria-hidden="true" style={{ color: '#c00', fontSize: '0.85rem' }}>*</span>
        )}
      </div>

      {knowledgeFile.guidance && (
        <span style={{ color: '#555', fontSize: '0.82rem' }}>{knowledgeFile.guidance}</span>
      )}

      {!isAttached ? (
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept=".txt,.md,.csv,.text,text/*"
          onChange={handleFileChange}
          style={{ fontSize: '0.85rem' }}
        />
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#2a7a2a' }}>
            ✓ Attached
          </span>
          <button
            type="button"
            onClick={handleRemove}
            style={{
              fontSize: '0.8rem',
              background: 'none',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '0.1rem 0.4rem',
              cursor: 'pointer',
              color: '#555',
            }}
          >
            Remove
          </button>
        </div>
      )}

      {readError && (
        <span
          role="alert"
          style={{ fontSize: '0.82rem', color: '#c00' }}
        >
          {readError}
        </span>
      )}

      <span style={{ fontSize: '0.78rem', color: '#777' }}>
        This file stays on your device. If you refresh the page, you&apos;ll need to attach it again.
      </span>
    </div>
  );
}
