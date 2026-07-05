'use client';

/**
 * ArtifactFileViewer — raw-source file display for registry items.
 *
 * Primary file: `.fileview` block, collapsed to a fixed preview height,
 * with an Expand/Collapse toggle. Keyboard-operable with visible focus rings.
 *
 * Non-primary files: individually expandable `<details>` rows.
 *
 * Each file has a Copy button (clipboard write, transient "Copied" confirmation).
 * Footer: a Download button — single file downloads directly; multiple files
 * build a zip named after the slug using fflate (zero-dependency, browser-safe).
 */

import { useState } from 'react';
import type { ArtifactFile } from '@/lib/setup/types';

// ── Icons ─────────────────────────────────────────────────────────────────────

function CopyIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="chev"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function fileExtensionLabel(name: string): string {
  const ext = name.split('.').pop() ?? '';
  const labels: Record<string, string> = {
    md: 'markdown',
    markdown: 'markdown',
    json: 'JSON',
    yaml: 'YAML',
    yml: 'YAML',
    toml: 'TOML',
    txt: 'text',
    sh: 'shell',
  };
  return labels[ext] ?? ext;
}

function triggerDirectDownload(file: ArtifactFile): void {
  const blob = new Blob([file.content], { type: 'text/plain; charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name.split('/').pop() ?? file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function triggerZipDownload(files: ArtifactFile[], slug: string): Promise<void> {
  const { zip, strToU8 } = await import('fflate');

  const fileMap: Record<string, Uint8Array> = {};
  for (const f of files) {
    fileMap[f.name] = strToU8(f.content);
  }

  zip(fileMap, (err, data) => {
    if (err) {
      console.error('[ArtifactFileViewer] zip error:', err);
      return;
    }
    const blob = new Blob([data], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

// ── CopyButton ────────────────────────────────────────────────────────────────

interface CopyButtonProps {
  content: string;
  fileName: string;
  /**
   * Injectable clipboard writer. Defaults to `navigator.clipboard.writeText`.
   * Pass a mock in tests to avoid needing a global Clipboard API stub.
   */
  clipboardWriteFn?: (text: string) => Promise<void>;
}

function CopyButton({ content, fileName, clipboardWriteFn }: CopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied'>('idle');

  async function handleCopy() {
    const writeFn =
      clipboardWriteFn ??
      ((text: string) => navigator.clipboard.writeText(text));
    try {
      await writeFn(content);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      // Silently swallow — clipboard access can be denied in some contexts.
    }
  }

  return (
    <button
      type="button"
      className={`copy-btn${status === 'copied' ? ' copied' : ''}`}
      onClick={handleCopy}
      aria-label={status === 'copied' ? `Copied ${fileName}` : `Copy ${fileName}`}
      data-testid={`copy-btn-${fileName}`}
    >
      <CopyIcon />
      {status === 'copied' ? 'Copied' : 'Copy'}
    </button>
  );
}

// ── PrimaryFileView ───────────────────────────────────────────────────────────

interface PrimaryFileViewProps {
  file: ArtifactFile;
  clipboardWriteFn?: (text: string) => Promise<void>;
}

function PrimaryFileView({ file, clipboardWriteFn }: PrimaryFileViewProps) {
  const [expanded, setExpanded] = useState(false);
  const bodyId = `primary-file-body-${file.name.replace(/[^a-z0-9]/gi, '-')}`;

  return (
    <div className="fileview">
      <div className="file-head">
        <span className="fname">
          <FileIcon />
          {file.name}
          <span className="fmeta">· primary</span>
        </span>
        <div className="file-actions">
          <CopyButton
            content={file.content}
            fileName={file.name}
            clipboardWriteFn={clipboardWriteFn}
          />
          <button
            type="button"
            className="copy-btn"
            aria-expanded={expanded}
            aria-controls={bodyId}
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>
      <div
        id={bodyId}
        className={`file-body${expanded ? ' expanded' : ''}`}
      >
        <pre className="code">{file.content}</pre>
        {!expanded && <span className="file-fade" aria-hidden="true" />}
      </div>
    </div>
  );
}

// ── SecondaryFileRow ──────────────────────────────────────────────────────────

interface SecondaryFileRowProps {
  file: ArtifactFile;
  clipboardWriteFn?: (text: string) => Promise<void>;
}

function SecondaryFileRow({ file, clipboardWriteFn }: SecondaryFileRowProps) {
  const sizeLabel = formatSize(new TextEncoder().encode(file.content).byteLength);
  const extLabel = fileExtensionLabel(file.name);

  return (
    <details
      className="file-row"
      data-testid={`file-row-${file.name}`}
    >
      <summary>
        <span className="fname">
          <FileIcon />
          {file.name}
        </span>
        <span className="fmeta">{extLabel} · {sizeLabel}</span>
        <ChevronIcon />
      </summary>
      <div className="file-body">
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '8px 12px',
            borderBottom: '1px solid var(--hairline)',
            background: 'var(--oat)',
          }}
        >
          <CopyButton
            content={file.content}
            fileName={file.name}
            clipboardWriteFn={clipboardWriteFn}
          />
        </div>
        <pre className="code">{file.content}</pre>
      </div>
    </details>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  files: ArtifactFile[];
  /** Used as the zip archive name (slug.zip) for multi-file downloads. */
  slug: string;
  /**
   * Injectable clipboard writer. Defaults to navigator.clipboard.writeText.
   * Pass a mock in tests to avoid needing a global Clipboard API stub.
   */
  clipboardWriteFn?: (text: string) => Promise<void>;
}

// ── ArtifactFileViewer ────────────────────────────────────────────────────────

export default function ArtifactFileViewer({ files, slug, clipboardWriteFn }: Props) {
  const primary = files.find((f) => f.isPrimary) ?? files[0];
  const secondary = files.filter((f) => !f.isPrimary);
  const isMultiFile = files.length > 1;

  function handleDownload() {
    if (isMultiFile) {
      triggerZipDownload(files, slug);
    } else if (primary) {
      triggerDirectDownload(primary);
    }
  }

  return (
    <div>
      {/* Header row: file count + download control */}
      <div className="shelf-head" style={{ margin: '0 0 14px' }}>
        <h2 style={{ fontSize: '1.2rem' }}>
          Files{' '}
          <span className="muted" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
            ({files.length})
          </span>
        </h2>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={handleDownload}
          aria-label={
            isMultiFile
              ? `Download all ${files.length} files as a zip`
              : `Download ${primary?.name}`
          }
        >
          <DownloadIcon />
          {isMultiFile ? 'Download .zip' : 'Download file'}
        </button>
      </div>

      {/* Primary file */}
      {primary && (
        <PrimaryFileView file={primary} clipboardWriteFn={clipboardWriteFn} />
      )}

      {/* Non-primary files */}
      {secondary.map((file) => (
        <SecondaryFileRow
          key={file.name}
          file={file}
          clipboardWriteFn={clipboardWriteFn}
        />
      ))}
    </div>
  );
}
