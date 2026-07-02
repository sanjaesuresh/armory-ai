'use client';

import { useState } from 'react';

interface Props {
  label: string;
  content: string;
  /** When true, removes outer border and border-radius (for use inside BundleTabs). */
  embedded?: boolean;
  /** Called once per successful clipboard write. Use for analytics. */
  onCopySuccess?: () => void;
}

type CopyStatus = 'idle' | 'copied' | 'failed';

export default function CopyBlock({ label, content, embedded = false, onCopySuccess }: Props) {
  const [status, setStatus] = useState<CopyStatus>('idle');

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2000);
      onCopySuccess?.();
    } catch {
      setStatus('failed');
    }
  }

  return (
    <div
      data-testid="copy-block"
      style={{
        border: embedded ? 'none' : '1px solid #e5e5e5',
        borderRadius: embedded ? 0 : '6px',
        overflow: 'hidden',
      }}
    >
      {/* Label row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1rem',
          background: '#f5f5f5',
          borderBottom: '1px solid #e5e5e5',
        }}
      >
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#1a1a1a',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {label}
        </span>

        <button
          data-testid="copy-btn"
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${label} to clipboard`}
          style={{
            padding: '0.35rem 0.85rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            background: status === 'copied' ? '#2d6a4f' : '#1a1a1a',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'system-ui, sans-serif',
            transition: 'background 0.15s',
            flexShrink: 0,
          }}
        >
          {status === 'copied' ? 'Copied!' : status === 'failed' ? 'Failed' : 'Copy'}
        </button>
      </div>

      {/* Content area */}
      {status === 'failed' ? (
        <div style={{ padding: '0.75rem 1rem' }}>
          <p
            style={{
              margin: '0 0 0.5rem',
              fontSize: '0.8rem',
              color: '#b91c1c',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Could not write to clipboard. Select the text to copy manually.
          </p>
          <textarea
            data-testid="copy-block-content"
            readOnly
            value={content}
            rows={8}
            aria-label={`${label} content`}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              fontFamily: 'ui-monospace, Menlo, monospace',
              fontSize: '0.8rem',
              lineHeight: 1.6,
              color: '#1a1a1a',
              background: '#fff',
              border: '1px solid #e5e5e5',
              borderRadius: '4px',
              padding: '0.75rem',
              resize: 'vertical',
              userSelect: 'all',
            }}
          />
        </div>
      ) : (
        <pre
          data-testid="copy-block-content"
          aria-label={`${label} content`}
          style={{
            margin: 0,
            padding: '0.75rem 1rem',
            maxHeight: '280px',
            overflowY: 'auto',
            fontFamily: 'ui-monospace, Menlo, monospace',
            fontSize: '0.8rem',
            lineHeight: 1.6,
            color: '#1a1a1a',
            background: '#fff',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {content}
        </pre>
      )}
    </div>
  );
}
