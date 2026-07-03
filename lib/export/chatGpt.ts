/**
 * ChatGPT (OpenAI) export adapter.
 *
 * toChatGptExport(compiled, branch) → { blocks, walkthrough }
 *
 * Returns the same shape as toClaudeAppExport so the export/walkthrough UI is
 * reused unchanged. Two branches, chosen by one plain question (Section 3):
 *
 *   'custom-gpt'  — The recommended path. Instructions go into the Custom GPT
 *                   builder's Instructions field; knowledge files are uploaded
 *                   to the GPT's knowledge. Blocks mirror the Claude-app export:
 *                   instruction first, then one block per knowledge file.
 *
 *   'no-builder'  — For users who can't or won't build a Custom GPT. Everything
 *                   goes into the ChatGPT "Custom Instructions" field, so the
 *                   knowledge is appended INLINE into a single instruction block.
 *                   Honest about the trade-off (no separate file storage).
 */

import type { CompiledSetup } from '@/lib/setup/types';
import type { ExportBlock, WalkthroughStep } from './claudeApp';

export type { ExportBlock, WalkthroughStep } from './claudeApp';

export type ChatGptBranch = 'custom-gpt' | 'no-builder';

export interface ChatGptExport {
  blocks: ExportBlock[];
  walkthrough: WalkthroughStep[];
}

// ─── Custom GPT walkthrough ───────────────────────────────────────────────────

const CUSTOM_GPT_PRE_UPLOAD: ReadonlyArray<Omit<WalkthroughStep, 'stepNumber'>> = [
  {
    title: 'Start a new GPT',
    body: 'Open chatgpt.com, click your name, then "My GPTs" → "Create a GPT". Switch to the "Configure" tab.',
    imageKey: 'chatgpt-create-gpt',
  },
  {
    title: 'Name your GPT',
    body: 'Give the GPT a name (for example, the role or brand you are configuring) and a short description.',
    imageKey: 'chatgpt-name-gpt',
  },
  {
    title: 'Paste the instructions',
    body: 'In the "Instructions" box on the Configure tab, paste the instruction block below.',
    imageKey: 'chatgpt-paste-instructions',
  },
];

function customGptUploadStep(fileCount: number): Omit<WalkthroughStep, 'stepNumber'> {
  const body =
    fileCount === 1
      ? 'Under "Knowledge", click "Upload files" and add the file listed below.'
      : `Under "Knowledge", click "Upload files" and add each of the ${fileCount} files listed below.`;
  return {
    title: fileCount === 1 ? 'Upload your knowledge file' : 'Upload knowledge files',
    body,
    imageKey: 'chatgpt-upload-knowledge',
  };
}

const CUSTOM_GPT_READY: Omit<WalkthroughStep, 'stepNumber'> = {
  title: 'Your GPT is ready',
  body: 'Click "Create" (or "Update"). Start a new chat with your GPT — it will use everything you just added automatically.',
  imageKey: 'chatgpt-gpt-ready',
};

// ─── No-builder (Custom Instructions) walkthrough ─────────────────────────────

const NO_BUILDER_STEPS: ReadonlyArray<Omit<WalkthroughStep, 'stepNumber'>> = [
  {
    title: 'Open Custom Instructions',
    body: 'In chatgpt.com, click your name → "Customize ChatGPT" to open the Custom Instructions panel.',
    imageKey: 'chatgpt-open-settings',
  },
  {
    title: 'Paste the instructions',
    body: 'Paste the block below into "How would you like ChatGPT to respond?" and save. This applies to all of your chats.',
    imageKey: 'chatgpt-custom-instructions',
  },
  {
    title: 'Your setup is ready',
    body: 'Start a new chat — ChatGPT will follow these instructions. Note: without a Custom GPT there is no separate file storage, so any knowledge is included inline in the text you just pasted.',
    imageKey: 'chatgpt-ci-ready',
  },
];

// ─── toChatGptExport ──────────────────────────────────────────────────────────

/**
 * Converts a CompiledSetup into a ChatGPT export for the chosen branch.
 *
 * @param compiled - A CompiledSetup produced by compileSetup().
 * @param branch   - 'custom-gpt' (recommended) or 'no-builder'.
 * @returns          { blocks, walkthrough } ready for the export UI.
 */
export function toChatGptExport(
  compiled: CompiledSetup,
  branch: ChatGptBranch,
): ChatGptExport {
  const fileCount = compiled.knowledgeFiles.length;

  if (branch === 'no-builder') {
    // Everything in one instruction block: instruction, then knowledge inline.
    let content = compiled.instruction;
    if (fileCount > 0) {
      const inline = compiled.knowledgeFiles
        .map((file) => `# ${file.name}\n${file.content}`)
        .join('\n\n');
      content = `${content}\n\n${inline}`;
    }
    const blocks: ExportBlock[] = [
      { label: 'Custom instructions', content, kind: 'instruction' },
    ];
    const walkthrough: WalkthroughStep[] = NO_BUILDER_STEPS.map((step, idx) => ({
      stepNumber: idx + 1,
      ...step,
    }));
    return { blocks, walkthrough };
  }

  // 'custom-gpt': instruction block first, then one block per knowledge file.
  const blocks: ExportBlock[] = [
    { label: 'Instructions', content: compiled.instruction, kind: 'instruction' },
    ...compiled.knowledgeFiles.map((file) => ({
      label: file.name,
      content: file.content,
      kind: 'knowledge' as const,
    })),
  ];

  const steps: Array<Omit<WalkthroughStep, 'stepNumber'>> = [
    ...CUSTOM_GPT_PRE_UPLOAD,
    ...(fileCount > 0 ? [customGptUploadStep(fileCount)] : []),
    CUSTOM_GPT_READY,
  ];
  const walkthrough: WalkthroughStep[] = steps.map((step, idx) => ({
    stepNumber: idx + 1,
    ...step,
  }));

  return { blocks, walkthrough };
}
