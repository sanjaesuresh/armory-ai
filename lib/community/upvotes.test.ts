import { describe, it, expect } from 'vitest';
import { toggleUpvote, createSupabaseUpvotesStore, type UpvotesStore } from './upvotes';
import type { SupabaseClient } from '@supabase/supabase-js';

/** In-memory upvotes store: a Set of "user|setup" keys. */
function memStore(initial: string[] = []) {
  const set = new Set(initial);
  const key = (u: string, s: string) => `${u}|${s}`;
  const store: UpvotesStore = {
    async has(u, s) { return set.has(key(u, s)); },
    async add(u, s) { set.add(key(u, s)); },
    async remove(u, s) { set.delete(key(u, s)); },
    async count(s) { return [...set].filter((k) => k.endsWith(`|${s}`)).length; },
  };
  return { store, set };
}

describe('toggleUpvote', () => {
  it('adds an upvote when absent and returns the new count', async () => {
    const { store, set } = memStore();
    const res = await toggleUpvote({ userId: 'u1', setupId: 's1' }, store, 'T');
    expect(res.upvoted).toBe(true);
    expect(res.count).toBe(1);
    expect(set.has('u1|s1')).toBe(true);
  });

  it('removes an existing upvote when present', async () => {
    const { store, set } = memStore(['u1|s1']);
    const res = await toggleUpvote({ userId: 'u1', setupId: 's1' }, store, 'T');
    expect(res.upvoted).toBe(false);
    expect(res.count).toBe(0);
    expect(set.has('u1|s1')).toBe(false);
  });

  it('counts one vote per user per setup across users', async () => {
    const { store } = memStore(['u1|s1']);
    const res = await toggleUpvote({ userId: 'u2', setupId: 's1' }, store, 'T');
    expect(res.upvoted).toBe(true);
    expect(res.count).toBe(2);
  });

  it('toggling twice returns to the original state', async () => {
    const { store } = memStore();
    await toggleUpvote({ userId: 'u1', setupId: 's1' }, store, 'T');
    const off = await toggleUpvote({ userId: 'u1', setupId: 's1' }, store, 'T');
    expect(off.upvoted).toBe(false);
    expect(off.count).toBe(0);
  });
});

// ─── createSupabaseUpvotesStore – add (23505 duplicate) ───────────────────────

function makeFakeUpvotesClient(insertError: { message: string; code?: string } | null) {
  const client = {
    from(_table: string) {
      return {
        insert(_row: unknown) {
          return Promise.resolve({ error: insertError });
        },
      };
    },
  };
  return client as unknown as SupabaseClient;
}

describe('createSupabaseUpvotesStore – add', () => {
  it('resolves without throwing when insert returns a 23505 unique-violation (concurrent double-add)', async () => {
    const client = makeFakeUpvotesClient({ message: 'duplicate key', code: '23505' });
    const store = createSupabaseUpvotesStore(client);
    // Must not throw — a duplicate is already upvoted, which is success.
    await expect(store.add('u1', 's1', 'T')).resolves.toBeUndefined();
  });

  it('throws for non-23505 insert errors', async () => {
    const client = makeFakeUpvotesClient({ message: 'permission denied', code: '42501' });
    const store = createSupabaseUpvotesStore(client);
    await expect(store.add('u1', 's1', 'T')).rejects.toThrow(/upvote add failed/);
  });
});
