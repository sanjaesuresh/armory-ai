/**
 * Deterministic result cache for the test-drive feature (Task 5).
 *
 * Key derivation covers all inputs that could produce a different output:
 * the compiled instruction, the full answers map (key-sorted for stability),
 * setup id + version, scenario id, model id, and token caps.
 *
 * TTL is 30 days. Setup edits invalidate naturally via a version bump in the
 * meta; model changes invalidate via the model id in the key.
 *
 * Cache hits do NOT decrement any meter — that enforcement is done by the
 * runner (Task 6). This module is a pure get/put pair.
 */

import { createHash } from 'crypto';
import { createSupabaseServiceClient } from '@/lib/supabase/serviceClient';
import type { CompiledSetup } from '@/lib/setup/types';
import type { UsageSnapshot } from './types';

// ─── TTL ─────────────────────────────────────────────────────────────────────

/** 30-day cache TTL in milliseconds. Spec: §5. */
const TTL_MS = 30 * 24 * 60 * 60 * 1_000;

// ─── Public types ─────────────────────────────────────────────────────────────

export interface TokenCaps {
  inputCap: number;
  outputCap: number;
}

export interface CacheEntry {
  output: string;
  usage: UsageSnapshot;
  /** ISO UTC string — the wall-clock time the entry was written. */
  createdAt: string;
}

// ─── Data source interface ────────────────────────────────────────────────────

export interface CacheDataSource {
  getEntry(key: string): Promise<CacheEntry | null>;
  putEntry(key: string, entry: CacheEntry): Promise<void>;
}

// ─── Key derivation ───────────────────────────────────────────────────────────

/**
 * Produces a stable SHA-256 hex key over all inputs that can affect output.
 *
 * Inputs map is key-sorted so `{ a, b }` and `{ b, a }` produce the same key.
 */
export function cacheKeyFor(
  compiled: CompiledSetup,
  scenarioId: string,
  modelId: string,
  tokenCaps: TokenCaps,
): string {
  // Sort inputs by key for determinism regardless of insertion order.
  const sortedInputs: Record<string, unknown> = {};
  for (const k of Object.keys(compiled.inputs).sort()) {
    sortedInputs[k] = compiled.inputs[k];
  }

  const payload = JSON.stringify({
    instruction: compiled.instruction,
    inputs: sortedInputs,
    setupId: compiled.meta.setupId,
    version: compiled.meta.version,
    scenarioId,
    modelId,
    inputCap: tokenCaps.inputCap,
    outputCap: tokenCaps.outputCap,
  });

  return createHash('sha256').update(payload).digest('hex');
}

// ─── Cache access ─────────────────────────────────────────────────────────────

/**
 * Returns the cached entry for the given key if it exists and is within the
 * 30-day TTL. Returns null on a miss or an expired entry.
 *
 * @param key        - the cache key from cacheKeyFor.
 * @param dataSource - injectable cache storage.
 * @param nowMs      - current epoch ms (injectable for tests).
 */
export async function getCached(
  key: string,
  dataSource: CacheDataSource,
  nowMs: number,
): Promise<CacheEntry | null> {
  const entry = await dataSource.getEntry(key);
  if (!entry) return null;

  const ageMs = nowMs - new Date(entry.createdAt).getTime();
  if (ageMs > TTL_MS) return null; // expired

  return entry;
}

/**
 * Stores a cache entry under the given key.
 *
 * @param key        - the cache key from cacheKeyFor.
 * @param entry      - the output + usage to store.
 * @param dataSource - injectable cache storage.
 * @param nowMs      - current epoch ms (used to populate createdAt if not set).
 */
export async function putCached(
  key: string,
  entry: CacheEntry,
  dataSource: CacheDataSource,
  nowMs: number,
): Promise<void> {
  const toStore: CacheEntry = {
    ...entry,
    // If createdAt is already set (e.g. in tests), keep it; otherwise use now.
    createdAt: entry.createdAt ?? new Date(nowMs).toISOString(),
  };
  await dataSource.putEntry(key, toStore);
}

// ─── Supabase-backed data source ──────────────────────────────────────────────

export function createSupabaseCacheDataSource(): CacheDataSource {
  let client: ReturnType<typeof createSupabaseServiceClient> | null = null;

  function getClient() {
    if (!client) client = createSupabaseServiceClient();
    return client;
  }

  return {
    async getEntry(key: string): Promise<CacheEntry | null> {
      const { data, error } = await getClient()
        .from('testdrive_cache')
        .select('output, usage_snapshot, created_at')
        .eq('cache_key', key)
        .maybeSingle();

      if (error) throw new Error(`Supabase getCacheEntry error: ${error.message}`);
      if (!data) return null;

      const row = data as { output: string; usage_snapshot: UsageSnapshot; created_at: string };
      return {
        output: row.output,
        usage: row.usage_snapshot,
        createdAt: row.created_at,
      };
    },

    async putEntry(key: string, entry: CacheEntry): Promise<void> {
      const { error } = await getClient()
        .from('testdrive_cache')
        .upsert({
          cache_key: key,
          output: entry.output,
          usage_snapshot: entry.usage,
          created_at: entry.createdAt,
        });

      if (error) throw new Error(`Supabase putCacheEntry error: ${error.message}`);
    },
  };
}
