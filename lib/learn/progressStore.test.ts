/**
 * progressStore tests — localStorage and Supabase client both stubbed.
 * No real DB; confirms column names, method contracts, and error-swallow semantics.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { LEARN_PROGRESS_STORAGE_KEY } from '@/lib/learn/types';
import type { ProgressMap } from '@/lib/learn/types';
import {
  loadLocalProgress,
  saveLocalProgress,
  createLearnProgressStore,
} from './progressStore';

// ─── localStorage stub ────────────────────────────────────────────────────────

const storeMap: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string): string | null => storeMap[key] ?? null,
  setItem: (key: string, value: string): void => {
    storeMap[key] = value;
  },
  removeItem: (key: string): void => {
    delete storeMap[key];
  },
  clear: (): void => {
    for (const k of Object.keys(storeMap)) delete storeMap[k];
  },
  length: 0,
  key: (_index: number): string | null => null,
};

beforeEach(() => {
  vi.stubGlobal('localStorage', mockLocalStorage);
  mockLocalStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ─── Supabase fake client ─────────────────────────────────────────────────────
//
// Minimal chainable fake that records every operation and resolves to a canned
// result keyed by operation name. Guards column names and query shape without a
// live database.

type OpResult = { data: unknown; error: unknown };
type CannedOps = { select?: OpResult; upsert?: OpResult };

interface RecordedCall {
  table: string;
  op: string;
  payload?: unknown;
  filters: Record<string, unknown>;
}

function makeFakeClient(canned: CannedOps = {}) {
  const calls: RecordedCall[] = [];

  function makeTerminal(state: RecordedCall) {
    return {
      then(
        resolve: (v: OpResult) => unknown,
        reject: (e: unknown) => unknown,
      ) {
        calls.push({ ...state });
        const opKey = state.op as keyof CannedOps;
        const result: OpResult = canned[opKey] ?? { data: null, error: null };
        return Promise.resolve(result).then(resolve, reject);
      },
    };
  }

  const client = {
    calls,
    from(table: string) {
      const state: RecordedCall = { table, op: 'select', filters: {} };
      const builder = {
        select(_cols?: string) {
          state.op = 'select';
          return builder;
        },
        upsert(payload: unknown, _opts?: unknown) {
          state.op = 'upsert';
          state.payload = payload;
          return makeTerminal(state);
        },
        eq(col: string, val: unknown) {
          state.filters[col] = val;
          return builder;
        },
        then(
          resolve: (v: OpResult) => unknown,
          reject: (e: unknown) => unknown,
        ) {
          return makeTerminal(state).then(resolve, reject);
        },
      };
      return builder;
    },
  };
  return client as unknown as SupabaseClient & { calls: RecordedCall[] };
}

// ─── loadLocalProgress ────────────────────────────────────────────────────────

describe('loadLocalProgress', () => {
  it('returns an empty map when the storage key is absent', () => {
    expect(loadLocalProgress()).toEqual({});
  });

  it('returns an empty map on corrupt JSON', () => {
    mockLocalStorage.setItem(LEARN_PROGRESS_STORAGE_KEY, '{not valid json}');
    expect(loadLocalProgress()).toEqual({});
  });

  it('returns an empty map when the stored value is a JSON array', () => {
    mockLocalStorage.setItem(LEARN_PROGRESS_STORAGE_KEY, '[]');
    expect(loadLocalProgress()).toEqual({});
  });
});

// ─── saveLocalProgress round-trip ─────────────────────────────────────────────

describe('saveLocalProgress', () => {
  it('a saved map round-trips through localStorage', () => {
    const map: ProgressMap = {
      'foundations-1': {
        status: 'in-progress',
        bestScorePct: null,
        completedAt: null,
      },
    };
    saveLocalProgress(map);
    expect(loadLocalProgress()).toEqual(map);
  });
});

// ─── createLearnProgressStore ─────────────────────────────────────────────────

describe('createLearnProgressStore — load', () => {
  it('anonymous load returns the local map without calling the Supabase client', async () => {
    const local: ProgressMap = {
      'foundations-1': {
        status: 'in-progress',
        bestScorePct: null,
        completedAt: null,
      },
    };
    saveLocalProgress(local);

    const client = makeFakeClient();
    const store = createLearnProgressStore(null, client);
    const result = await store.load();

    expect(result).toEqual(local);
    expect(client.calls).toHaveLength(0);
  });

  it('signed-in load merges local in-progress with remote completed into completed', async () => {
    const slug = 'foundations-1';
    const local: ProgressMap = {
      [slug]: { status: 'in-progress', bestScorePct: null, completedAt: null },
    };
    saveLocalProgress(local);

    const remoteRow = {
      lesson_slug: slug,
      status: 'completed',
      best_score_pct: 80,
      completed_at: '2026-07-01T00:00:00.000Z',
      updated_at: '2026-07-01T00:00:00.000Z',
    };

    const client = makeFakeClient({
      select: { data: [remoteRow], error: null },
      upsert: { data: null, error: null },
    });

    const store = createLearnProgressStore('user-1', client);
    const result = await store.load();

    // Merge: remote completed beats local in-progress
    expect(result[slug].status).toBe('completed');
    expect(result[slug].bestScorePct).toBe(80);

    // Merged result was written back to localStorage
    expect(loadLocalProgress()[slug].status).toBe('completed');

    // Both a select and an upsert were issued
    const selectCall = client.calls.find((c) => c.op === 'select');
    const upsertCall = client.calls.find((c) => c.op === 'upsert');
    expect(selectCall).toBeDefined();
    expect(selectCall!.filters['user_id']).toBe('user-1');
    expect(upsertCall).toBeDefined();
  });
});

describe('createLearnProgressStore — markStarted', () => {
  it('saves locally and upserts one row remotely with snake_case fields', async () => {
    const client = makeFakeClient({ upsert: { data: null, error: null } });
    const store = createLearnProgressStore('user-1', client);

    await store.markStarted('foundations-1');

    // Local saved
    expect(loadLocalProgress()['foundations-1'].status).toBe('in-progress');
    expect(loadLocalProgress()['foundations-1'].bestScorePct).toBeNull();

    // Remote upsert with snake_case fields
    const upsertCall = client.calls.find((c) => c.op === 'upsert');
    expect(upsertCall).toBeDefined();
    const row = upsertCall!.payload as Record<string, unknown>;
    expect(row['user_id']).toBe('user-1');
    expect(row['lesson_slug']).toBe('foundations-1');
    expect(row['status']).toBe('in-progress');
    expect(row['best_score_pct']).toBeNull();
  });

  it('a remote upsert failure leaves the local save intact and does not throw', async () => {
    const client = makeFakeClient({
      upsert: { data: null, error: { message: 'network error' } },
    });
    const store = createLearnProgressStore('user-1', client);

    await expect(store.markStarted('foundations-1')).resolves.toBeUndefined();
    expect(loadLocalProgress()['foundations-1'].status).toBe('in-progress');
  });
});

describe('createLearnProgressStore — recordQuiz', () => {
  it('4-of-5 upserts best_score_pct 80 with completed status', async () => {
    const client = makeFakeClient({ upsert: { data: null, error: null } });
    const store = createLearnProgressStore('user-1', client);

    await store.recordQuiz('foundations-1', 4, 5);

    // Local
    const local = loadLocalProgress()['foundations-1'];
    expect(local.status).toBe('completed');
    expect(local.bestScorePct).toBe(80);

    // Remote
    const upsertCall = client.calls.find((c) => c.op === 'upsert');
    expect(upsertCall).toBeDefined();
    const row = upsertCall!.payload as Record<string, unknown>;
    expect(row['best_score_pct']).toBe(80);
    expect(row['status']).toBe('completed');
  });
});

describe('createLearnProgressStore — row mapping', () => {
  it('a remote row missing best_score_pct maps to null without crashing', async () => {
    const remoteRow = {
      lesson_slug: 'foundations-1',
      status: 'in-progress',
      // best_score_pct intentionally absent
      completed_at: null,
      updated_at: '2026-07-01T00:00:00.000Z',
    };

    const client = makeFakeClient({
      select: { data: [remoteRow], error: null },
      upsert: { data: null, error: null },
    });

    const store = createLearnProgressStore('user-1', client);
    const result = await store.load();

    expect(result['foundations-1'].bestScorePct).toBeNull();
  });
});
