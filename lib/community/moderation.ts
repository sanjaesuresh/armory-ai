/**
 * Moderation transitions (Phase 5 Task 6) — the human pass of the review gate.
 *
 * Only moderators approve, reject, or take down a setup. The moderator gate is
 * an allowlist checked server-side (the `moderators` table); these run through
 * the service role (RLS-bypassing) because approving/rejecting sets a status the
 * author's own policies forbid. Every action writes a `review_audit` row (who,
 * transition, note, when). Reject and takedown require a note — the author sees
 * it verbatim.
 *
 * SERVER ONLY.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { SetupRow } from '@/lib/catalog/repository';

export type ModerationAction = 'approve' | 'reject' | 'takedown';

export interface AuditRow {
  setup_id: string;
  moderator_id: string;
  action: ModerationAction;
  from_status: string;
  to_status: string;
  note: string | null;
  created_at: string;
}

export interface ModerationStore {
  isModerator(userId: string): Promise<boolean>;
  getRow(id: string): Promise<SetupRow | null>;
  updateRow(id: string, patch: Record<string, unknown>): Promise<void>;
  writeAudit(row: AuditRow): Promise<void>;
  listPending(): Promise<SetupRow[]>;
}

/** Thrown when a non-moderator attempts a moderation action. */
export class NotModeratorError extends Error {
  constructor() {
    super('not authorized: moderator only');
    this.name = 'NotModeratorError';
  }
}

/** Pure: builds an audit row for a transition. */
export function buildAuditRow(params: {
  setupId: string;
  moderatorId: string;
  action: ModerationAction;
  fromStatus: string;
  toStatus: string;
  note: string | null;
  now: string;
}): AuditRow {
  return {
    setup_id: params.setupId,
    moderator_id: params.moderatorId,
    action: params.action,
    from_status: params.fromStatus,
    to_status: params.toStatus,
    note: params.note,
    created_at: params.now,
  };
}

async function requireModerator(moderatorId: string, store: ModerationStore): Promise<void> {
  if (!(await store.isModerator(moderatorId))) throw new NotModeratorError();
}

async function loadPendingOrThrow(
  setupId: string,
  store: ModerationStore,
  expected: string,
): Promise<SetupRow> {
  const row = await store.getRow(setupId);
  if (!row) throw new Error(`setup ${setupId} not found`);
  if (row.review_status !== expected) {
    throw new Error(`expected ${expected} setup, was ${row.review_status}`);
  }
  return row;
}

/** Approve a pending submission → approved (publicly listed). Writes an audit row. */
export async function approve(
  setupId: string,
  moderatorId: string,
  store: ModerationStore,
  now: string,
): Promise<void> {
  await requireModerator(moderatorId, store);
  await loadPendingOrThrow(setupId, store, 'pending');
  await store.updateRow(setupId, { review_status: 'approved', review_note: null, updated_at: now });
  await store.writeAudit(
    buildAuditRow({ setupId, moderatorId, action: 'approve', fromStatus: 'pending', toStatus: 'approved', note: null, now }),
  );
}

/** Reject a pending submission → rejected. A note is required; the author sees it verbatim. */
export async function reject(
  setupId: string,
  moderatorId: string,
  note: string,
  store: ModerationStore,
  now: string,
): Promise<void> {
  await requireModerator(moderatorId, store);
  const trimmed = note?.trim() ?? '';
  if (trimmed === '') throw new Error('a rejection note is required');
  await loadPendingOrThrow(setupId, store, 'pending');
  await store.updateRow(setupId, { review_status: 'rejected', review_note: trimmed, updated_at: now });
  await store.writeAudit(
    buildAuditRow({ setupId, moderatorId, action: 'reject', fromStatus: 'pending', toStatus: 'rejected', note: trimmed, now }),
  );
}

/**
 * Take down a published setup → rejected (with a required note). It vanishes from
 * public queries immediately (reads are approved-only). Writes an audit row.
 */
export async function takedown(
  setupId: string,
  moderatorId: string,
  note: string,
  store: ModerationStore,
  now: string,
): Promise<void> {
  await requireModerator(moderatorId, store);
  const trimmed = note?.trim() ?? '';
  if (trimmed === '') throw new Error('a takedown note is required');
  const row = await loadPendingOrThrow(setupId, store, 'approved');
  if (row.source === 'curated') {
    throw new Error('curated setups cannot be taken down');
  }
  await store.updateRow(setupId, { review_status: 'rejected', review_note: trimmed, updated_at: now });
  await store.writeAudit(
    buildAuditRow({ setupId, moderatorId, action: 'takedown', fromStatus: 'approved', toStatus: 'rejected', note: trimmed, now }),
  );
}

// ─── Supabase-backed store (service role) ─────────────────────────────────────

/**
 * Service-role store for moderation. The caller must pass the service client —
 * moderation writes statuses that RLS forbids to authors, and reads the
 * moderators allowlist which has no client policies.
 */
export function createSupabaseModerationStore(serviceClient: SupabaseClient): ModerationStore {
  return {
    async isModerator(userId) {
      const { data, error } = await serviceClient
        .from('moderators')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw new Error(`moderator check failed: ${error.message}`);
      return data !== null;
    },
    async getRow(id) {
      const { data, error } = await serviceClient.from('setups').select('*').eq('id', id).maybeSingle();
      if (error) throw new Error(`setup load failed: ${error.message}`);
      return (data as SetupRow) ?? null;
    },
    async updateRow(id, patch) {
      const { error } = await serviceClient.from('setups').update(patch).eq('id', id);
      if (error) throw new Error(`setup update failed: ${error.message}`);
    },
    async writeAudit(row) {
      const { error } = await serviceClient.from('review_audit').insert(row);
      if (error) throw new Error(`audit write failed: ${error.message}`);
    },
    async listPending() {
      const { data, error } = await serviceClient
        .from('setups')
        .select('*')
        .eq('review_status', 'pending')
        .order('updated_at', { ascending: true });
      if (error) throw new Error(`pending list failed: ${error.message}`);
      return data as SetupRow[];
    },
  };
}
