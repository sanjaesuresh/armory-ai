import { describe, it, expect } from 'vitest';
import { toClaudeAppExport } from '@/lib/export/claudeApp';
import { compileSetup } from '@/lib/setup/compiler';
import { marketingManagerSetup } from '@/data/curated/marketing-manager';
import type { Answers } from '@/lib/setup/types';

// ─── Shared answers ───────────────────────────────────────────────────────────

const goldenAnswers: Answers = {
  brandName: 'Acme Corp',
  hasBrandVoice: true,
  channels: ['Email', 'Instagram', 'LinkedIn'],
  tone: 'Professional',
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('toClaudeAppExport', () => {
  it('produces one instruction block followed by one block per knowledge file, in order', () => {
    const compiled = compileSetup(marketingManagerSetup, goldenAnswers);
    const { blocks } = toClaudeAppExport(compiled);

    // First block must be the instruction block
    expect(blocks[0].kind).toBe('instruction');

    // Remaining blocks: one per knowledge file in order
    const fileBlocks = blocks.slice(1);
    expect(fileBlocks).toHaveLength(compiled.knowledgeFiles.length);

    for (let i = 0; i < compiled.knowledgeFiles.length; i++) {
      expect(fileBlocks[i].kind).toBe('knowledge');
      expect(fileBlocks[i].label).toBe(compiled.knowledgeFiles[i].name);
    }
  });

  it('each block has a human label and copyable content', () => {
    const compiled = compileSetup(marketingManagerSetup, goldenAnswers);
    const { blocks } = toClaudeAppExport(compiled);

    for (const block of blocks) {
      expect(typeof block.label).toBe('string');
      expect(block.label.length).toBeGreaterThan(0);
      expect(typeof block.content).toBe('string');
    }

    // Instruction block content must equal the compiled instruction
    expect(blocks[0].content).toBe(compiled.instruction);

    // Each knowledge-file block content must match its file content
    for (let i = 0; i < compiled.knowledgeFiles.length; i++) {
      expect(blocks[i + 1].content).toBe(compiled.knowledgeFiles[i].content);
    }
  });

  it('walkthrough has sequential step numbers starting at 1 and a step for creating the project, pasting instructions, and uploading files', () => {
    const compiled = compileSetup(marketingManagerSetup, goldenAnswers);
    const { walkthrough } = toClaudeAppExport(compiled);

    // Step numbers are sequential starting at 1
    walkthrough.forEach((step, idx) => {
      expect(step.stepNumber).toBe(idx + 1);
    });

    const allText = walkthrough.map((s) => `${s.title} ${s.body}`.toLowerCase());

    // Must have a step about creating a project
    expect(allText.some((t) => t.includes('project'))).toBe(true);

    // Must have a step about pasting instructions
    expect(allText.some((t) => t.includes('instruction'))).toBe(true);

    // Must have a step about uploading files
    expect(allText.some((t) => t.includes('upload'))).toBe(true);
  });

  it('walkthrough steps reference image keys so screenshots can be attached', () => {
    const compiled = compileSetup(marketingManagerSetup, goldenAnswers);
    const { walkthrough } = toClaudeAppExport(compiled);

    for (const step of walkthrough) {
      expect(typeof step.imageKey).toBe('string');
      expect(step.imageKey.length).toBeGreaterThan(0);
    }
  });

  it('omits the upload step for a setup with no knowledge files, keeping step numbers sequential', () => {
    const compiled = compileSetup(marketingManagerSetup, goldenAnswers);
    const noFiles = { ...compiled, knowledgeFiles: [] };
    const { blocks, walkthrough } = toClaudeAppExport(noFiles);

    expect(blocks).toHaveLength(1);
    expect(blocks[0].kind).toBe('instruction');

    const allText = walkthrough.map((s) => `${s.title} ${s.body}`.toLowerCase());
    expect(allText.some((t) => t.includes('upload'))).toBe(false);

    walkthrough.forEach((step, idx) => {
      expect(step.stepNumber).toBe(idx + 1);
    });
  });

  it('uses singular wording in the upload step for a single knowledge file', () => {
    const compiled = compileSetup(marketingManagerSetup, goldenAnswers);
    const oneFile = { ...compiled, knowledgeFiles: compiled.knowledgeFiles.slice(0, 1) };
    const { walkthrough } = toClaudeAppExport(oneFile);

    const upload = walkthrough.find((s) => s.imageKey === 'upload-knowledge-file');
    expect(upload).toBeDefined();
    expect(upload!.title).toBe('Upload your knowledge file');
    expect(upload!.body).not.toContain('one at a time');
  });

  it('a user-provided knowledge file with empty content still gets an export block, with empty content awaiting client injection', () => {
    const compiled = compileSetup(marketingManagerSetup, goldenAnswers);
    const withEmptyFile = {
      ...compiled,
      knowledgeFiles: [{ ...compiled.knowledgeFiles[0], content: '' }],
    };
    const { blocks } = toClaudeAppExport(withEmptyFile);

    expect(blocks).toHaveLength(2);
    expect(blocks[1].kind).toBe('knowledge');
    expect(blocks[1].label).toBe(withEmptyFile.knowledgeFiles[0].name);
    expect(blocks[1].content).toBe('');
  });
});
