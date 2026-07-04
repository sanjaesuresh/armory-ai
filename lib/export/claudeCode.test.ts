import { describe, it, expect } from 'vitest';
import { toClaudeCodeExport } from '@/lib/export/claudeCode';
import { validateCompiledForTarget } from '@/lib/setup/validator';
import { CLAUDE_CODE_INSTRUCTION_MAX_CHARS } from '@/lib/setup/limits';
import type { CompiledSetup } from '@/lib/setup/types';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

/** A CompiledSetup with two starter knowledge files. */
function makeCompiled(overrides: Partial<CompiledSetup> = {}): CompiledSetup {
  return {
    instruction: 'You are a helpful assistant.',
    knowledgeFiles: [
      { name: 'style-guide.md', content: 'Write in plain English.', kind: 'starter' },
      { name: 'brand-facts.md', content: 'Founded 2010.', kind: 'starter' },
    ],
    summary: 'Test setup.',
    meta: {
      setupId: 'test-setup',
      name: 'Test Setup',
      version: '1.0.0',
      target: 'claude-code',
    },
    inputs: {},
    ...overrides,
  };
}

// ─── Block order and shape ────────────────────────────────────────────────────

describe('toClaudeCodeExport — blocks', () => {
  it('produces one instruction block followed by one block per knowledge file, in order', () => {
    const compiled = makeCompiled();
    const { blocks } = toClaudeCodeExport(compiled);

    // First block must be the instruction block
    expect(blocks[0].kind).toBe('instruction');
    expect(blocks[0].content).toBe(compiled.instruction);

    // Remaining blocks: one per knowledge file in declaration order
    const fileBlocks = blocks.slice(1);
    expect(fileBlocks).toHaveLength(compiled.knowledgeFiles.length);
    for (let i = 0; i < compiled.knowledgeFiles.length; i++) {
      expect(fileBlocks[i].kind).toBe('knowledge');
      expect(fileBlocks[i].label).toBe(compiled.knowledgeFiles[i].name);
      expect(fileBlocks[i].content).toBe(compiled.knowledgeFiles[i].content);
    }
  });

  it('each block has a non-empty label, non-empty kind, and a content field', () => {
    const { blocks } = toClaudeCodeExport(makeCompiled());
    for (const block of blocks) {
      expect(typeof block.label).toBe('string');
      expect(block.label.length).toBeGreaterThan(0);
      expect(['instruction', 'knowledge']).toContain(block.kind);
      expect(typeof block.content).toBe('string');
    }
  });

  it('the instruction block label references CLAUDE.md so the destination is unambiguous', () => {
    const { blocks } = toClaudeCodeExport(makeCompiled());
    expect(blocks[0].label).toContain('CLAUDE.md');
  });

  it('a setup with no knowledge files produces exactly one block of kind instruction', () => {
    const { blocks } = toClaudeCodeExport(makeCompiled({ knowledgeFiles: [] }));
    expect(blocks).toHaveLength(1);
    expect(blocks[0].kind).toBe('instruction');
  });
});

// ─── Walkthrough steps ────────────────────────────────────────────────────────

describe('toClaudeCodeExport — walkthrough', () => {
  it('walkthrough steps are sequentially numbered starting at 1', () => {
    const { walkthrough } = toClaudeCodeExport(makeCompiled());
    expect(walkthrough.length).toBeGreaterThan(0);
    walkthrough.forEach((step, idx) => {
      expect(step.stepNumber).toBe(idx + 1);
    });
  });

  it('every step has a non-empty imageKey so screenshot assets can be keyed against it', () => {
    const { walkthrough } = toClaudeCodeExport(makeCompiled());
    for (const step of walkthrough) {
      expect(typeof step.imageKey).toBe('string');
      expect(step.imageKey.length).toBeGreaterThan(0);
    }
  });

  it('all image keys are prefixed with claude-code- for namespace separation', () => {
    const { walkthrough } = toClaudeCodeExport(makeCompiled());
    for (const step of walkthrough) {
      expect(step.imageKey).toMatch(/^claude-code-/);
    }
  });

  it('includes a step referencing the CLAUDE.md memory file', () => {
    const { walkthrough } = toClaudeCodeExport(makeCompiled());
    const allText = walkthrough.map((s) => `${s.title} ${s.body}`);
    expect(allText.some((t) => t.includes('CLAUDE.md'))).toBe(true);
  });

  it('includes a file step when the compiled setup has knowledge files', () => {
    const { walkthrough } = toClaudeCodeExport(makeCompiled());
    const hasFileStep = walkthrough.some((s) => s.imageKey === 'claude-code-add-file');
    expect(hasFileStep).toBe(true);
  });

  it('an instruction-only setup omits the file step and keeps step numbers sequential', () => {
    const compiled = makeCompiled({ knowledgeFiles: [] });
    const { walkthrough } = toClaudeCodeExport(compiled);

    // No file step
    expect(walkthrough.some((s) => s.imageKey === 'claude-code-add-file')).toBe(false);

    // Still sequential
    walkthrough.forEach((step, idx) => {
      expect(step.stepNumber).toBe(idx + 1);
    });
  });

  it('uses singular wording in the file step for a single knowledge file', () => {
    const compiled = makeCompiled({
      knowledgeFiles: [{ name: 'one.md', content: 'content', kind: 'starter' }],
    });
    const { walkthrough } = toClaudeCodeExport(compiled);
    const fileStep = walkthrough.find((s) => s.imageKey === 'claude-code-add-file');
    expect(fileStep).toBeDefined();
    expect(fileStep!.title).toContain('the knowledge file');
    // Body should not use plural "files"
    expect(fileStep!.body).not.toMatch(/\d+ knowledge files/);
  });

  it('uses plural wording in the file step for multiple knowledge files', () => {
    const compiled = makeCompiled();
    const { walkthrough } = toClaudeCodeExport(compiled);
    const fileStep = walkthrough.find((s) => s.imageKey === 'claude-code-add-file');
    expect(fileStep).toBeDefined();
    expect(fileStep!.body).toContain(String(compiled.knowledgeFiles.length));
  });

  it('first step references Claude Code installation for users who do not have it yet', () => {
    const { walkthrough } = toClaudeCodeExport(makeCompiled());
    const firstStep = walkthrough[0];
    // Should mention either "install" or the quickstart URL
    const combined = `${firstStep.title} ${firstStep.body}`.toLowerCase();
    expect(
      combined.includes('install') || combined.includes('quickstart'),
    ).toBe(true);
  });
});

// ─── Validator dispatch — claude-code case ────────────────────────────────────

describe('validateCompiledForTarget — claude-code', () => {
  it('accepts a compiled setup that is within all limits', () => {
    const result = validateCompiledForTarget(makeCompiled(), 'claude-code');
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('flags an instruction over the Claude Code limit and names the overage in the error message', () => {
    const over = 'x'.repeat(CLAUDE_CODE_INSTRUCTION_MAX_CHARS + 50);
    const result = validateCompiledForTarget(makeCompiled({ instruction: over }), 'claude-code');
    expect(result.valid).toBe(false);
    const err = result.errors.find((e) => e.code === 'INSTRUCTION_TOO_LONG');
    expect(err).toBeDefined();
    // Message must name the overage (50 chars) and the limit
    expect(err!.message).toContain('50');
    expect(err!.message).toContain(String(CLAUDE_CODE_INSTRUCTION_MAX_CHARS));
    expect(err!.path).toBe('instruction');
  });

  it('flags too many knowledge files and names the overage', () => {
    const manyFiles = Array.from({ length: 22 }, (_, i) => ({
      name: `file-${i}.md`,
      content: 'content',
      kind: 'starter' as const,
    }));
    const result = validateCompiledForTarget(makeCompiled({ knowledgeFiles: manyFiles }), 'claude-code');
    expect(result.valid).toBe(false);
    const err = result.errors.find((e) => e.code === 'TOO_MANY_FILES');
    expect(err).toBeDefined();
    expect(err!.message).toContain('2'); // 22 - 20 = 2 over
  });
});
