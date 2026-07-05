/**
 * Tests for the AI-describe pipeline (Phase 8 Task 8).
 *
 * All model calls use in-memory stubs — no network, no Supabase. describeArtifact
 * never touches the database; the model client is the only injected seam.
 */

import { describe, it, expect } from 'vitest';
import {
  describeArtifact,
  FILE_CONTENT_TRUNCATION_CHARS,
  NAME_MAX_CHARS,
  TAGLINE_MAX_CHARS,
  CAPABILITIES_MAX,
  type DescribeInput,
  type DescribeDeps,
} from './describe';
import type { ModelClient } from '@/lib/testdrive/runner';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const NOW = '2026-07-04T12:00:00Z';

/** Builds a ModelClient stub that plays back a list of responses in order. */
function makeModelClient(
  responses: Array<{ output: string; throws?: boolean }>,
): { client: ModelClient; callCount: () => number; lastPrompt: () => string } {
  let idx = 0;
  let calls = 0;
  let lastUserMessage = '';

  const client: ModelClient = {
    async call({ userMessage, onChunk }) {
      const resp = responses[idx++];
      calls++;
      lastUserMessage = userMessage;
      if (resp?.throws) throw new Error('stub model error');
      onChunk(resp?.output ?? '');
      return { inputTokens: 100, outputTokens: 50 };
    },
  };

  return {
    client,
    callCount: () => calls,
    lastPrompt: () => lastUserMessage,
  };
}

const VALID_DRAFT_JSON = JSON.stringify({
  name: 'My Agent',
  tagline: 'An agent that does useful things',
  description: 'This agent helps you automate tasks. It is easy to use and configure.',
  capabilities: [{ command: '/help', description: 'Shows help' }],
});

const BASE_INPUT: DescribeInput = {
  kind: 'agent',
  files: [{ name: 'README.md', content: 'This is a test agent.' }],
};

// ─── Tests: describeArtifact ─────────────────────────────────────────────────

describe('describeArtifact', () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it('returns ok:true with the draft when model returns valid JSON', async () => {
    const { client } = makeModelClient([{ output: VALID_DRAFT_JSON }]);
    const deps: DescribeDeps = { modelClient: client, now: NOW };
    const result = await describeArtifact(BASE_INPUT, deps);

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('expected ok:true');
    expect(result.draft.name).toBe('My Agent');
    expect(result.draft.tagline).toBe('An agent that does useful things');
    expect(result.draft.description).toBeTruthy();
    expect(result.draft.capabilities).toHaveLength(1);
    expect(result.spendUsd).toBeGreaterThan(0);
  });

  // ── Field cap enforcement ─────────────────────────────────────────────────

  it(`truncates name longer than ${NAME_MAX_CHARS} chars to exactly ${NAME_MAX_CHARS}`, async () => {
    const overName = 'A'.repeat(NAME_MAX_CHARS + 20);
    const json = JSON.stringify({
      name: overName,
      tagline: 'Short tagline ok',
      description: 'Desc.',
      capabilities: [],
    });
    const { client } = makeModelClient([{ output: json }]);
    const result = await describeArtifact(BASE_INPUT, { modelClient: client, now: NOW });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('expected ok:true');
    expect(result.draft.name.length).toBe(NAME_MAX_CHARS);
  });

  it(`truncates tagline longer than ${TAGLINE_MAX_CHARS} chars to exactly ${TAGLINE_MAX_CHARS}`, async () => {
    const overTagline = 'B'.repeat(TAGLINE_MAX_CHARS + 30);
    const json = JSON.stringify({
      name: 'Normal Name',
      tagline: overTagline,
      description: 'Desc.',
      capabilities: [],
    });
    const { client } = makeModelClient([{ output: json }]);
    const result = await describeArtifact(BASE_INPUT, { modelClient: client, now: NOW });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('expected ok:true');
    expect(result.draft.tagline.length).toBe(TAGLINE_MAX_CHARS);
  });

  it(`cuts capabilities array to ${CAPABILITIES_MAX} entries when model returns more`, async () => {
    const caps = Array.from({ length: CAPABILITIES_MAX + 5 }, (_, i) => ({
      command: `/cmd${i}`,
      description: `Description for command ${i}`,
    }));
    const json = JSON.stringify({
      name: 'Name',
      tagline: 'Tagline',
      description: 'Desc.',
      capabilities: caps,
    });
    const { client } = makeModelClient([{ output: json }]);
    const result = await describeArtifact(BASE_INPUT, { modelClient: client, now: NOW });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('expected ok:true');
    expect(result.draft.capabilities.length).toBe(CAPABILITIES_MAX);
  });

  // ── Retry logic ───────────────────────────────────────────────────────────

  it('retries once on unparseable output and returns ok draft on second attempt', async () => {
    const { client, callCount } = makeModelClient([
      { output: 'this is not JSON at all' },
      { output: VALID_DRAFT_JSON },
    ]);
    const deps: DescribeDeps = { modelClient: client, now: NOW };
    const result = await describeArtifact(BASE_INPUT, deps);

    expect(result.ok).toBe(true);
    expect(callCount()).toBe(2);
  });

  it('returns { ok:false, code:"unparseable" } when both attempts return garbage', async () => {
    const { client, callCount } = makeModelClient([
      { output: 'bad output #1' },
      { output: 'bad output #2' },
    ]);
    const deps: DescribeDeps = { modelClient: client, now: NOW };
    const result = await describeArtifact(BASE_INPUT, deps);

    expect(result).toEqual({ ok: false, code: 'unparseable' });
    expect(callCount()).toBe(2);
  });

  // ── Model throw ───────────────────────────────────────────────────────────

  it('returns { ok:false, code:"model-failure" } when model throws', async () => {
    const { client } = makeModelClient([{ output: '', throws: true }]);
    const deps: DescribeDeps = { modelClient: client, now: NOW };
    const result = await describeArtifact(BASE_INPUT, deps);

    expect(result).toEqual({ ok: false, code: 'model-failure' });
  });

  // ── Prompt truncation ─────────────────────────────────────────────────────

  it(`truncates file content to the first ${FILE_CONTENT_TRUNCATION_CHARS} chars in the prompt`, async () => {
    const longContent = 'x'.repeat(FILE_CONTENT_TRUNCATION_CHARS + 5_000);
    const longInput: DescribeInput = {
      kind: 'agent',
      files: [{ name: 'big.md', content: longContent }],
    };

    const { client, lastPrompt } = makeModelClient([{ output: VALID_DRAFT_JSON }]);
    await describeArtifact(longInput, { modelClient: client, now: NOW });

    const prompt = lastPrompt();
    // The prompt must NOT contain the full content
    expect(prompt.includes(longContent)).toBe(false);
    // The prompt must contain exactly FILE_CONTENT_TRUNCATION_CHARS 'x' characters
    const xCount = (prompt.match(/x/g) ?? []).length;
    expect(xCount).toBe(FILE_CONTENT_TRUNCATION_CHARS);
  });

  // ── Model output with markdown fences ─────────────────────────────────────

  it('strips markdown fences from model output before parsing', async () => {
    const fenced = '```json\n' + VALID_DRAFT_JSON + '\n```';
    const { client } = makeModelClient([{ output: fenced }]);
    const result = await describeArtifact(BASE_INPUT, { modelClient: client, now: NOW });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('expected ok:true');
    expect(result.draft.name).toBe('My Agent');
  });
});
