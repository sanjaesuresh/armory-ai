/**
 * Tests for the deterministic result cache (Task 5).
 *
 * All tests use in-memory stubs and a stubbed clock — no network, no DB.
 */

import { describe, it, expect } from 'vitest';
import {
  cacheKeyFor,
  getCached,
  putCached,
  type CacheDataSource,
  type CacheEntry,
  type TokenCaps,
} from './cache';
import type { CompiledSetup } from '@/lib/setup/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeCompiledSetup(overrides?: Partial<CompiledSetup>): CompiledSetup {
  return {
    instruction: 'You are a marketing manager assistant.',
    knowledgeFiles: [],
    summary: 'Marketing manager setup',
    meta: {
      setupId: 'curated-marketing-manager-v1',
      name: 'Marketing Manager',
      version: '1.0.0',
      target: 'claude-app',
    },
    inputs: { tone: 'formal', audience: 'enterprise' },
    ...overrides,
  };
}

function makeDataSource() {
  const store = new Map<string, CacheEntry>();

  const ds: CacheDataSource = {
    async getEntry(key: string) {
      return store.get(key) ?? null;
    },
    async putEntry(key: string, entry: CacheEntry) {
      store.set(key, entry);
    },
  };

  return { ds, store };
}

const MODEL_ID = 'claude-sonnet-4-6';
const TOKEN_CAPS: TokenCaps = { inputCap: 8_000, outputCap: 700 };
const SCENARIO_ID = 'scenario-1';

/** 30 days in ms + 1 second (just past TTL). */
const THIRTY_DAYS_PLUS_MS = 30 * 24 * 60 * 60 * 1_000 + 1_000;

const NOW = '2026-07-02T12:00:00.000Z';
const NOW_MS = new Date(NOW).getTime();

const SAMPLE_ENTRY: CacheEntry = {
  output: 'Here is your marketing copy.',
  usage: { inputTokens: 1000, outputTokens: 200, estimatedCostUsd: 0.006 },
  createdAt: NOW,
};

// ─── cacheKeyFor tests ────────────────────────────────────────────────────────

describe('cacheKeyFor', () => {
  it('identical compiled + scenario + model + caps produce the same key', () => {
    const compiled = makeCompiledSetup();
    const k1 = cacheKeyFor(compiled, SCENARIO_ID, MODEL_ID, TOKEN_CAPS);
    const k2 = cacheKeyFor(compiled, SCENARIO_ID, MODEL_ID, TOKEN_CAPS);
    expect(k1).toBe(k2);
  });

  it('key is a non-empty hex string (SHA-256)', () => {
    const key = cacheKeyFor(makeCompiledSetup(), SCENARIO_ID, MODEL_ID, TOKEN_CAPS);
    expect(/^[0-9a-f]{64}$/.test(key)).toBe(true);
  });

  it('changing an answer changes the key', () => {
    const base = makeCompiledSetup();
    const changed = makeCompiledSetup({ inputs: { tone: 'casual', audience: 'enterprise' } });
    expect(cacheKeyFor(base, SCENARIO_ID, MODEL_ID, TOKEN_CAPS))
      .not.toBe(cacheKeyFor(changed, SCENARIO_ID, MODEL_ID, TOKEN_CAPS));
  });

  it('adding an answer changes the key', () => {
    const base = makeCompiledSetup();
    const extra = makeCompiledSetup({ inputs: { tone: 'formal', audience: 'enterprise', extra: 'value' } });
    expect(cacheKeyFor(base, SCENARIO_ID, MODEL_ID, TOKEN_CAPS))
      .not.toBe(cacheKeyFor(extra, SCENARIO_ID, MODEL_ID, TOKEN_CAPS));
  });

  it('changing only the instruction changes the key', () => {
    const base = makeCompiledSetup();
    const changed = makeCompiledSetup({ instruction: 'You are a different assistant.' });
    expect(cacheKeyFor(base, SCENARIO_ID, MODEL_ID, TOKEN_CAPS))
      .not.toBe(cacheKeyFor(changed, SCENARIO_ID, MODEL_ID, TOKEN_CAPS));
  });

  it('changing only the scenario id changes the key', () => {
    const compiled = makeCompiledSetup();
    expect(cacheKeyFor(compiled, 'scenario-1', MODEL_ID, TOKEN_CAPS))
      .not.toBe(cacheKeyFor(compiled, 'scenario-2', MODEL_ID, TOKEN_CAPS));
  });

  it('changing only the model id changes the key', () => {
    const compiled = makeCompiledSetup();
    expect(cacheKeyFor(compiled, SCENARIO_ID, 'claude-haiku-4-5', TOKEN_CAPS))
      .not.toBe(cacheKeyFor(compiled, SCENARIO_ID, 'claude-sonnet-4-6', TOKEN_CAPS));
  });

  it('changing token caps changes the key', () => {
    const compiled = makeCompiledSetup();
    const capsA: TokenCaps = { inputCap: 8_000, outputCap: 700 };
    const capsB: TokenCaps = { inputCap: 4_000, outputCap: 700 };
    expect(cacheKeyFor(compiled, SCENARIO_ID, MODEL_ID, capsA))
      .not.toBe(cacheKeyFor(compiled, SCENARIO_ID, MODEL_ID, capsB));
  });

  it('changing setup version (in meta) changes the key', () => {
    const base = makeCompiledSetup();
    const bumped = makeCompiledSetup({ meta: { ...base.meta, version: '2.0.0' } });
    expect(cacheKeyFor(base, SCENARIO_ID, MODEL_ID, TOKEN_CAPS))
      .not.toBe(cacheKeyFor(bumped, SCENARIO_ID, MODEL_ID, TOKEN_CAPS));
  });

  it('inputs are key-order-independent (sorted before hashing)', () => {
    const a = makeCompiledSetup({ inputs: { tone: 'formal', audience: 'enterprise' } });
    const b = makeCompiledSetup({ inputs: { audience: 'enterprise', tone: 'formal' } });
    expect(cacheKeyFor(a, SCENARIO_ID, MODEL_ID, TOKEN_CAPS))
      .toBe(cacheKeyFor(b, SCENARIO_ID, MODEL_ID, TOKEN_CAPS));
  });
});

// ─── getCached / putCached tests ──────────────────────────────────────────────

describe('getCached', () => {
  it('returns null when no entry exists', async () => {
    const { ds } = makeDataSource();
    const key = cacheKeyFor(makeCompiledSetup(), SCENARIO_ID, MODEL_ID, TOKEN_CAPS);
    const result = await getCached(key, ds, NOW_MS);
    expect(result).toBeNull();
  });

  it('returns the stored output and usage snapshot for a fresh entry', async () => {
    const { ds } = makeDataSource();
    const key = cacheKeyFor(makeCompiledSetup(), SCENARIO_ID, MODEL_ID, TOKEN_CAPS);
    await putCached(key, SAMPLE_ENTRY, ds, NOW_MS);

    const result = await getCached(key, ds, NOW_MS);
    expect(result).not.toBeNull();
    expect(result!.output).toBe(SAMPLE_ENTRY.output);
    expect(result!.usage).toEqual(SAMPLE_ENTRY.usage);
  });

  it('expired entry (>30d old) is a miss', async () => {
    const { ds } = makeDataSource();
    const key = cacheKeyFor(makeCompiledSetup(), SCENARIO_ID, MODEL_ID, TOKEN_CAPS);

    // Entry created at NOW; "now" for getCached is 30d+1s later.
    await putCached(key, SAMPLE_ENTRY, ds, NOW_MS);

    const futureMs = NOW_MS + THIRTY_DAYS_PLUS_MS;
    const result = await getCached(key, ds, futureMs);
    expect(result).toBeNull();
  });

  it('entry exactly at the TTL boundary (30d) is still a hit', async () => {
    const { ds } = makeDataSource();
    const key = cacheKeyFor(makeCompiledSetup(), SCENARIO_ID, MODEL_ID, TOKEN_CAPS);
    await putCached(key, SAMPLE_ENTRY, ds, NOW_MS);

    // Exactly 30 days later — still within TTL.
    const exactlyMs = NOW_MS + 30 * 24 * 60 * 60 * 1_000;
    const result = await getCached(key, ds, exactlyMs);
    expect(result).not.toBeNull();
  });
});

describe('putCached', () => {
  it('stores an entry that getCached can retrieve', async () => {
    const { ds } = makeDataSource();
    const key = cacheKeyFor(makeCompiledSetup(), SCENARIO_ID, MODEL_ID, TOKEN_CAPS);
    await putCached(key, SAMPLE_ENTRY, ds, NOW_MS);
    const result = await getCached(key, ds, NOW_MS);
    expect(result).not.toBeNull();
  });
});
