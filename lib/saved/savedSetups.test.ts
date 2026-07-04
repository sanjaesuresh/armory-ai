import { describe, it, expect } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  reconcileAnswers,
  rowToSavedSetup,
  createSupabaseSavedSetupsStore,
  type SavedSetupRow,
} from './savedSetups';

// ─── reconcileAnswers ─────────────────────────────────────────────────────────

describe('reconcileAnswers', () => {
  it('keeps answers whose keys exist in the current setup', () => {
    const res = reconcileAnswers({ a: 'x', b: 'y' }, ['a', 'b']);
    expect(res.answers).toEqual({ a: 'x', b: 'y' });
    expect(res.droppedKeys).toEqual([]);
  });

  it('drops answers for variables absent from the current setup and reports them', () => {
    const res = reconcileAnswers(
      { keep: 'v', gone1: 'old', gone2: ['a'] },
      ['keep'],
    );
    expect(res.answers).toEqual({ keep: 'v' });
    expect(res.droppedKeys.sort()).toEqual(['gone1', 'gone2']);
  });

  it('preserves falsy-but-present values (false, 0, empty array) for known keys', () => {
    const res = reconcileAnswers(
      { flag: false, count: 0, list: [] },
      ['flag', 'count', 'list'],
    );
    expect(res.answers).toEqual({ flag: false, count: 0, list: [] });
    expect(res.droppedKeys).toEqual([]);
  });

  it('returns an empty result for empty saved answers', () => {
    const res = reconcileAnswers({}, ['a']);
    expect(res.answers).toEqual({});
    expect(res.droppedKeys).toEqual([]);
  });
});

// ─── rowToSavedSetup ──────────────────────────────────────────────────────────

describe('rowToSavedSetup', () => {
  it('maps snake_case columns to the domain object', () => {
    const row: SavedSetupRow = {
      id: 'uuid-1',
      user_id: 'user-1',
      setup_id: 'marketing-manager',
      setup_version: '1.2.0',
      name: 'My brand voice',
      answers: { brandName: 'Acme', tone: ['warm', 'direct'] },
      created_at: '2026-07-01T00:00:00.000Z',
      updated_at: '2026-07-02T00:00:00.000Z',
    };
    expect(rowToSavedSetup(row)).toEqual({
      id: 'uuid-1',
      userId: 'user-1',
      setupId: 'marketing-manager',
      setupVersion: '1.2.0',
      name: 'My brand voice',
      answers: { brandName: 'Acme', tone: ['warm', 'direct'] },
      createdAt: '2026-07-01T00:00:00.000Z',
      updatedAt: '2026-07-02T00:00:00.000Z',
    });
  });

  it('defaults a null answers column to an empty object', () => {
    const row = {
      id: 'x', user_id: 'u', setup_id: 's', setup_version: '1.0.0',
      name: 'n', answers: null, created_at: 't', updated_at: 't',
    } as unknown as SavedSetupRow;
    expect(rowToSavedSetup(row).answers).toEqual({});
  });
});

// ─── Supabase store (fake client) ─────────────────────────────────────────────
//
// A minimal chainable fake that records the table/op/payload/filters/modifiers
// and resolves to a canned result keyed by operation. Guards the column names
// and query shape the store depends on without a live database.

type Canned = Record<string, { data: unknown; error: unknown } | undefined>;

interface Recorded {
  table: string;
  op: string;
  payload?: unknown;
  filters: Record<string, unknown>;
  modifiers: Array<[string, string, unknown]>;
  single?: boolean;
  maybe?: boolean;
}

function makeFakeClient(canned: Canned) {
  const calls: Recorded[] = [];
  const client = {
    calls,
    from(table: string) {
      const state: Recorded = { table, op: 'select', filters: {}, modifiers: [] };
      function terminal() {
        calls.push(state);
        return Promise.resolve(canned[state.op] ?? { data: null, error: null });
      }
      const builder: Record<string, unknown> = {
        insert(payload: unknown) { state.op = 'insert'; state.payload = payload; return builder; },
        update(payload: unknown) { state.op = 'update'; state.payload = payload; return builder; },
        delete() { state.op = 'delete'; return builder; },
        select() { return builder; },
        eq(col: string, val: unknown) { state.filters[col] = val; return builder; },
        order(col: string, opts: unknown) { state.modifiers.push(['order', col, opts]); return builder; },
        single() { state.single = true; return terminal(); },
        maybeSingle() { state.maybe = true; return terminal(); },
        then(resolve: (v: unknown) => unknown, reject: (e: unknown) => unknown) {
          return terminal().then(resolve, reject);
        },
      };
      return builder;
    },
  };
  return client as unknown as SupabaseClient & { calls: Recorded[] };
}

const sampleRow: SavedSetupRow = {
  id: 'row-1', user_id: 'user-1', setup_id: 'marketing-manager',
  setup_version: '1.0.0', name: 'Mine', answers: { brandName: 'Acme' },
  created_at: 't1', updated_at: 't2',
};

describe('createSupabaseSavedSetupsStore', () => {
  it('save inserts exactly the setup id, version, name and answers, and returns the mapped row', async () => {
    const client = makeFakeClient({ insert: { data: sampleRow, error: null } });
    const store = createSupabaseSavedSetupsStore(client);
    const answers = { brandName: 'Acme' };

    const saved = await store.save({
      userId: 'user-1', setupId: 'marketing-manager',
      setupVersion: '1.0.0', name: 'Mine', answers,
    });

    const call = client.calls[0];
    expect(call.table).toBe('saved_setups');
    expect(call.op).toBe('insert');
    expect(call.payload).toEqual({
      user_id: 'user-1',
      setup_id: 'marketing-manager',
      setup_version: '1.0.0',
      name: 'Mine',
      answers, // exactly the current answers — no extra keys
    });
    expect(saved.id).toBe('row-1');
    expect(saved.answers).toEqual({ brandName: 'Acme' });
  });

  it('list orders by updated_at descending and maps rows', async () => {
    const client = makeFakeClient({ select: { data: [sampleRow], error: null } });
    const store = createSupabaseSavedSetupsStore(client);
    const rows = await store.list();
    expect(client.calls[0].modifiers).toContainEqual(['order', 'updated_at', { ascending: false }]);
    expect(rows).toHaveLength(1);
    expect(rows[0].name).toBe('Mine');
  });

  it('load fetches by id via maybeSingle and returns null when absent', async () => {
    const client = makeFakeClient({ select: { data: null, error: null } });
    const store = createSupabaseSavedSetupsStore(client);
    const res = await store.load('missing');
    expect(client.calls[0].filters).toEqual({ id: 'missing' });
    expect(client.calls[0].maybe).toBe(true);
    expect(res).toBeNull();
  });

  it('rename issues an update with the new name filtered by id', async () => {
    const client = makeFakeClient({ update: { data: null, error: null } });
    const store = createSupabaseSavedSetupsStore(client);
    await store.rename('row-1', 'Renamed');
    const call = client.calls[0];
    expect(call.op).toBe('update');
    expect((call.payload as { name: string }).name).toBe('Renamed');
    expect(call.filters).toEqual({ id: 'row-1' });
  });

  it('remove issues a delete filtered by id', async () => {
    const client = makeFakeClient({ delete: { data: null, error: null } });
    const store = createSupabaseSavedSetupsStore(client);
    await store.remove('row-1');
    expect(client.calls[0].op).toBe('delete');
    expect(client.calls[0].filters).toEqual({ id: 'row-1' });
  });

  it('throws when the database returns an error', async () => {
    const client = makeFakeClient({ insert: { data: null, error: { message: 'boom' } } });
    const store = createSupabaseSavedSetupsStore(client);
    await expect(
      store.save({ userId: 'u', setupId: 's', setupVersion: '1.0.0', name: 'n', answers: {} }),
    ).rejects.toThrow(/boom/);
  });
});
