import { describe, it, expect } from 'vitest';
import { toChatGptExport } from '@/lib/export/chatGpt';
import { compileSetup } from '@/lib/setup/compiler';
import { validateCompiledForTarget } from '@/lib/setup/validator';
import { CHATGPT_INSTRUCTION_MAX_CHARS } from '@/lib/setup/limits';
import { marketingManagerSetup } from '@/data/curated/marketing-manager';
import type { Answers, CompiledSetup } from '@/lib/setup/types';

const goldenAnswers: Answers = {
  brandName: 'Acme Corp',
  hasBrandVoice: true,
  channels: ['Email', 'Instagram', 'LinkedIn'],
  tone: 'Professional',
};

/** A deterministic CompiledSetup with two starter knowledge files. */
function makeCompiled(overrides: Partial<CompiledSetup> = {}): CompiledSetup {
  return {
    instruction: 'You are a helpful marketing assistant for Acme Corp.',
    knowledgeFiles: [
      { name: 'brand-voice.md', content: 'Voice: warm and concise.', kind: 'starter' },
      { name: 'products.md', content: 'Flagship: the Widget 3000.', kind: 'starter' },
    ],
    summary: 'Marketing setup for Acme Corp.',
    meta: { setupId: 'marketing-manager', name: 'Marketing Manager', version: '1.0.0', target: 'chatgpt' },
    inputs: {},
    ...overrides,
  };
}

describe('toChatGptExport — custom-gpt branch', () => {
  it('produces one instruction block followed by one block per knowledge file, in order', () => {
    const compiled = compileSetup(marketingManagerSetup, goldenAnswers);
    const { blocks } = toChatGptExport(compiled, 'custom-gpt');

    expect(blocks[0].kind).toBe('instruction');
    expect(blocks[0].content).toBe(compiled.instruction);

    const fileBlocks = blocks.slice(1);
    expect(fileBlocks).toHaveLength(compiled.knowledgeFiles.length);
    for (let i = 0; i < compiled.knowledgeFiles.length; i++) {
      expect(fileBlocks[i].kind).toBe('knowledge');
      expect(fileBlocks[i].label).toBe(compiled.knowledgeFiles[i].name);
      expect(fileBlocks[i].content).toBe(compiled.knowledgeFiles[i].content);
    }
  });

  it('walkthrough has sequential step numbers from 1 and stable image keys', () => {
    const { walkthrough } = toChatGptExport(makeCompiled(), 'custom-gpt');
    walkthrough.forEach((step, idx) => {
      expect(step.stepNumber).toBe(idx + 1);
      expect(step.imageKey).toMatch(/^chatgpt-/);
      expect(step.imageKey.length).toBeGreaterThan(0);
    });
    // With knowledge files present, the upload step must appear.
    expect(walkthrough.some((s) => s.imageKey === 'chatgpt-upload-knowledge')).toBe(true);
  });

  it('omits the upload step when there are no knowledge files', () => {
    const { walkthrough } = toChatGptExport(makeCompiled({ knowledgeFiles: [] }), 'custom-gpt');
    expect(walkthrough.some((s) => s.imageKey === 'chatgpt-upload-knowledge')).toBe(false);
    // Still sequential.
    walkthrough.forEach((step, idx) => expect(step.stepNumber).toBe(idx + 1));
  });
});

describe('toChatGptExport — no-builder branch', () => {
  it('appends knowledge content inline into a single instruction block', () => {
    const compiled = makeCompiled();
    const { blocks } = toChatGptExport(compiled, 'no-builder');

    // Exactly one block, and it is the instruction.
    expect(blocks).toHaveLength(1);
    expect(blocks[0].kind).toBe('instruction');

    // The block contains the instruction AND every knowledge file's content inline.
    expect(blocks[0].content).toContain(compiled.instruction);
    for (const file of compiled.knowledgeFiles) {
      expect(blocks[0].content).toContain(file.content);
      expect(blocks[0].content).toContain(file.name);
    }
  });

  it('has its own sequential walkthrough with stable image keys', () => {
    const { walkthrough } = toChatGptExport(makeCompiled(), 'no-builder');
    expect(walkthrough.length).toBeGreaterThan(0);
    walkthrough.forEach((step, idx) => {
      expect(step.stepNumber).toBe(idx + 1);
      expect(step.imageKey).toMatch(/^chatgpt-/);
    });
  });
});

describe('validateCompiledForTarget — chatgpt', () => {
  it('accepts an instruction within the limit', () => {
    const result = validateCompiledForTarget(makeCompiled(), 'chatgpt');
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('flags an instruction over the ChatGPT limit and names the overage', () => {
    const over = 'x'.repeat(CHATGPT_INSTRUCTION_MAX_CHARS + 42);
    const result = validateCompiledForTarget(makeCompiled({ instruction: over }), 'chatgpt');
    expect(result.valid).toBe(false);
    const err = result.errors.find((e) => e.code === 'INSTRUCTION_TOO_LONG');
    expect(err).toBeTruthy();
    expect(err!.message).toContain('42');
    expect(err!.message).toContain(String(CHATGPT_INSTRUCTION_MAX_CHARS));
  });
});
