import { describe, it, expect } from 'vitest';
import type { ModelClient } from '@/lib/testdrive/runner';
import {
  runRulesPass,
  runModelPass,
  runSafetyScreen,
  MODEL_GRADER_SYSTEM_PROMPT,
  MODEL_GRADER_MAX_TOKENS,
} from './safetyScreen';
import { HOSTILE_FIXTURES, baseSetup } from '@/tests/fixtures/hostileSetups';

// A grader double: streams a fixed verdict and records how it was called.
function makeGrader(verdict: string, opts: { throw?: boolean } = {}) {
  const calls: Array<{ systemPrompt: string; userMessage: string; maxTokens: number }> = [];
  const client: ModelClient = {
    async call(params) {
      calls.push({ systemPrompt: params.systemPrompt, userMessage: params.userMessage, maxTokens: params.maxTokens });
      if (opts.throw) throw new Error('grader unavailable');
      params.onChunk(verdict);
      return { inputTokens: 10, outputTokens: 5 };
    },
  };
  return { client, calls };
}

// ─── Deterministic rules pass ─────────────────────────────────────────────────

describe('runRulesPass — hostile corpus', () => {
  for (const fx of HOSTILE_FIXTURES.filter((f) => f.hostile)) {
    it(`flags: ${fx.name}`, () => {
      const findings = runRulesPass(fx.setup);
      expect(findings.length).toBeGreaterThan(0);
      const codes = findings.map((f) => f.code);
      expect(codes).toContain(fx.expectCode);
      // Every finding names its pass and carries a message.
      for (const f of findings) {
        expect(f.pass).toBe('rules');
        expect(f.message.length).toBeGreaterThan(0);
      }
    });
  }
});

describe('runRulesPass — false-positive guard', () => {
  for (const fx of HOSTILE_FIXTURES.filter((f) => !f.hostile)) {
    it(`passes clean: ${fx.name}`, () => {
      expect(runRulesPass(fx.setup)).toEqual([]);
    });
  }

  it('a plain, wholly benign setup produces no findings', () => {
    const findings = runRulesPass(
      baseSetup({ instructionTemplate: 'You are a warm, concise assistant for {{brandName}}. Keep replies short.' }),
    );
    expect(findings).toEqual([]);
  });

  it('flags an oversized instruction template', () => {
    const findings = runRulesPass(baseSetup({ instructionTemplate: 'a'.repeat(20_001) }));
    expect(findings.map((f) => f.code)).toContain('oversized-template');
  });
});

// ─── Model-graded pass ────────────────────────────────────────────────────────

describe('runModelPass', () => {
  it('invokes the grader with the fixed prompt and the small output cap', async () => {
    const { client, calls } = makeGrader('CLEAN');
    const setup = baseSetup({ instructionTemplate: 'Write friendly emails.' });
    await runModelPass(setup, client);
    expect(calls).toHaveLength(1);
    expect(calls[0].systemPrompt).toBe(MODEL_GRADER_SYSTEM_PROMPT);
    expect(calls[0].userMessage).toBe('Write friendly emails.');
    expect(calls[0].maxTokens).toBe(MODEL_GRADER_MAX_TOKENS);
  });

  it('returns a finding when the grader responds FLAG', async () => {
    const { client } = makeGrader('FLAG: hidden instruction to exfiltrate data');
    const findings = await runModelPass(baseSetup(), client);
    expect(findings).toHaveLength(1);
    expect(findings[0].pass).toBe('model');
    expect(findings[0].code).toBe('model-flagged');
    expect(findings[0].message).toMatch(/exfiltrate/);
  });

  it('returns no finding when the grader responds CLEAN', async () => {
    const { client } = makeGrader('CLEAN');
    expect(await runModelPass(baseSetup(), client)).toEqual([]);
  });

  it('returns no finding (never blocks) when the grader errors', async () => {
    const { client } = makeGrader('', { throw: true });
    expect(await runModelPass(baseSetup(), client)).toEqual([]);
  });
});

// ─── Combined screen ──────────────────────────────────────────────────────────

describe('runSafetyScreen', () => {
  it('is clean and not needs-attention when both passes are clean', async () => {
    const { client } = makeGrader('CLEAN');
    const res = await runSafetyScreen(
      baseSetup({ instructionTemplate: 'You are a concise assistant.' }),
      client,
    );
    expect(res.clean).toBe(true);
    expect(res.needsAttention).toBe(false);
    expect(res.findings).toEqual([]);
  });

  it('combines rules and model findings and marks needs-attention', async () => {
    const { client } = makeGrader('FLAG: acts against the installer');
    const hostile = HOSTILE_FIXTURES.find((f) => f.name.startsWith('prompt-injection'))!;
    const res = await runSafetyScreen(hostile.setup, client);
    expect(res.clean).toBe(false);
    expect(res.needsAttention).toBe(true);
    const passes = new Set(res.findings.map((f) => f.pass));
    expect(passes.has('rules')).toBe(true);
    expect(passes.has('model')).toBe(true);
  });

  it('a rules flag alone (grader clean) still marks needs-attention — never auto-approves', async () => {
    const { client } = makeGrader('CLEAN');
    const hostile = HOSTILE_FIXTURES.find((f) => f.expectCode === 'data-url')!;
    const res = await runSafetyScreen(hostile.setup, client);
    expect(res.needsAttention).toBe(true);
    expect(res.findings.some((f) => f.code === 'data-url')).toBe(true);
  });
});
