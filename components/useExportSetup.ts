'use client';

import { useState, useEffect } from 'react';
import { compileSetup } from '@/lib/setup/compiler';
import { toClaudeAppExport } from '@/lib/export/claudeApp';
import type { ClaudeAppExport } from '@/lib/export/claudeApp';
import { toChatGptExport, type ChatGptBranch } from '@/lib/export/chatGpt';
import { validateCompiledForTarget } from '@/lib/setup/validator';
import type { CompiledSetup, Setup, Answers, ExportTarget } from '@/lib/setup/types';

// ─── Phase type ───────────────────────────────────────────────────────────────

export type Phase =
  | { kind: 'loading' }
  | { kind: 'invalid' }
  | { kind: 'compiling' }
  | { kind: 'overlimit'; slug: string; target: ExportTarget; errors: Array<{ code: string; message: string; path: string }> }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; slug: string; target: ExportTarget; blocks: ClaudeAppExport['blocks']; answers: Record<string, unknown> };

// ─── Plan choice persistence ──────────────────────────────────────────────────

/**
 * Persists the walkthrough plan choice into the existing armory-export-state
 * sessionStorage entry so InstallView can read the branch when firing the
 * done event. No-ops silently if the session entry is absent or unparseable.
 */
export function savePlanChoice(choice: 'pro' | 'free' | null): void {
  try {
    const raw = sessionStorage.getItem('armory-export-state');
    if (!raw) return;
    const state = JSON.parse(raw) as Record<string, unknown>;
    sessionStorage.setItem(
      'armory-export-state',
      JSON.stringify({ ...state, planChoice: choice }),
    );
  } catch {
    // ignore — analytics must never disrupt the export flow
  }
}

/**
 * Persists the chosen export target and (for ChatGPT) the builder branch into
 * the armory-export-state entry so InstallView renders the matching walkthrough.
 * No-ops silently if the session entry is absent or unparseable.
 */
export function saveExportChoice(
  target: ExportTarget,
  chatGptBranch: ChatGptBranch,
): void {
  try {
    const raw = sessionStorage.getItem('armory-export-state');
    if (!raw) return;
    const state = JSON.parse(raw) as Record<string, unknown>;
    sessionStorage.setItem(
      'armory-export-state',
      JSON.stringify({ ...state, target, chatGptBranch }),
    );
  } catch {
    // ignore — analytics must never disrupt the export flow
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Handles all data loading for the export page:
 * sessionStorage parse → slug validate → compileSetup (client-side, pure) →
 * inject attachments → validateCompiledForTarget → build export blocks.
 *
 * The compiler is pure and deterministic, so there is no server call: nothing
 * (answers or attachment content) leaves the browser from the export page.
 * Attachment content is injected client-side.
 */
export function useExportSetup(
  setup: Setup,
  target: ExportTarget = 'claude-app',
  chatGptBranch: ChatGptBranch = 'custom-gpt',
): Phase {
  const [phase, setPhase] = useState<Phase>({ kind: 'loading' });

  useEffect(() => {
    // 1. Read sessionStorage
    let raw: string | null = null;
    try {
      raw = sessionStorage.getItem('armory-export-state');
    } catch {
      setPhase({ kind: 'invalid' });
      return;
    }

    if (!raw) {
      setPhase({ kind: 'invalid' });
      return;
    }

    let parsed: {
      slug: string;
      answers: Record<string, unknown>;
      attachments?: Record<string, string>;
    };
    try {
      parsed = JSON.parse(raw);
    } catch {
      setPhase({ kind: 'invalid' });
      return;
    }

    const { slug, answers, attachments = {} } = parsed;

    // 2. Verify slug matches the resolved setup
    if (!slug || slug !== setup.slug) {
      setPhase({ kind: 'invalid' });
      return;
    }

    // 3. Compile client-side (pure, deterministic — no network call)
    let compiled: CompiledSetup;
    try {
      compiled = compileSetup(setup, answers as Answers);
    } catch (err) {
      setPhase({
        kind: 'error',
        message: err instanceof Error ? err.message : String(err),
      });
      return;
    }

    // 4. Inject attachment content into user-provided knowledge files by name
    const compiledWithInjected: CompiledSetup = {
      ...compiled,
      knowledgeFiles: compiled.knowledgeFiles.map((file) => ({
        ...file,
        content:
          typeof attachments[file.name] === 'string'
            ? (attachments[file.name] as string)
            : file.content,
      })),
    };

    // 5. Client-side validation against the chosen target's limits
    const validation = validateCompiledForTarget(compiledWithInjected, target);
    if (!validation.valid) {
      setPhase({ kind: 'overlimit', slug, target, errors: validation.errors });
      return;
    }

    // 6. Build export blocks — filter out knowledge files with no content
    //    (optional user-provided files with no attachment are dropped)
    const compiledForExport: CompiledSetup = {
      ...compiledWithInjected,
      knowledgeFiles: compiledWithInjected.knowledgeFiles.filter(
        (f) => f.content.trim() !== '',
      ),
    };
    const blocks =
      target === 'chatgpt'
        ? toChatGptExport(compiledForExport, chatGptBranch).blocks
        : toClaudeAppExport(compiledForExport).blocks;

    setPhase({ kind: 'ready', slug, target, blocks, answers });
  }, [setup, target, chatGptBranch]);

  return phase;
}
