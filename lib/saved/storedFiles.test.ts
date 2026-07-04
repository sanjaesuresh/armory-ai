import { describe, it, expect } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  sanitizeFileName,
  storagePathFor,
  rowToStoredFile,
  resolveExportContent,
  createSupabaseStoredFilesStore,
  STORED_FILES_BUCKET,
  type StoredFileRow,
} from './storedFiles';

// ─── Pure helpers ─────────────────────────────────────────────────────────────

describe('sanitizeFileName', () => {
  it('keeps safe characters', () => {
    expect(sanitizeFileName('brand-voice_v2.md')).toBe('brand-voice_v2.md');
  });

  it('replaces spaces and unsafe characters', () => {
    expect(sanitizeFileName('my file (final).txt')).toBe('my_file_final_.txt');
  });

  it('neutralizes path traversal', () => {
    const safe = sanitizeFileName('../../etc/passwd');
    expect(safe).not.toContain('..');
    expect(safe).not.toContain('/');
  });

  it('falls back to a non-empty name', () => {
    expect(sanitizeFileName('///')).toBe('file');
  });
});

describe('storagePathFor', () => {
  it('prefixes with the user id (the RLS ownership key)', () => {
    expect(storagePathFor('user-1', 'voice.md')).toBe('user-1/voice.md');
  });

  it('sanitizes the file segment', () => {
    expect(storagePathFor('user-1', '../secret')).toBe('user-1/secret');
  });
});

describe('rowToStoredFile', () => {
  it('maps snake_case columns', () => {
    const row: StoredFileRow = {
      id: 'f1', knowledge_file_name: 'voice.md', storage_path: 'u/voice.md',
      size_bytes: 42, created_at: 't1', updated_at: 't2',
    };
    expect(rowToStoredFile(row)).toEqual({
      id: 'f1', knowledgeFileName: 'voice.md', storagePath: 'u/voice.md',
      sizeBytes: 42, createdAt: 't1', updatedAt: 't2',
    });
  });
});

describe('resolveExportContent', () => {
  it('prefers fresh in-browser content over a stored copy', () => {
    const res = resolveExportContent('fresh text', { content: 'stored', savedAt: 't' });
    expect(res).toEqual({ content: 'fresh text', source: 'fresh' });
  });

  it('falls back to the stored copy when fresh is absent, tagging the saved date', () => {
    const res = resolveExportContent(undefined, { content: 'stored', savedAt: '2026-07-01T00:00:00.000Z' });
    expect(res).toEqual({ content: 'stored', source: 'stored', savedAt: '2026-07-01T00:00:00.000Z' });
  });

  it('treats empty/whitespace fresh content as absent and uses the stored copy', () => {
    const res = resolveExportContent('   ', { content: 'stored', savedAt: 't' });
    expect(res.source).toBe('stored');
  });

  it('returns none when neither fresh nor stored content exists', () => {
    expect(resolveExportContent(undefined, undefined)).toEqual({ content: '', source: 'none' });
  });
});

// ─── Supabase store (fake client with storage + table) ────────────────────────

interface StorageCall { op: string; path?: string; paths?: string[]; opts?: unknown }
interface TableCall { op: string; payload?: unknown; onConflict?: unknown; modifiers: Array<[string, string, unknown]>; filters: Record<string, unknown> }

function makeFakeClient(opts: {
  upload?: { error: unknown };
  download?: { data: { text: () => Promise<string> } | null; error: unknown };
  remove?: { error: unknown };
  table?: Record<string, { data: unknown; error: unknown }>;
}) {
  const storageCalls: StorageCall[] = [];
  const tableCalls: TableCall[] = [];
  const client = {
    storageCalls,
    tableCalls,
    storage: {
      from(_bucket: string) {
        return {
          upload(path: string, _body: unknown, o: unknown) {
            storageCalls.push({ op: 'upload', path, opts: o });
            return Promise.resolve(opts.upload ?? { error: null });
          },
          download(path: string) {
            storageCalls.push({ op: 'download', path });
            return Promise.resolve(opts.download ?? { data: { text: async () => '' }, error: null });
          },
          remove(paths: string[]) {
            storageCalls.push({ op: 'remove', paths });
            return Promise.resolve(opts.remove ?? { error: null });
          },
        };
      },
    },
    from(_table: string) {
      const state: TableCall = { op: 'select', modifiers: [], filters: {} };
      function terminal() {
        tableCalls.push(state);
        return Promise.resolve(opts.table?.[state.op] ?? { data: null, error: null });
      }
      const builder: Record<string, unknown> = {
        upsert(payload: unknown, o: unknown) { state.op = 'upsert'; state.payload = payload; state.onConflict = o; return builder; },
        delete() { state.op = 'delete'; return builder; },
        select() { return builder; },
        eq(col: string, val: unknown) { state.filters[col] = val; return builder; },
        order(col: string, o: unknown) { state.modifiers.push(['order', col, o]); return builder; },
        single() { return terminal(); },
        then(resolve: (v: unknown) => unknown, reject: (e: unknown) => unknown) { return terminal().then(resolve, reject); },
      };
      return builder;
    },
  };
  return client as unknown as SupabaseClient & { storageCalls: StorageCall[]; tableCalls: TableCall[] };
}

const metaRow: StoredFileRow = {
  id: 'f1', knowledge_file_name: 'voice.md', storage_path: 'user-1/voice.md',
  size_bytes: 5, created_at: 't1', updated_at: 't2',
};

describe('createSupabaseStoredFilesStore', () => {
  it('save uploads to the per-user path (upsert) then upserts metadata on the user+name key', async () => {
    const client = makeFakeClient({ upload: { error: null }, table: { upsert: { data: metaRow, error: null } } });
    const store = createSupabaseStoredFilesStore(client);

    const meta = await store.save({ userId: 'user-1', knowledgeFileName: 'voice.md', content: 'hello' });

    const upload = client.storageCalls.find((c) => c.op === 'upload')!;
    expect(upload.path).toBe('user-1/voice.md');
    expect((upload.opts as { upsert?: boolean }).upsert).toBe(true);

    const upsert = client.tableCalls.find((c) => c.op === 'upsert')!;
    const payload = upsert.payload as Record<string, unknown>;
    expect(payload.user_id).toBe('user-1');
    expect(payload.storage_path).toBe('user-1/voice.md');
    expect(payload.size_bytes).toBe(5);
    expect(upsert.onConflict).toEqual({ onConflict: 'user_id,knowledge_file_name' });
    expect(meta.id).toBe('f1');
  });

  it('does NOT upload when only listing (no implicit persistence)', async () => {
    const client = makeFakeClient({ table: { select: { data: [metaRow], error: null } } });
    const store = createSupabaseStoredFilesStore(client);
    const list = await store.list();
    expect(client.storageCalls).toHaveLength(0);
    expect(list).toHaveLength(1);
    expect(client.tableCalls[0].modifiers).toContainEqual(['order', 'updated_at', { ascending: false }]);
  });

  it('fetchContent downloads by path and returns text', async () => {
    const client = makeFakeClient({ download: { data: { text: async () => 'stored body' }, error: null } });
    const store = createSupabaseStoredFilesStore(client);
    const text = await store.fetchContent('user-1/voice.md');
    expect(client.storageCalls[0]).toEqual({ op: 'download', path: 'user-1/voice.md' });
    expect(text).toBe('stored body');
  });

  it('remove deletes both the storage object and the metadata row', async () => {
    const client = makeFakeClient({ remove: { error: null }, table: { delete: { data: null, error: null } } });
    const store = createSupabaseStoredFilesStore(client);
    await store.remove({ id: 'f1', storagePath: 'user-1/voice.md' });
    expect(client.storageCalls.find((c) => c.op === 'remove')?.paths).toEqual(['user-1/voice.md']);
    const del = client.tableCalls.find((c) => c.op === 'delete')!;
    expect(del.filters).toEqual({ id: 'f1' });
  });

  it('throws when the storage upload fails', async () => {
    const client = makeFakeClient({ upload: { error: { message: 'storage down' } } });
    const store = createSupabaseStoredFilesStore(client);
    await expect(
      store.save({ userId: 'u', knowledgeFileName: 'v.md', content: 'x' }),
    ).rejects.toThrow(/storage down/);
  });

  it('uses the default private bucket', () => {
    expect(STORED_FILES_BUCKET).toBe('user-files');
  });
});
