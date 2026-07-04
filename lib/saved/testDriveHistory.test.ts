import { describe, it, expect } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  historySnippet,
  rowToHistoryEntry,
  createSupabaseTestDriveHistoryStore,
  SNIPPET_MAX_CHARS,
  type TestDriveRunRow,
} from './testDriveHistory';

// ─── historySnippet ───────────────────────────────────────────────────────────

describe('historySnippet', () => {
  it('returns short output trimmed and unchanged', () => {
    expect(historySnippet('  Hello there  ')).toBe('Hello there');
  });

  it('truncates long output to the cap with an ellipsis', () => {
    const long = 'x'.repeat(SNIPPET_MAX_CHARS + 50);
    const snip = historySnippet(long);
    expect(snip.length).toBeLessThanOrEqual(SNIPPET_MAX_CHARS + 1); // +1 for the ellipsis char
    expect(snip.endsWith('…')).toBe(true);
  });

  it('keeps output exactly at the cap without an ellipsis', () => {
    const exact = 'y'.repeat(SNIPPET_MAX_CHARS);
    expect(historySnippet(exact)).toBe(exact);
  });

  it('respects a custom max', () => {
    expect(historySnippet('abcdef', 3)).toBe('abc…');
  });
});

// ─── rowToHistoryEntry ────────────────────────────────────────────────────────

describe('rowToHistoryEntry', () => {
  it('maps snake_case columns to the domain object', () => {
    const row: TestDriveRunRow = {
      id: 'run-1',
      setup_slug: 'marketing-manager',
      setup_name: 'Marketing Manager',
      scenario_id: 'launch',
      scenario_title: 'Product launch post',
      output_snippet: 'Here is a draft…',
      cached: true,
      created_at: '2026-07-02T14:02:00.000Z',
    };
    expect(rowToHistoryEntry(row)).toEqual({
      id: 'run-1',
      setupSlug: 'marketing-manager',
      setupName: 'Marketing Manager',
      scenarioId: 'launch',
      scenarioTitle: 'Product launch post',
      outputSnippet: 'Here is a draft…',
      cached: true,
      createdAt: '2026-07-02T14:02:00.000Z',
    });
  });
});

// ─── Supabase store (fake client) ─────────────────────────────────────────────

type Canned = Record<string, { data: unknown; error: unknown } | undefined>;

interface Recorded {
  table: string;
  op: string;
  payload?: unknown;
  modifiers: Array<[string, string, unknown]>;
}

function makeFakeClient(canned: Canned) {
  const calls: Recorded[] = [];
  const client = {
    calls,
    from(table: string) {
      const state: Recorded = { table, op: 'select', modifiers: [] };
      function terminal() {
        calls.push(state);
        return Promise.resolve(canned[state.op] ?? { data: null, error: null });
      }
      const builder: Record<string, unknown> = {
        insert(payload: unknown) { state.op = 'insert'; state.payload = payload; return terminal(); },
        select() { return builder; },
        order(col: string, opts: unknown) { state.modifiers.push(['order', col, opts]); return builder; },
        then(resolve: (v: unknown) => unknown, reject: (e: unknown) => unknown) {
          return terminal().then(resolve, reject);
        },
      };
      return builder;
    },
  };
  return client as unknown as SupabaseClient & { calls: Recorded[] };
}

describe('createSupabaseTestDriveHistoryStore', () => {
  it('record inserts the run with a truncated snippet and correct columns', async () => {
    const client = makeFakeClient({ insert: { data: null, error: null } });
    const store = createSupabaseTestDriveHistoryStore(client);
    const output = 'z'.repeat(SNIPPET_MAX_CHARS + 20);

    await store.record({
      userId: 'user-1',
      setupSlug: 'marketing-manager',
      setupName: 'Marketing Manager',
      scenarioId: 'launch',
      scenarioTitle: 'Product launch post',
      output,
      cached: false,
      createdAt: '2026-07-02T14:02:00.000Z',
    });

    const call = client.calls[0];
    expect(call.table).toBe('testdrive_runs');
    expect(call.op).toBe('insert');
    const payload = call.payload as Record<string, unknown>;
    expect(payload.user_id).toBe('user-1');
    expect(payload.setup_slug).toBe('marketing-manager');
    expect(payload.scenario_title).toBe('Product launch post');
    expect(payload.cached).toBe(false);
    expect((payload.output_snippet as string).endsWith('…')).toBe(true);
    expect((payload.output_snippet as string).length).toBeLessThanOrEqual(SNIPPET_MAX_CHARS + 1);
  });

  it('list orders by created_at descending and maps rows', async () => {
    const row: TestDriveRunRow = {
      id: 'run-1', setup_slug: 's', setup_name: 'S', scenario_id: 'sc',
      scenario_title: 'Scenario', output_snippet: 'out', cached: true,
      created_at: '2026-07-02T14:02:00.000Z',
    };
    const client = makeFakeClient({ select: { data: [row], error: null } });
    const store = createSupabaseTestDriveHistoryStore(client);
    const entries = await store.list();
    expect(client.calls[0].modifiers).toContainEqual(['order', 'created_at', { ascending: false }]);
    expect(entries).toHaveLength(1);
    expect(entries[0].scenarioTitle).toBe('Scenario');
    expect(entries[0].cached).toBe(true);
  });

  it('throws when the database returns an error', async () => {
    const client = makeFakeClient({ insert: { data: null, error: { message: 'nope' } } });
    const store = createSupabaseTestDriveHistoryStore(client);
    await expect(
      store.record({
        userId: 'u', setupSlug: 's', setupName: 'S', scenarioId: 'sc',
        scenarioTitle: 'T', output: 'o', cached: false, createdAt: 't',
      }),
    ).rejects.toThrow(/nope/);
  });
});
