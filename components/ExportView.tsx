'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useExportSetup, savePlanChoice, saveExportChoice } from './useExportSetup';
import BundleTabs from './BundleTabs';
import { recordExportEvent } from '@/lib/analytics/exportEvents';
import { targetLabel } from '@/lib/export/targets';
import type { ExportBlock } from '@/lib/export/claudeApp';
import type { ChatGptBranch } from '@/lib/export/chatGpt';
import type { Setup, ExportTarget } from '@/lib/setup/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type PlanChoice = 'pro' | 'free' | null;

interface Props {
  setup: Setup;
  /** Whether a user session exists — enables the stored-file export fallback. */
  signedIn?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildBundleMd(blocks: ExportBlock[], slug: string): string {
  const header = `# Armory Bundle, ${slug}\n\n`;
  const sections = blocks
    .map((b) => `## ${b.label}\n\n${b.content}`)
    .join('\n\n---\n\n');
  return header + sections;
}

function triggerDownload(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown; charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ExportView({ setup, signedIn = false }: Props) {
  const showTargetPicker = setup.targets.length > 1;
  const [target, setTarget] = useState<ExportTarget>(setup.targets[0] ?? 'claude-app');
  const [chatGptBranch, setChatGptBranch] = useState<ChatGptBranch>('custom-gpt');
  const phase = useExportSetup(setup, target, chatGptBranch, signedIn);
  const [planChoice, setPlanChoice] = useState<PlanChoice>(null);

  function chooseTarget(next: ExportTarget) {
    setTarget(next);
    // Only persist chatGptBranch for the ChatGPT target; omit it for all others.
    saveExportChoice(next, next === 'chatgpt' ? chatGptBranch : undefined);
  }

  function chooseChatGptBranch(next: ChatGptBranch) {
    setChatGptBranch(next);
    saveExportChoice('chatgpt', next);
  }

  // ── Loading / compiling ────────────────────────────────────────────────────

  if (phase.kind === 'loading' || phase.kind === 'compiling') {
    return (
      <div className="wrap" style={{ paddingTop: '48px', paddingBottom: '72px' }}>
        <p className="muted" style={{ fontSize: '0.95rem' }}>
          {phase.kind === 'compiling' ? 'Preparing your export…' : 'Loading…'}
        </p>
      </div>
    );
  }

  // ── Invalid session — start over ──────────────────────────────────────────

  if (phase.kind === 'invalid') {
    return (
      <div className="wrap" style={{ paddingTop: '48px', paddingBottom: '72px' }}>
        <p style={{ marginBottom: '1rem' }}>
          We couldn&apos;t find your answers &mdash; start again from the catalog.
        </p>
        <Link href="/professionals" className="btn btn-outline">
          Browse setups
        </Link>
      </div>
    );
  }

  // ── API / compile error ────────────────────────────────────────────────────

  if (phase.kind === 'error') {
    return (
      <div className="wrap" style={{ paddingTop: '48px', paddingBottom: '72px' }}>
        <p style={{ color: 'var(--bad)', marginBottom: '0.75rem' }}>
          Something went wrong: {phase.message}
        </p>
        <Link href="/professionals" className="btn btn-outline">
          Browse setups
        </Link>
      </div>
    );
  }

  // ── Over-limit — blocking message, no copy blocks ──────────────────────────

  if (phase.kind === 'overlimit') {
    return (
      <div className="wrap" style={{ paddingTop: '48px', paddingBottom: '72px' }}>
        <Link
          href={`/setup/${phase.slug}`}
          className="back-link"
          style={{ marginBottom: '24px' }}
        >
          ← Back to setup
        </Link>
        <div
          data-testid="overlimit-message"
          style={{
            padding: '20px 24px',
            background: 'var(--bad-tint)',
            border: '1px solid var(--bad)',
            borderRadius: 'var(--r-md)',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--bad)',
              margin: '0 0 8px',
            }}
          >
            Your setup exceeds the {targetLabel(phase.target)} limit
          </h2>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {phase.errors.map((e, i) => (
              <li key={i} style={{ fontSize: '0.9rem', color: 'var(--bad)', marginBottom: '4px' }}>
                {e.message}
              </li>
            ))}
          </ul>
        </div>
        <Link href={`/setup/${phase.slug}/customize`} className="btn btn-primary">
          Edit your setup
        </Link>
      </div>
    );
  }

  // ── Happy path ─────────────────────────────────────────────────────────────

  const { slug, blocks, answers, storedFiles } = phase;
  const brandName =
    typeof answers.brandName === 'string' && answers.brandName.trim()
      ? answers.brandName.trim()
      : undefined;

  const knowledgeBlocks = blocks.filter((b) => b.kind === 'knowledge');

  function handleDownload() {
    const content = buildBundleMd(blocks, slug);
    triggerDownload(content, `armory-${slug}-bundle.md`);
  }

  return (
    <div className="wrap">
      {/* Back link */}
      <Link href={`/setup/${slug}`} className="back-link">
        ← Back to setup
      </Link>

      {/* Page heading */}
      <h1 style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.4rem)', marginBottom: '4px' }}>
        Export to {targetLabel(target)}
      </h1>
      <p className="muted" style={{ maxWidth: '42em', margin: '0 0 0 0' }}>
        Your <strong style={{ color: 'var(--ink)' }}>{setup.name}</strong> setup is ready. Copy
        each block into {targetLabel(target)}, the walkthrough shows exactly where everything
        goes.
      </p>

      {/* Stored-copy note: a knowledge file was filled from the user's saved copy
          because there was no fresh in-browser attachment this session. */}
      {storedFiles && storedFiles.length > 0 && (
        <div className="info-note" role="status" data-testid="stored-copy-note" style={{ marginTop: 16 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none', marginTop: 1 }}>
            <path d="M6.5 3.5h7L18.5 8v11.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1z" />
            <path d="M13.5 3.5V8h4.5" />
          </svg>
          <div style={{ flex: 1 }}>
            {storedFiles.map((f) => (
              <div key={f.name}>
                Using your saved file <strong>{f.name}</strong> from{' '}
                {new Date(f.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3-column layout */}
      <div className="export-layout">

        {/* ── Left: what's included ──────────────────────────────────────── */}
        <aside className="export-panel-card">
          <span className="eyebrow">What&apos;s included</span>
          <ul className="side-checklist" style={{ marginTop: '8px' }}>
            <li>
              <CheckIcon />
              <div>
                <strong>Custom instructions</strong>
                <span>Compiled from your answers</span>
              </div>
            </li>
            {knowledgeBlocks.map((b, i) => (
              <li key={i}>
                <CheckIcon />
                <div>
                  <strong>Knowledge file</strong>
                  <span>{b.label}</span>
                </div>
              </li>
            ))}
            <li>
              <CheckIcon />
              <div>
                {target === 'claude-code' ? (
                  <>
                    <strong>Project memory</strong>
                    <span>CLAUDE.md file for your Claude Code project</span>
                  </>
                ) : target === 'chatgpt' ? (
                  <>
                    <strong>GPT configuration</strong>
                    <span>Name and settings for your Custom GPT</span>
                  </>
                ) : (
                  <>
                    <strong>Project configuration</strong>
                    <span>Name and layout for Claude Projects</span>
                  </>
                )}
              </div>
            </li>
          </ul>
          <p style={{ marginTop: '16px' }}>
            <span className="trust-cue" data-testid="trust-cue">
              <ShieldIcon />
              Curated setups are reviewed by the Armory team.
            </span>
          </p>
        </aside>

        {/* ── Center: bundle preview + plan branch ──────────────────────── */}
        <section>
          {/* Bundle tabs — one per block + Project settings */}
          <BundleTabs
            blocks={blocks}
            setup={setup}
            brandName={brandName}
            onCopySuccess={() => {
              void recordExportEvent({
                kind: 'copy',
                setupSlug: slug,
                target,
                // branch is the Claude Projects plan choice (pro/free); ChatGPT
                // and Claude Code have no plan branch in the analytics enum.
                branch: target === 'claude-app' ? planChoice : null,
              });
            }}
          />

          {/* Claude Projects plan branch (Pro / free) */}
          {target === 'claude-app' && (
            <>
              <div className="plan-ask">
                <p className="q">Do you have Claude Pro?</p>
                <p className="hint">
                  Claude Pro unlocks Projects, which save your setup permanently. On the free tier
                  you can still paste the instructions into any conversation.
                </p>
                <div className="seg" role="group" aria-label="Claude plan">
                  <button
                    type="button"
                    aria-pressed={planChoice === 'pro'}
                    onClick={() => { setPlanChoice('pro'); savePlanChoice('pro'); }}
                  >
                    Yes, I have Pro
                  </button>
                  <button
                    type="button"
                    aria-pressed={planChoice === 'free'}
                    onClick={() => { setPlanChoice('free'); savePlanChoice('free'); }}
                  >
                    No, free plan
                  </button>
                </div>
              </div>

              {planChoice === 'pro' && (
                <div>
                  <p className="muted small" style={{ marginBottom: '14px' }}>
                    Great, your setup becomes a permanent Claude Project. The walkthrough takes
                    about two minutes.
                  </p>
                  <Link href="/install" className="btn btn-primary btn-lg">
                    Install in Claude, step by step <ArrowRightIcon />
                  </Link>
                </div>
              )}

              {planChoice === 'free' && (
                <div>
                  <ol
                    style={{
                      margin: '0 0 16px',
                      paddingLeft: '20px',
                      color: 'var(--ink-soft)',
                      fontSize: '0.94rem',
                      display: 'grid',
                      gap: '8px',
                    }}
                  >
                    <li>
                      Copy the <strong>Custom instructions</strong> block above and paste it at the
                      start of a new Claude conversation.
                    </li>
                    <li>
                      Paste the <strong>knowledge-file content</strong> in the same message, right
                      after the instructions.
                    </li>
                    <li>
                      Send your first request in that same conversation, your setup is live for the
                      whole chat.
                    </li>
                  </ol>
                </div>
              )}
            </>
          )}

          {/* Claude Code install CTA */}
          {target === 'claude-code' && (
            <div data-testid="claude-code-install-cta">
              <p className="muted small" style={{ marginBottom: '14px' }}>
                Copy the <strong style={{ color: 'var(--ink)' }}>Project memory</strong> block
                into your project&apos;s <strong style={{ color: 'var(--ink)' }}>CLAUDE.md</strong>,
                add any knowledge files to the project directory, then start a conversation, Claude
                Code picks it all up automatically.
              </p>
              <Link
                href="/install"
                className="btn btn-primary btn-lg"
                data-testid="claude-code-install-link"
                onClick={() => saveExportChoice('claude-code')}
              >
                Install in Claude Code, step by step <ArrowRightIcon />
              </Link>
            </div>
          )}

          {/* ChatGPT builder branch (Custom GPT / Custom Instructions) */}
          {target === 'chatgpt' && (
            <>
              <div className="plan-ask" data-testid="chatgpt-branch-ask">
                <p className="q">How will you set up ChatGPT?</p>
                <p className="hint">
                  A Custom GPT keeps your instructions and files together and is reusable. No Custom
                  GPT? Paste everything into ChatGPT&apos;s Custom Instructions instead.
                </p>
                <div className="seg" role="group" aria-label="ChatGPT setup method">
                  <button
                    type="button"
                    aria-pressed={chatGptBranch === 'custom-gpt'}
                    onClick={() => chooseChatGptBranch('custom-gpt')}
                  >
                    Build a Custom GPT
                  </button>
                  <button
                    type="button"
                    aria-pressed={chatGptBranch === 'no-builder'}
                    onClick={() => chooseChatGptBranch('no-builder')}
                  >
                    Use Custom Instructions
                  </button>
                </div>
              </div>

              <div>
                <p className="muted small" style={{ marginBottom: '14px' }}>
                  {chatGptBranch === 'custom-gpt'
                    ? 'Great, your setup becomes a reusable Custom GPT. The walkthrough takes about two minutes.'
                    : "No problem, you'll paste everything into ChatGPT's Custom Instructions, with any knowledge included inline."}
                </p>
                <Link
                  href="/install"
                  className="btn btn-primary btn-lg"
                  data-testid="chatgpt-install-link"
                  onClick={() => saveExportChoice('chatgpt', chatGptBranch)}
                >
                  Install in ChatGPT, step by step <ArrowRightIcon />
                </Link>
              </div>
            </>
          )}
        </section>

        {/* ── Right: export options + download ──────────────────────────── */}
        <aside className="export-panel-card">
          <span className="eyebrow">
            {showTargetPicker ? 'Where will you use this?' : 'Export target'}
          </span>
          {showTargetPicker ? (
            <div role="radiogroup" aria-label="Export target" data-testid="target-picker" style={{ marginTop: '8px' }}>
              {setup.targets.includes('claude-app') && (
                <label className="option-card" data-testid="target-claude-app">
                  <input
                    type="radio"
                    name="target"
                    checked={target === 'claude-app'}
                    onChange={() => chooseTarget('claude-app')}
                  />
                  <strong>
                    Claude Projects <span className="rec">Recommended</span>
                  </strong>
                  <p>
                    A permanent home for your setup, instructions and files stay attached to every
                    conversation.
                  </p>
                </label>
              )}
              {setup.targets.includes('chatgpt') && (
                <label className="option-card" data-testid="target-chatgpt">
                  <input
                    type="radio"
                    name="target"
                    checked={target === 'chatgpt'}
                    onChange={() => chooseTarget('chatgpt')}
                  />
                  <strong>ChatGPT</strong>
                  <p>
                    The same setup in ChatGPT&apos;s format, a reusable Custom GPT, or pasted into
                    Custom Instructions.
                  </p>
                </label>
              )}
              {setup.targets.includes('claude-code') && (
                <label className="option-card" data-testid="target-claude-code">
                  <input
                    type="radio"
                    name="target"
                    checked={target === 'claude-code'}
                    onChange={() => chooseTarget('claude-code')}
                  />
                  <strong>Claude Code</strong>
                  <p>
                    Paste the instructions into your project&apos;s CLAUDE.md memory file, active
                    in every Claude Code conversation inside that project.
                  </p>
                </label>
              )}
            </div>
          ) : (
            <>
              <label className="option-card" style={{ marginTop: '8px' }}>
                <input type="radio" name="target" defaultChecked />
                <strong>
                  Claude Projects <span className="rec">Recommended</span>
                </strong>
                <p>
                  A permanent home for your setup, instructions and files stay attached to every
                  conversation.
                </p>
              </label>
              <div className="option-card disabled" aria-disabled="true">
                <strong>
                  ChatGPT Custom Instructions{' '}
                  <span className="status status-soon" style={{ fontSize: '0.68rem' }}>
                    Coming soon
                  </span>
                </strong>
                <p>The same setup, exported in ChatGPT&apos;s format. On the roadmap as the fast-follow.</p>
              </div>
            </>
          )}
          <button
            type="button"
            className="btn btn-outline"
            data-testid="download-btn"
            onClick={handleDownload}
            style={{ width: '100%', marginTop: '10px' }}
          >
            <DownloadIcon /> Download bundle (.md)
          </button>
          <p className="small muted" style={{ marginTop: '18px' }}>
            Armory never runs your assistant. Once exported, this setup works without us.
          </p>
        </aside>

      </div>
    </div>
  );
}
