/**
 * Claude Code export adapter.
 *
 * toClaudeCodeExport(compiled) → { blocks, walkthrough }
 *
 *   blocks     — Ordered array of { label, content, kind } ready for the user
 *                to paste into their Claude Code project. First the instruction
 *                block (the content for the project's CLAUDE.md memory file),
 *                then one block per knowledge file in declaration order.
 *
 *   walkthrough — Ordered steps describing how to configure a Claude Code project,
 *                 starting at stepNumber 1. Each step carries an imageKey (a
 *                 stable slug naming the screenshot asset) so the UI can attach
 *                 screenshots in a later task. The first step references Claude
 *                 Code installation rather than embedding a full product setup
 *                 guide — the audience already has Claude Code installed.
 */

import type { CompiledSetup } from '@/lib/setup/types';

// ─── Exported types ───────────────────────────────────────────────────────────
// Re-export from claudeApp so the walkthrough renderer's existing type imports
// continue to resolve unchanged.

export type { ExportBlock, WalkthroughStep } from './claudeApp';

import type { ExportBlock, WalkthroughStep } from './claudeApp';

export interface ClaudeCodeExport {
  blocks: ExportBlock[];
  walkthrough: WalkthroughStep[];
}

// ─── Walkthrough steps ───────────────────────────────────────────────────────
//
// Step order and imageKeys must stay stable so screenshot assets can be keyed
// against them. The file step is included only when the compiled setup has
// knowledge files — an instruction-only setup omits it with correct wording.

const PRE_FILE_STEPS: ReadonlyArray<Omit<WalkthroughStep, 'stepNumber'>> = [
  {
    title: 'Open your project in Claude Code',
    body: 'In your terminal, navigate to the project directory where you want this setup to apply, then run "claude" to start Claude Code. If you haven\'t installed Claude Code yet, visit the quickstart at docs.anthropic.com/en/docs/claude-code/quickstart first.',
    imageKey: 'claude-code-open-project',
  },
  {
    title: 'Paste the instructions into CLAUDE.md',
    body: 'In your project root, open or create the file CLAUDE.md (the project memory file). Copy the "Project memory (CLAUDE.md)" block below and paste it in, then save. Claude Code reads this file automatically before every conversation in this project.',
    imageKey: 'claude-code-paste-memory',
  },
];

function addFileStep(fileCount: number): Omit<WalkthroughStep, 'stepNumber'> {
  const body =
    fileCount === 1
      ? 'Create the knowledge file listed below in your project directory at the suggested path. You can point Claude Code to it during a conversation when you need it.'
      : `Create each of the ${fileCount} knowledge files listed below in your project directory at their suggested paths. You can point Claude Code to them during a conversation when you need them.`;
  return {
    title: fileCount === 1 ? 'Add the knowledge file to your project' : 'Add knowledge files to your project',
    body,
    imageKey: 'claude-code-add-file',
  };
}

// Body holds for both instruction-only and instruction-plus-files setups.
const CONFIRM_STEP: Omit<WalkthroughStep, 'stepNumber'> = {
  title: 'Confirm the setup is live',
  body: 'Start a new conversation inside Claude Code and ask something relevant to your role. Claude will pick up the instructions in CLAUDE.md automatically — no extra command needed.',
  imageKey: 'claude-code-confirm-setup',
};

// ─── toClaudeCodeExport ───────────────────────────────────────────────────────

/**
 * Converts a CompiledSetup into the Claude Code export format.
 *
 * @param compiled - A CompiledSetup produced by compileSetup().
 * @returns         { blocks, walkthrough } ready for the export UI.
 */
export function toClaudeCodeExport(compiled: CompiledSetup): ClaudeCodeExport {
  // Build blocks: instruction first (the CLAUDE.md content), then one block
  // per knowledge file in declaration order. The label on the instruction
  // block names the destination file so the copy-block UI is unambiguous.
  const blocks: ExportBlock[] = [
    {
      label: 'Project memory (CLAUDE.md)',
      content: compiled.instruction,
      kind: 'instruction',
    },
    ...compiled.knowledgeFiles.map((file) => ({
      label: file.name,
      content: file.content,
      kind: 'knowledge' as const,
    })),
  ];

  // Build walkthrough: file step only when there are files to add, then assign
  // sequential stepNumbers starting at 1.
  const fileCount = compiled.knowledgeFiles.length;
  const steps: Array<Omit<WalkthroughStep, 'stepNumber'>> = [
    ...PRE_FILE_STEPS,
    ...(fileCount > 0 ? [addFileStep(fileCount)] : []),
    CONFIRM_STEP,
  ];
  const walkthrough: WalkthroughStep[] = steps.map((step, idx) => ({
    stepNumber: idx + 1,
    ...step,
  }));

  return { blocks, walkthrough };
}
