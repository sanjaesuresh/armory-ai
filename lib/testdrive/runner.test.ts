/**
 * Tests for the test-drive runner (Task 6).
 *
 * All tests use in-memory doubles and a mocked model client — no network,
 * no Supabase, no Anthropic API calls.
 */

import { describe, it, expect, vi } from 'vitest';
import { runTestDrive } from './runner';
import type { RunnerDeps, ModelClient } from './runner';
import type { FlagChecker } from './flags';
import type { MeterDataSource } from './meter';
import type { CacheDataSource, CacheEntry } from './cache';
import type { CatalogDataSource } from '@/lib/catalog/repository';
import { cacheKeyFor } from './cache';
import { compileSetup } from '@/lib/setup/compiler';
import { marketingManagerSetup } from '@/data/curated/marketing-manager';
import type { Setup } from '@/lib/setup/types';
import { MODEL_ID, OUTPUT_TOKEN_CAP, estimatedCostUsd, INPUT_TOKEN_CAP, CHARS_PER_TOKEN } from './modelConfig';

// ─── Constants ────────────────────────────────────────────────────────────────

const NOW = '2026-07-02T12:00:00.000Z';
const NOW_MS = new Date(NOW).getTime();

/** Canonical valid answers for marketingManagerSetup. */
const VALID_ANSWERS = {
  brandName: 'TestBrand',
  hasBrandVoice: false,
  channels: ['Email', 'Instagram'],
  tone: 'Professional',
};

const SCENARIO = marketingManagerSetup.scenarios[0];

// ─── Test doubles ─────────────────────────────────────────────────────────────

function makeFlagChecker(enabled: boolean): FlagChecker {
  return { isTestDriveEnabled: async () => enabled };
}

function makeMeterDataSource(runsToday = 0, costToday = 0): {
  ds: MeterDataSource;
  recorded: Array<Parameters<MeterDataSource['recordUsage']>[0]>;
} {
  const recorded: Array<Parameters<MeterDataSource['recordUsage']>[0]> = [];
  const ds: MeterDataSource = {
    async countTokenRunsToday() { return runsToday; },
    async countIpRunsToday() { return runsToday; },
    async sumCostToday() { return costToday; },
    async recordUsage(row) { recorded.push(row); },
    async hasAlertFiredToday() { return true; },
    async markAlertFiredToday() { /* no-op */ },
  };
  return { ds, recorded };
}

function makeCacheDataSource(): {
  ds: CacheDataSource;
  store: Map<string, CacheEntry>;
} {
  const store = new Map<string, CacheEntry>();
  const ds: CacheDataSource = {
    async getEntry(key) { return store.get(key) ?? null; },
    async putEntry(key, entry) { store.set(key, entry); },
  };
  return { ds, store };
}

function makeCatalogDataSource(setup: Setup | null = marketingManagerSetup): CatalogDataSource {
  return {
    async getSetups() { return setup ? [setup] : []; },
    async getSetupBySlug() { return setup; },
  };
}

interface MockModelClient extends ModelClient {
  calls: Array<{ systemPrompt: string; userMessage: string; maxTokens: number }>;
}

function makeModelClient(opts: {
  chunks?: string[];
  inputTokens?: number;
  outputTokens?: number;
  shouldThrow?: boolean;
} = {}): MockModelClient {
  const calls: MockModelClient['calls'] = [];
  const {
    chunks = ['Hello, world!'],
    inputTokens = 500,
    outputTokens = 100,
    shouldThrow = false,
  } = opts;

  return {
    calls,
    async call({ systemPrompt, userMessage, maxTokens, onChunk }) {
      calls.push({ systemPrompt, userMessage, maxTokens });
      if (shouldThrow) throw new Error('Provider error: connection reset');
      for (const chunk of chunks) {
        onChunk(chunk);
      }
      return { inputTokens, outputTokens };
    },
  };
}

function makeDeps(overrides: Partial<RunnerDeps> = {}): RunnerDeps & {
  modelClient: MockModelClient;
} {
  const modelClient = makeModelClient();
  return {
    flagChecker: makeFlagChecker(true),
    token: 'aabbccddeeff00112233445566778899',
    ipHash: 'deadbeef'.repeat(8),
    meterDataSource: makeMeterDataSource().ds,
    cacheDataSource: makeCacheDataSource().ds,
    catalogDataSource: makeCatalogDataSource(),
    now: NOW,
    nowMs: NOW_MS,
    ...overrides,
    // Use the overridden model client if provided, else the local mock.
    modelClient: (overrides.modelClient as MockModelClient | undefined) ?? modelClient,
  } as RunnerDeps & { modelClient: MockModelClient };
}

const VALID_REQUEST = {
  slug: 'marketing-manager',
  answers: VALID_ANSWERS,
  scenarioId: SCENARIO.id,
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('runTestDrive — request shaping', () => {
  it('system prompt = compiled instruction + starter knowledge; user message = scenario userInput', async () => {
    const modelClient = makeModelClient();
    const deps = makeDeps({ modelClient });

    const outcome = await runTestDrive(VALID_REQUEST, deps);

    expect(outcome.kind).toBe('success');
    expect(modelClient.calls).toHaveLength(1);

    const call = modelClient.calls[0];

    // Compile the setup ourselves with the same answers to get the expected instruction.
    const compiled = compileSetup(marketingManagerSetup, VALID_ANSWERS);
    expect(call.systemPrompt).toContain(compiled.instruction);

    // Starter-knowledge content should be appended.
    const starterContent = marketingManagerSetup.knowledgeFiles
      .filter((f) => f.kind === 'starter')
      .map((f) => (f as { content: string }).content)
      .join('\n\n');
    expect(call.systemPrompt).toContain(starterContent);

    // User message = scenario userInput.
    expect(call.userMessage).toBe(SCENARIO.userInput);
  });
});

describe('runTestDrive — meter denial', () => {
  it('denied meter returns structured denial and model client is never called', async () => {
    // Exhaust token cap (5 runs).
    const { ds: meterDataSource } = makeMeterDataSource(5, 0);
    const modelClient = makeModelClient();
    const deps = makeDeps({ meterDataSource, modelClient });

    const outcome = await runTestDrive(VALID_REQUEST, deps);

    expect(outcome.kind).toBe('denied');
    if (outcome.kind === 'denied') {
      expect(outcome.reason).toBe('session-cap');
      expect(outcome.retryAt).toBeTruthy();
    }
    expect(modelClient.calls).toHaveLength(0);
  });
});

describe('runTestDrive — cache hit', () => {
  it('cache hit returns cached output flagged cached=true; model client is never called', async () => {
    const { ds: cacheDataSource, store } = makeCacheDataSource();
    const compiled = compileSetup(marketingManagerSetup, VALID_ANSWERS);
    const key = cacheKeyFor(
      compiled,
      SCENARIO.id,
      MODEL_ID,
      { inputCap: INPUT_TOKEN_CAP, outputCap: OUTPUT_TOKEN_CAP },
    );
    const cachedEntry: CacheEntry = {
      output: 'Cached model output',
      usage: { inputTokens: 300, outputTokens: 80, estimatedCostUsd: 0.002 },
      createdAt: NOW,
    };
    store.set(key, cachedEntry);

    const modelClient = makeModelClient();
    const deps = makeDeps({ cacheDataSource, modelClient });

    const outcome = await runTestDrive(VALID_REQUEST, deps);

    expect(outcome.kind).toBe('cache-hit');
    if (outcome.kind === 'cache-hit') {
      expect(outcome.result.cached).toBe(true);
      expect(outcome.result.output).toBe('Cached model output');
      expect(outcome.result.usage).toEqual(cachedEntry.usage);
    }
    expect(modelClient.calls).toHaveLength(0);
  });
});

describe('runTestDrive — output cap', () => {
  it('passes the spec output cap (700) to the model call', async () => {
    const modelClient = makeModelClient();
    const deps = makeDeps({ modelClient });

    await runTestDrive(VALID_REQUEST, deps);

    expect(modelClient.calls[0].maxTokens).toBe(OUTPUT_TOKEN_CAP); // 700
  });
});

describe('runTestDrive — usage recording', () => {
  it('records usage row with mocked token counts and cost priced from config', async () => {
    const { ds: meterDataSource, recorded } = makeMeterDataSource();
    const modelClient = makeModelClient({ inputTokens: 1200, outputTokens: 300 });
    const deps = makeDeps({ meterDataSource, modelClient });

    const outcome = await runTestDrive(VALID_REQUEST, deps);

    expect(outcome.kind).toBe('success');
    expect(recorded).toHaveLength(1);
    const row = recorded[0];
    expect(row.inputTokens).toBe(1200);
    expect(row.outputTokens).toBe(300);
    const expectedCost = estimatedCostUsd(1200, 300);
    expect(row.estimatedCostUsd).toBeCloseTo(expectedCost, 8);
    expect(row.token).toBe(deps.token);
    expect(row.ipHash).toBe(deps.ipHash);
  });
});

describe('runTestDrive — provider error', () => {
  it('provider error maps to model-error shape', async () => {
    const modelClient = makeModelClient({ shouldThrow: true });
    const deps = makeDeps({ modelClient });

    const outcome = await runTestDrive(VALID_REQUEST, deps);

    expect(outcome.kind).toBe('model-error');
    if (outcome.kind === 'model-error') {
      expect(outcome.message).toBeTruthy();
      // Raw provider error message must NOT reach the client
      expect(outcome.message).not.toContain('connection reset');
    }
  });
});

describe('runTestDrive — setup guards', () => {
  it('refuses a non-curated setup', async () => {
    const nonCurated: Setup = { ...marketingManagerSetup, source: 'community' };
    const deps = makeDeps({ catalogDataSource: makeCatalogDataSource(nonCurated) });

    const outcome = await runTestDrive(VALID_REQUEST, deps);

    expect(outcome.kind).toBe('setup-refused');
  });

  it('refuses a non-approved setup', async () => {
    const nonApproved: Setup = { ...marketingManagerSetup, reviewStatus: 'pending' };
    const deps = makeDeps({ catalogDataSource: makeCatalogDataSource(nonApproved) });

    const outcome = await runTestDrive(VALID_REQUEST, deps);

    expect(outcome.kind).toBe('setup-refused');
  });

  it('returns setup-not-found when slug does not exist', async () => {
    const deps = makeDeps({ catalogDataSource: makeCatalogDataSource(null) });

    const outcome = await runTestDrive(VALID_REQUEST, deps);

    expect(outcome.kind).toBe('setup-not-found');
  });
});

describe('runTestDrive — input cap', () => {
  it('rejects oversized compiled prompt before any model call', async () => {
    // Build a setup whose instruction will be enormous after compilation.
    // Approx 8000 tokens ≈ 32000 chars. Use a setup with a huge template.
    const bigInstruction = 'X'.repeat(INPUT_TOKEN_CAP * CHARS_PER_TOKEN + 100);
    const oversizedSetup: Setup = {
      ...marketingManagerSetup,
      instructionTemplate: bigInstruction,
      variables: [], // no variables needed — just a giant static instruction
    };
    const modelClient = makeModelClient();
    const deps = makeDeps({
      catalogDataSource: makeCatalogDataSource(oversizedSetup),
      modelClient,
    });

    const outcome = await runTestDrive({ ...VALID_REQUEST, answers: {} }, deps);

    expect(outcome.kind).toBe('input-cap');
    expect(modelClient.calls).toHaveLength(0);
  });
});

describe('runTestDrive — answer validation', () => {
  it('rejects malformed answers (wrong value types) with a validation-error', async () => {
    const badRequest = {
      ...VALID_REQUEST,
      answers: {
        brandName: { nested: 'object' }, // objects are not allowed
        tone: 'Professional',
      } as Record<string, unknown>,
    };
    const modelClient = makeModelClient();
    const deps = makeDeps({ modelClient });

    const outcome = await runTestDrive(badRequest as Parameters<typeof runTestDrive>[0], deps);

    expect(outcome.kind).toBe('validation-error');
    expect(modelClient.calls).toHaveLength(0);
  });

  it('rejects answers with a function value with a validation-error', async () => {
    const badRequest = {
      ...VALID_REQUEST,
      answers: {
        brandName: () => 'evil',
      } as Record<string, unknown>,
    };
    const modelClient = makeModelClient();
    const deps = makeDeps({ modelClient });

    const outcome = await runTestDrive(badRequest as Parameters<typeof runTestDrive>[0], deps);

    expect(outcome.kind).toBe('validation-error');
    expect(modelClient.calls).toHaveLength(0);
  });
});

describe('runTestDrive — flag off', () => {
  it('returns flag-off when feature is disabled', async () => {
    const modelClient = makeModelClient();
    const deps = makeDeps({
      flagChecker: makeFlagChecker(false),
      modelClient,
    });

    const outcome = await runTestDrive(VALID_REQUEST, deps);

    expect(outcome.kind).toBe('flag-off');
    expect(modelClient.calls).toHaveLength(0);
  });
});

describe('runTestDrive — chunk callback', () => {
  it('delivers model chunks via the onChunk callback', async () => {
    const modelClient = makeModelClient({ chunks: ['Hello', ', ', 'world!'] });
    const deps = makeDeps({ modelClient });

    const received: string[] = [];
    const outcome = await runTestDrive(VALID_REQUEST, deps, (chunk) => {
      received.push(chunk);
    });

    expect(outcome.kind).toBe('success');
    expect(received).toEqual(['Hello', ', ', 'world!']);
  });

  it('success result output concatenates all chunks', async () => {
    const modelClient = makeModelClient({ chunks: ['Part1', ' Part2'] });
    const deps = makeDeps({ modelClient });

    const outcome = await runTestDrive(VALID_REQUEST, deps);

    expect(outcome.kind).toBe('success');
    if (outcome.kind === 'success') {
      expect(outcome.result.output).toBe('Part1 Part2');
    }
  });
});
