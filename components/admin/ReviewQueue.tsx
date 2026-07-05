'use client';

/**
 * ReviewQueue — client component for the moderator review queue.
 *
 * Renders the pending-submission list with "Needs attention" flags, a detail
 * view (safety findings + compiled/registry preview), and approve / reject-with-note
 * controls. Calls POST /api/admin/moderate; the route re-checks moderator
 * status server-side via NotModeratorError.
 *
 * Never imports server-only modules (createSupabaseServiceClient, moderation
 * functions). All privileged operations happen in the API route.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SetupKind, ArtifactFile, Capability } from '@/lib/setup/types';
import { isRegistryKind } from '@/lib/setup/types';
import KindBadge from '@/components/KindBadge';
import ArtifactFileViewer from '@/components/registry/ArtifactFileViewer';

// ─── Types (shared with the server page) ──────────────────────────────────────

export interface FindingData {
  pass: 'rules' | 'model';
  code: string;
  message: string;
  path: string;
}

/** Per-scenario evidence from the generation pipeline's own-scenario evals. */
export interface EvalEntry {
  scenarioId: string;
  pass: boolean;
  /** Short snippet of model output (≤280 chars) authored during the eval run. */
  outputSnippet: string;
}

/** Brief + per-scenario eval evidence stored in generation_meta on ai-generated rows. */
export interface GenerationMeta {
  brief: {
    kind: 'gap-fill' | 'variation';
    role: string;
    industry: string | null;
    goalTags: string[];
    /** Only on variation briefs. */
    sourceSlug?: string;
    /** Only on variation briefs. */
    vary?: string;
  };
  evals: EvalEntry[];
}

export interface QueueItemData {
  id: string;
  name: string;
  author: string | null;
  submittedAt: string; // formatted string, e.g. "3 days ago"
  needsAttention: boolean;
  findings: FindingData[];
  /**
   * Compiled instruction preview — populated only for setup kind. Empty string
   * for registry kinds (they use the registry preview block instead).
   */
  compiledInstruction: string;
  /** The setup's source value; determines badge and eval-report visibility. */
  source: 'curated' | 'community' | 'ai-generated';
  /** Present only for ai-generated rows that passed the pipeline gauntlet. */
  generationMeta?: GenerationMeta;
  // ── Phase 8: kind + registry fields ───────────────────────────────────────
  /** Discriminator — 'setup' for all pre-Phase-8 items; agent/skill/harness for registry. */
  kind: SetupKind;
  /** Human-readable description — shown in the registry preview for moderators. */
  description: string;
  /** CLI/slash-command capabilities — shown under "What it does" for registry items. */
  capabilities: Capability[];
  /** Bundled artifact files — shown in ArtifactFileViewer for registry items. */
  artifactFiles: ArtifactFile[];
  /** GitHub HTTPS URL, or null. */
  repoUrl: string | null;
}

// ─── Inline icon SVGs ─────────────────────────────────────────────────────────

function AlertIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flex: 'none', marginTop: 1 }}
    >
      <path d="M12 4 2.8 19.5h18.4z" />
      <path d="M12 10v4.5M12 17.2v.1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flex: 'none', marginTop: 1 }}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function GitBranchIcon() {
  return (
    <svg
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
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 01-9 9" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  items: QueueItemData[];
}

export default function ReviewQueue({ items }: Props) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // ── Empty state ──────────────────────────────────────────────────────────────

  if (items.length === 0) {
    return (
      <div className="empty" data-testid="review-queue-empty">
        <svg
          width="80"
          height="64"
          viewBox="0 0 80 64"
          fill="none"
          stroke="#4f483c"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <ellipse cx="40" cy="56" rx="26" ry="4" fill="#f3ede2" stroke="none" />
          <rect x="12" y="10" width="56" height="38" rx="8" fill="#fff" />
          <path d="M24 24h32M24 32h20" />
        </svg>
        <h3>Queue is clear</h3>
        <p>No pending submissions at the moment. Check back later.</p>
      </div>
    );
  }

  // Clamp selected index in case items changed (e.g., after a successful action).
  const clampedIndex = Math.min(selectedIndex, items.length - 1);
  const selected = items[clampedIndex];

  // ── Action handler ───────────────────────────────────────────────────────────

  async function handleAction(action: 'approve' | 'reject' | 'takedown') {
    const trimmedNote = note.trim();
    if ((action === 'reject' || action === 'takedown') && !trimmedNote) return;

    setBusy(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setupId: selected.id,
          action,
          note: trimmedNote || undefined,
        }),
      });

      let data: { ok: boolean; error?: string };
      try {
        data = (await res.json()) as { ok: boolean; error?: string };
      } catch {
        data = { ok: false, error: 'Unexpected response from server.' };
      }

      if (!data.ok) {
        setActionError(data.error ?? 'Action failed. Try again.');
        setBusy(false);
        return;
      }

      const successMsg =
        action === 'approve'
          ? 'Approved and published.'
          : action === 'reject'
            ? 'Rejected — note sent to the author.'
            : 'Taken down — note sent to the author.';
      setActionSuccess(successMsg);
      setNote('');
      setBusy(false);
      router.refresh();
    } catch {
      setActionError('Network error. Please try again.');
      setBusy(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Queue list ────────────────────────────────────────────────────────── */}
      <div role="list" aria-label="Pending submissions">
        {items.map((item, idx) => {
          const isSelected = idx === clampedIndex;
          const flagCount = item.findings.length;

          return (
            <div
              key={item.id}
              className="queue-item"
              role="listitem"
              style={item.needsAttention ? { borderColor: 'var(--peach)' } : undefined}
              data-testid={`queue-item-${item.id}`}
            >
              <span
                className="icon-badge"
                style={{
                  background: item.needsAttention ? 'var(--peach)' : 'var(--sky)',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                {item.needsAttention ? <AlertIcon /> : <CalendarIcon />}
              </span>

              <div className="lib-body" style={{ flex: 1, minWidth: 0 }}>
                <strong>
                  {item.name}
                  {' '}
                  <KindBadge kind={item.kind} />
                  {item.needsAttention && (
                    <span className="flag" style={{ marginLeft: 8 }}>
                      Needs attention
                    </span>
                  )}
                </strong>
                <span>
                  by author {item.author ? `${item.author.slice(0, 8)}…` : 'unknown'} &middot;{' '}
                  submitted {item.submittedAt} &middot;{' '}
                  {flagCount > 0
                    ? `safety screen flagged ${flagCount} concern${flagCount !== 1 ? 's' : ''}`
                    : 'safety screen clean'}
                </span>
              </div>

              <button
                type="button"
                className={isSelected ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                onClick={() => {
                  setSelectedIndex(idx);
                  setNote('');
                  setActionError(null);
                  setActionSuccess(null);
                }}
                aria-pressed={isSelected}
                data-testid={`review-btn-${item.id}`}
              >
                Review
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Detail view ───────────────────────────────────────────────────────── */}
      <section
        className="form-card"
        style={{ marginTop: 28 }}
        aria-labelledby="review-detail-name"
        data-testid="review-detail"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <h2 id="review-detail-name" style={{ margin: 0 }}>
            {selected.name}
          </h2>
          {selected.source === 'ai-generated' ? (
            <span className="badge badge-ai" data-testid="detail-badge-ai">
              AI-generated &middot; pipeline
            </span>
          ) : (
            <span className="badge badge-community">
              Community &middot; author{' '}
              {selected.author ? `${selected.author.slice(0, 8)}…` : 'unknown'}
            </span>
          )}
        </div>

        {/* Safety findings */}
        <h3
          style={{
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            margin: '20px 0 10px',
          }}
        >
          Safety screen findings
        </h3>

        {selected.findings.length === 0 ? (
          <div className="finding finding-ok" data-testid="finding-clean">
            <CheckIcon />
            <div>
              <strong>Clean.</strong> No concerns detected by the safety screen.
            </div>
          </div>
        ) : (
          selected.findings.map((f, i) => (
            <div
              key={i}
              className="finding finding-flag"
              data-testid={`finding-${i}`}
            >
              <AlertIcon />
              <div>
                <strong>
                  {f.pass === 'rules' ? 'Rules pass — flagged.' : 'Model pass — flagged.'}
                </strong>{' '}
                {f.message} Flagged for your judgment; not auto-rejected.
              </div>
            </div>
          ))
        )}

        {/* Generation brief + eval report — ai-generated rows only */}
        {selected.source === 'ai-generated' && selected.generationMeta && (
          <>
            {selected.generationMeta.brief && (
              <>
                <h3
                  style={{
                    fontSize: '0.8rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    margin: '24px 0 10px',
                  }}
                >
                  Generation brief
                </h3>
                <div className="finding finding-ok" data-testid="gen-brief">
                  <CheckIcon />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <strong>
                      {selected.generationMeta.brief.kind === 'variation' ? 'Variation' : 'Gap-fill'}
                      {' · '}{selected.generationMeta.brief.role}
                      {selected.generationMeta.brief.industry
                        ? ` · ${selected.generationMeta.brief.industry}`
                        : ''}
                    </strong>
                    {(selected.generationMeta.brief.goalTags?.length ?? 0) > 0 && (
                      <span>
                        Goal tags: {selected.generationMeta.brief.goalTags?.join(', ')}
                      </span>
                    )}
                    {selected.generationMeta.brief.kind === 'variation' &&
                      selected.generationMeta.brief.sourceSlug && (
                        <span>
                          Derived from: <code>{selected.generationMeta.brief.sourceSlug}</code>
                          {selected.generationMeta.brief.vary
                            ? ` · vary: ${selected.generationMeta.brief.vary}`
                            : ''}
                        </span>
                      )}
                  </div>
                </div>
              </>
            )}

            <h3
              style={{
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                margin: '24px 0 10px',
              }}
            >
              Scenario evals
            </h3>
            {(selected.generationMeta.evals?.length ?? 0) === 0 ? (
              <div
                className="finding finding-ok"
                data-testid="evals-none"
              >
                <CheckIcon />
                <div>No scenarios evaluated.</div>
              </div>
            ) : (
              (selected.generationMeta.evals ?? []).map((e, i) => (
                <div
                  key={i}
                  className={`finding ${e.pass ? 'finding-ok' : 'finding-flag'}`}
                  data-testid={`eval-${i}`}
                >
                  {e.pass ? <CheckIcon /> : <AlertIcon />}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <strong>
                      <code>{e.scenarioId}</code>
                      {' — '}
                      <span role="status">{e.pass ? 'Pass' : 'Fail'}</span>
                    </strong>
                    <span
                      style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}
                    >
                      {e.outputSnippet}
                    </span>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* Preview — setup: compiled instruction; registry: description + capabilities + repo + files */}
        <h3
          style={{
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            margin: '24px 0 10px',
          }}
        >
          {isRegistryKind(selected.kind) ? 'Registry preview' : 'Compiled preview (default answers)'}
        </h3>

        {isRegistryKind(selected.kind) ? (
          <div data-testid="registry-preview">
            {/* Description */}
            <p
              className="muted"
              style={{ fontSize: '1rem', margin: '0 0 20px', maxWidth: '46em' }}
            >
              {selected.description}
            </p>

            {/* Capabilities — hidden when empty (mirrors RegistryDetail) */}
            {selected.capabilities.length > 0 && (
              <section
                aria-labelledby="queue-capabilities-heading"
                style={{ marginBottom: 20 }}
              >
                <h4
                  id="queue-capabilities-heading"
                  style={{ fontSize: '1rem', marginBottom: 10 }}
                >
                  What it does
                </h4>
                <ul className="cap-list" aria-label="Capabilities">
                  {selected.capabilities.map((cap) => (
                    <li key={cap.command} className="cap-item">
                      <span className="cap-cmd">{cap.command}</span>
                      <div className="cap-body">
                        <p>{cap.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* GitHub repo link */}
            {selected.repoUrl && (
              <div style={{ marginBottom: 20 }}>
                <a
                  className="repo-link"
                  href={selected.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View on GitHub (opens in new tab)"
                >
                  <GitBranchIcon />
                  View on GitHub
                </a>
              </div>
            )}

            {/* Artifact files */}
            {selected.artifactFiles.length > 0 && (
              <ArtifactFileViewer
                files={selected.artifactFiles}
                slug={selected.id}
              />
            )}
          </div>
        ) : (
          <pre
            className="code"
            style={{
              border: '1px solid var(--hairline)',
              borderRadius: 10,
              maxHeight: 200,
              overflow: 'auto',
            }}
            data-testid="compiled-preview"
          >
            {selected.compiledInstruction}
          </pre>
        )}

        {/* Success banner */}
        {actionSuccess && (
          <div
            role="status"
            className="success-note"
            style={{ marginTop: 20 }}
            data-testid="action-success"
          >
            <CheckIcon />
            {actionSuccess}
          </div>
        )}

        {/* Error banner */}
        {actionError && (
          <div
            role="alert"
            className="error-banner"
            style={{ marginTop: 20 }}
            data-testid="action-error"
          >
            <AlertIcon />
            <div>
              <strong>{actionError}</strong>
            </div>
          </div>
        )}

        {/* Note field */}
        <div className="field" style={{ marginTop: 20 }}>
          <label htmlFor="modNote">
            Note to the author{' '}
            <span className="req" aria-hidden="true">*</span>{' '}
            <span className="muted" style={{ fontWeight: 600 }}>
              (required to reject — the author sees this verbatim)
            </span>
          </label>
          <textarea
            className="input"
            id="modNote"
            rows={3}
            placeholder="Explain what needs to change…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={busy}
            data-testid="mod-note"
          />
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void handleAction('approve')}
            disabled={busy}
            data-testid="btn-approve"
          >
            <CheckIcon />
            {busy ? 'Working…' : 'Approve & publish'}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => void handleAction('reject')}
            disabled={busy || !note.trim()}
            aria-disabled={busy || !note.trim()}
            data-testid="btn-reject"
          >
            {busy ? 'Working…' : 'Reject with note'}
          </button>
        </div>
      </section>
    </>
  );
}
