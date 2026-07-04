/**
 * Row-level-security integration tests for the Phase 4 owner-scoped tables.
 *
 * REQUIRES A LOCAL SUPABASE INSTANCE — it does not run in CI or a sandbox
 * without one, and skips cleanly (never fails) when the env vars below are
 * absent.
 *
 * Setup:
 *   1. supabase start
 *   2. Apply supabase/schema.sql to the local db (e.g. via `supabase db reset`
 *      after converting schema.sql to a migration, or `psql` the file).
 *   3. Export from `supabase status`:
 *        LOCAL_SUPABASE_URL=http://127.0.0.1:54321
 *        LOCAL_SUPABASE_ANON_KEY=<anon key>
 *        LOCAL_SUPABASE_SERVICE_ROLE_KEY=<service_role key>
 *   4. npm test tests/rls.test.ts
 *
 * The test creates two throwaway users via the admin API, then asserts that RLS
 * isolates their rows. It cleans up the users it creates.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL = process.env.LOCAL_SUPABASE_URL;
const ANON = process.env.LOCAL_SUPABASE_ANON_KEY;
const SERVICE = process.env.LOCAL_SUPABASE_SERVICE_ROLE_KEY;

const hasLocal = Boolean(URL && ANON && SERVICE);
if (!hasLocal) {
  // eslint-disable-next-line no-console
  console.warn(
    '[rls.test] Skipping — set LOCAL_SUPABASE_URL / _ANON_KEY / _SERVICE_ROLE_KEY (see file header) to run against local Supabase.',
  );
}

describe.skipIf(!hasLocal)('RLS: owner-scoped account tables', () => {
  let admin: SupabaseClient;
  let userA: { id: string; email: string; client: SupabaseClient };
  let userB: { id: string; email: string; client: SupabaseClient };
  let anon: SupabaseClient;

  const password = 'test-password-123!';

  async function makeUser(tag: string) {
    const email = `rls-${tag}-${Date.now()}@example.test`;
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error || !data.user) throw error ?? new Error('createUser failed');
    const client = createClient(URL!, ANON!);
    const signIn = await client.auth.signInWithPassword({ email, password });
    if (signIn.error) throw signIn.error;
    return { id: data.user.id, email, client };
  }

  beforeAll(async () => {
    admin = createClient(URL!, SERVICE!, { auth: { persistSession: false } });
    anon = createClient(URL!, ANON!);
    userA = await makeUser('a');
    userB = await makeUser('b');
  });

  afterAll(async () => {
    if (userA) await admin.auth.admin.deleteUser(userA.id).catch(() => {});
    if (userB) await admin.auth.admin.deleteUser(userB.id).catch(() => {});
  });

  it('a user can full-CRUD their own saved setups', async () => {
    const ins = await userA.client
      .from('saved_setups')
      .insert({ user_id: userA.id, setup_id: 'marketing-manager', setup_version: '1.0.0', name: 'Mine', answers: { brandName: 'Acme' } })
      .select()
      .single();
    expect(ins.error).toBeNull();
    expect(ins.data?.name).toBe('Mine');

    const read = await userA.client.from('saved_setups').select('*');
    expect(read.error).toBeNull();
    expect(read.data?.length).toBe(1);

    const upd = await userA.client
      .from('saved_setups')
      .update({ name: 'Renamed' })
      .eq('id', ins.data!.id)
      .select();
    expect(upd.data?.[0]?.name).toBe('Renamed');

    const del = await userA.client.from('saved_setups').delete().eq('id', ins.data!.id).select();
    expect(del.data?.length).toBe(1);
  });

  it("user B cannot select, update, or delete user A's saved setups", async () => {
    const ins = await userA.client
      .from('saved_setups')
      .insert({ user_id: userA.id, setup_id: 'marketing-manager', setup_version: '1.0.0', name: 'A only', answers: {} })
      .select()
      .single();
    expect(ins.error).toBeNull();
    const rowId = ins.data!.id;

    // B sees none of A's rows.
    const bRead = await userB.client.from('saved_setups').select('*');
    expect(bRead.data?.length).toBe(0);

    // B's update/delete affect zero rows (RLS filters them out; no error, no change).
    const bUpd = await userB.client.from('saved_setups').update({ name: 'hacked' }).eq('id', rowId).select();
    expect(bUpd.data?.length ?? 0).toBe(0);
    const bDel = await userB.client.from('saved_setups').delete().eq('id', rowId).select();
    expect(bDel.data?.length ?? 0).toBe(0);

    // The row is untouched from A's side.
    const aRead = await userA.client.from('saved_setups').select('name').eq('id', rowId).single();
    expect(aRead.data?.name).toBe('A only');
    await userA.client.from('saved_setups').delete().eq('id', rowId);
  });

  it('an anonymous client cannot select any saved setups', async () => {
    await userA.client
      .from('saved_setups')
      .insert({ user_id: userA.id, setup_id: 'x', setup_version: '1.0.0', name: 'A', answers: {} });
    const res = await anon.from('saved_setups').select('*');
    // Either an empty set (RLS) — never another user's rows.
    expect(res.data?.length ?? 0).toBe(0);
    await userA.client.from('saved_setups').delete().eq('user_id', userA.id);
  });

  it('stored-file metadata is invisible across users', async () => {
    await userA.client
      .from('stored_files')
      .insert({ user_id: userA.id, knowledge_file_name: 'voice.md', storage_path: `${userA.id}/voice.md`, size_bytes: 10 });
    const bRead = await userB.client.from('stored_files').select('*');
    expect(bRead.data?.length).toBe(0);
    const aRead = await userA.client.from('stored_files').select('*');
    expect(aRead.data?.length).toBe(1);
    await userA.client.from('stored_files').delete().eq('user_id', userA.id);
  });

  it('test-drive history rows are readable only by their owner', async () => {
    await userA.client.from('testdrive_runs').insert({
      user_id: userA.id,
      setup_slug: 'marketing-manager',
      setup_name: 'Marketing Manager',
      scenario_id: 'launch',
      scenario_title: 'Product launch post',
      output_snippet: 'A draft…',
      cached: false,
    });
    const bRead = await userB.client.from('testdrive_runs').select('*');
    expect(bRead.data?.length).toBe(0);
    const aRead = await userA.client.from('testdrive_runs').select('*');
    expect(aRead.data?.length).toBe(1);
    await userA.client.from('testdrive_runs').delete().eq('user_id', userA.id);
  });

  // ── Phase 5: community authoring / moderation authz ──────────────────────────

  const draftRow = (userId: string, id: string) => ({
    id,
    slug: id,
    name: 'Draft',
    tagline: 'A draft',
    description: 'A draft setup',
    role: 'sales-rep',
    category: 'sales',
    source: 'community',
    author: userId,
    version: '0.1.0',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    review_status: 'draft',
    tier: 'core',
    instruction_template: 'You write emails.',
  });

  it("author B cannot read or edit author A's draft; anon sees no drafts", async () => {
    const id = `draft-a-${Date.now()}`;
    const ins = await userA.client.from('setups').insert(draftRow(userA.id, id)).select().single();
    expect(ins.error).toBeNull();

    // B sees none of A's drafts (only approved rows are public).
    const bRead = await userB.client.from('setups').select('*').eq('id', id);
    expect(bRead.data?.length ?? 0).toBe(0);
    // B's update affects zero rows.
    const bUpd = await userB.client.from('setups').update({ name: 'hacked' }).eq('id', id).select();
    expect(bUpd.data?.length ?? 0).toBe(0);
    // Anonymous sees no drafts.
    const anonRead = await anon.from('setups').select('*').eq('id', id);
    expect(anonRead.data?.length ?? 0).toBe(0);

    await userA.client.from('setups').delete().eq('id', id);
  });

  it('an author cannot flip their own draft to approved (only moderators, via service role)', async () => {
    const id = `draft-approve-${Date.now()}`;
    await userA.client.from('setups').insert(draftRow(userA.id, id));
    const upd = await userA.client.from('setups').update({ review_status: 'approved' }).eq('id', id).select();
    // The WITH CHECK forbids approved — the row is not updated to approved.
    expect(upd.data?.length ?? 0).toBe(0);
    const check = await userA.client.from('setups').select('review_status').eq('id', id).single();
    expect(check.data?.review_status).toBe('draft');
    await userA.client.from('setups').delete().eq('id', id);
  });

  it('an author CAN reopen their own rejected setup (rejected → draft) but not to approved', async () => {
    const id = `draft-reopen-${Date.now()}`;
    // Seed a rejected row owned by A (service role, since authors cannot self-reject).
    await admin.from('setups').insert({ ...draftRow(userA.id, id), review_status: 'rejected' });

    // Reopen: rejected → draft is allowed (USING includes rejected, CHECK allows draft).
    const reopen = await userA.client.from('setups').update({ review_status: 'draft' }).eq('id', id).select();
    expect(reopen.data?.length).toBe(1);
    expect(reopen.data?.[0]?.review_status).toBe('draft');

    // But the author still cannot jump a rejected row straight to approved.
    await admin.from('setups').update({ review_status: 'rejected' }).eq('id', id);
    const cheat = await userA.client.from('setups').update({ review_status: 'approved' }).eq('id', id).select();
    expect(cheat.data?.length ?? 0).toBe(0);

    await admin.from('setups').delete().eq('id', id);
  });

  it('upvotes and reports are owner-scoped across users', async () => {
    const setupId = `up-setup-${Date.now()}`;
    await admin.from('setups').insert({ ...draftRow(userA.id, setupId), review_status: 'approved' });

    await userA.client.from('upvotes').insert({ user_id: userA.id, setup_id: setupId });
    const bUp = await userB.client.from('upvotes').select('*').eq('setup_id', setupId);
    expect(bUp.data?.length ?? 0).toBe(0); // B cannot see A's upvote row

    await userA.client.from('reports').insert({ reporter_id: userA.id, setup_id: setupId, reason: 'spam' });
    const bReports = await userB.client.from('reports').select('*').eq('setup_id', setupId);
    expect(bReports.data?.length ?? 0).toBe(0); // B cannot read A's report

    await userA.client.from('upvotes').delete().eq('setup_id', setupId);
    await userA.client.from('reports').delete().eq('setup_id', setupId);
    await admin.from('setups').delete().eq('id', setupId);
  });
});
