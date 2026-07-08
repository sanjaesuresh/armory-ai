'use client';

/**
 * RepoBrowser — lazy GitHub repo tree + README viewer for registry detail pages.
 *
 * Fetches the root listing from /api/repo-content on mount, finds the README,
 * and renders an expandable file tree. Folders fetch their children on first
 * expand (never re-fetched). Safe when repoUrl is null or the API is down.
 */

import { useState, useEffect } from 'react';
import { parseRepoUrl } from '@/lib/registry/repoContent';
import type { RepoEntry, RepoContent } from '@/lib/registry/repoContent';

// ── Icons ──────────────────────────────────────────────────────────────────────

function ChevronIcon() {
  return (
    <svg
      className="tchev"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      className="ticon"
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
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      className="ticon"
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
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function FileRowIcon() {
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

function ChevRowIcon() {
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

// safe fetch wrapper — returns null on any failure including fetch being undefined
async function fetchRepoPath(
  owner: string,
  repo: string,
  path: string,
): Promise<RepoContent | null> {
  try {
    // tolerate jsdom / test environments where fetch may not exist
    if (typeof fetch === 'undefined') return null;
    const qs = new URLSearchParams({ owner, repo, path });
    const res = await fetch(`/api/repo-content?${qs}`);
    if (!res.ok) return null;
    const json = (await res.json()) as { ok: boolean; content: RepoContent };
    if (!json.ok) return null;
    return json.content;
  } catch {
    return null;
  }
}

// ── TreeNode ──────────────────────────────────────────────────────────────────

interface TreeNodeProps {
  entry: RepoEntry;
  owner: string;
  repo: string;
  depth: number;
}

function TreeNode({ entry, owner, repo, depth }: TreeNodeProps) {
  const [open, setOpen] = useState(false);
  // null = not yet fetched, [] = fetched empty, array = children
  const [children, setChildren] = useState<RepoEntry[] | null>(null);
  const [loading, setLoading] = useState(false);

  // indent mirrors the mock: 14px base + 24px per depth level
  const paddingLeft = 14 + depth * 24;

  async function handleToggle() {
    if (entry.type !== 'dir') return;
    const next = !open;
    setOpen(next);
    // only fetch on first open
    if (next && children === null) {
      setLoading(true);
      const content = await fetchRepoPath(owner, repo, entry.path);
      if (content && content.type === 'dir') {
        setChildren(content.entries);
      } else {
        // fetch failed or returned unexpected type — treat as empty
        setChildren([]);
      }
      setLoading(false);
    }
  }

  if (entry.type === 'dir') {
    return (
      <>
        <div className={`tnode dir${open ? ' open' : ''}`} style={{ paddingLeft }}>
          <button
            type="button"
            className="tnode-btn"
            onClick={handleToggle}
            aria-expanded={open}
            aria-label={open ? `Collapse folder ${entry.name}` : `Expand folder ${entry.name}`}
          >
            <ChevronIcon />
            <FolderIcon />
            <span className="tname">{entry.name}</span>
          </button>
        </div>
        {open && (
          <div className="tchildren show" role="group" aria-label={`Contents of ${entry.name}`}>
            {loading && (
              <div className="tnode file" style={{ paddingLeft: paddingLeft + 24, color: 'var(--muted)' }}>
                <span aria-live="polite">…</span>
              </div>
            )}
            {!loading && children && children.map((child) => (
              <TreeNode
                key={child.path}
                entry={child}
                owner={owner}
                repo={repo}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </>
    );
  }

  // file leaf
  return (
    <div className="tnode file" style={{ paddingLeft }}>
      {/* invisible chevron placeholder keeps alignment consistent */}
      <span className="tchev" style={{ width: 14, height: 14, flex: 'none', visibility: 'hidden' }} aria-hidden="true" />
      <FileIcon />
      <span className="tname">{entry.name}</span>
      {entry.size != null && (
        <span className="tmeta">{formatSize(entry.size)}</span>
      )}
    </div>
  );
}

// ── RepoBrowser ───────────────────────────────────────────────────────────────

interface Props {
  repoUrl: string | null;
}

export default function RepoBrowser({ repoUrl }: Props) {
  const parsed = parseRepoUrl(repoUrl);

  const [rootEntries, setRootEntries] = useState<RepoEntry[] | null>(null);
  const [rootLoading, setRootLoading] = useState(false);
  // null = not looked for yet; '' = looked for, not found; string = content
  const [readmeText, setReadmeText] = useState<string | null>(null);
  const [readmeTruncated, setReadmeTruncated] = useState(false);

  useEffect(() => {
    // nothing to do without a valid github url
    if (!parsed) return;
    const { owner, repo } = parsed;

    let cancelled = false;

    async function load() {
      setRootLoading(true);
      const content = await fetchRepoPath(owner, repo, '');
      if (cancelled) return;

      if (!content || content.type !== 'dir' || content.entries.length === 0) {
        setRootLoading(false);
        return; // stay null → renders nothing
      }

      setRootEntries(content.entries);
      setRootLoading(false);

      // look for a readme file in root entries
      const readmeEntry = content.entries.find((e) =>
        e.type === 'file' && /^readme(\.md|\.markdown)?$/i.test(e.name),
      );
      if (!readmeEntry) return;

      const fileContent = await fetchRepoPath(owner, repo, readmeEntry.path);
      if (cancelled) return;
      if (fileContent && fileContent.type === 'file') {
        setReadmeText(fileContent.content);
        setReadmeTruncated(fileContent.truncated);
      }
    }

    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repoUrl]);

  // hide the entire section if parse failed or root fetch yielded nothing
  if (!parsed) return null;
  if (!rootLoading && rootEntries === null) return null;

  return (
    <section
      aria-labelledby="repo-browser-heading"
      style={{ marginTop: '40px' }}
    >
      {/* Section header: eyebrow label + github link */}
      <div className="shelf-head" style={{ margin: '0 0 14px', alignItems: 'center' }}>
        <p className="eyebrow" id="repo-browser-heading" style={{ margin: 0 }}>
          Repository
        </p>
        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="repo-tree-link"
          >
            View on GitHub ↗
          </a>
        )}
      </div>

      {/* README block — open by default, only shown when content is available */}
      {readmeText !== null && readmeText !== '' && (
        <details className="file-row" open>
          <summary>
            <span className="fname">
              <FileRowIcon />
              README.md
            </span>
            <span className="fmeta">readme · markdown</span>
            <ChevRowIcon />
          </summary>
          <div className="file-body expanded">
            {readmeTruncated ? (
              <p style={{ margin: 0, padding: '12px 16px', fontSize: '0.8rem', color: 'var(--muted)' }}>
                Large file, {' '}
                <a href={repoUrl ?? undefined} target="_blank" rel="noopener noreferrer">
                  view on GitHub
                </a>
              </p>
            ) : (
              <pre className="code">{readmeText}</pre>
            )}
          </div>
        </details>
      )}

      {/* Loading state */}
      {rootLoading && (
        <p className="muted" style={{ fontSize: '0.84rem', margin: '0 0 12px' }} aria-live="polite">
          Loading repository…
        </p>
      )}

      {/* Tree — role=tree on container; individual treenodes managed inside TreeNode */}
      {rootEntries !== null && rootEntries.length > 0 && (
        <div className="tree" role="tree" aria-label={`File tree for ${parsed.owner}/${parsed.repo}`}>
          {rootEntries.map((entry) => (
            <TreeNode
              key={entry.path}
              entry={entry}
              owner={parsed.owner}
              repo={parsed.repo}
              depth={0}
            />
          ))}
        </div>
      )}
    </section>
  );
}
