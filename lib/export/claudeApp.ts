/**
 * Claude-app export adapter.
 *
 * toClaudeAppExport(compiled) → { blocks, walkthrough }
 *
 *   blocks     — Ordered array of { label, content, kind } ready for the Claude
 *                Projects UI. First the instruction block, then one block per
 *                knowledge file in declaration order.
 *
 *   walkthrough — Ordered steps describing how to configure a Claude Project,
 *                 starting at stepNumber 1. Each step carries an imageKey (a
 *                 stable slug naming the screenshot asset) so the UI can attach
 *                 screenshots in a later task.
 */

import type { CompiledSetup } from '@/lib/setup/types';

// ─── Exported types ───────────────────────────────────────────────────────────

export interface ExportBlock {
  label: string;
  content: string;
  kind: 'instruction' | 'knowledge';
}

export interface WalkthroughStep {
  stepNumber: number;
  title: string;
  body: string;
  imageKey: string;
}

export interface ClaudeAppExport {
  blocks: ExportBlock[];
  walkthrough: WalkthroughStep[];
}

// ─── Walkthrough steps ───────────────────────────────────────────────────────
//
// Step order and imageKeys must stay stable so screenshot assets can be keyed
// against them. The upload step is included only when the compiled setup has
// knowledge files — an instruction-only setup must not tell the user to upload
// files that don't exist.

const PRE_UPLOAD_STEPS: ReadonlyArray<Omit<WalkthroughStep, 'stepNumber'>> = [
  {
    title: 'Create a new Project',
    body: 'Open claude.ai and click "Projects" in the left sidebar. Then click "Create project".',
    imageKey: 'create-project',
  },
  {
    title: 'Name your Project',
    body: 'Give your project a memorable name (for example, the name of the role or brand you are configuring). Click "Create" to confirm.',
    imageKey: 'name-project',
  },
  {
    title: 'Paste the custom instructions',
    body: 'In the Project settings panel, open the "Custom instructions" field. Copy the instruction block below and paste it in, then save.',
    imageKey: 'paste-instructions',
  },
];

function uploadStep(fileCount: number): Omit<WalkthroughStep, 'stepNumber'> {
  const body =
    fileCount === 1
      ? 'Still in Project settings, click "Add content" under the knowledge section and upload the file listed below.'
      : `Still in Project settings, click "Add content" under the knowledge section and upload each of the ${fileCount} files listed below. Upload them one at a time in the order shown.`;
  return {
    title: fileCount === 1 ? 'Upload your knowledge file' : 'Upload knowledge files',
    body,
    imageKey: 'upload-knowledge-file',
  };
}

// Body must hold for setups with and without knowledge files.
const READY_STEP: Omit<WalkthroughStep, 'stepNumber'> = {
  title: 'Your Project is ready',
  body: 'Start a new conversation inside the Project. Claude will use everything you just added automatically.',
  imageKey: 'project-ready',
};

// ─── toClaudeAppExport ────────────────────────────────────────────────────────

/**
 * Converts a CompiledSetup into the Claude Projects export format.
 *
 * @param compiled - A CompiledSetup produced by compileSetup().
 * @returns         { blocks, walkthrough } ready for the export UI.
 */
export function toClaudeAppExport(compiled: CompiledSetup): ClaudeAppExport {
  // Build blocks: instruction first, then one block per knowledge file.
  const blocks: ExportBlock[] = [
    {
      label: 'Custom instructions',
      content: compiled.instruction,
      kind: 'instruction',
    },
    ...compiled.knowledgeFiles.map((file) => ({
      label: file.name,
      content: file.content,
      kind: 'knowledge' as const,
    })),
  ];

  // Build walkthrough: upload step only when there are files to upload,
  // then assign sequential stepNumbers starting at 1.
  const fileCount = compiled.knowledgeFiles.length;
  const steps: Array<Omit<WalkthroughStep, 'stepNumber'>> = [
    ...PRE_UPLOAD_STEPS,
    ...(fileCount > 0 ? [uploadStep(fileCount)] : []),
    READY_STEP,
  ];
  const walkthrough: WalkthroughStep[] = steps.map((step, idx) => ({
    stepNumber: idx + 1,
    ...step,
  }));

  return { blocks, walkthrough };
}
