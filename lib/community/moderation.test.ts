import { describe, it, expect } from 'vitest';
import type { SetupRow } from '@/lib/catalog/repository';
import {
  approve,
  reject,
  takedown,
  buildAuditRow,
  NotModeratorError,
  type ModerationStore,
  type AuditRow,
} from './moderation';

function baseRow(status: string): SetupRow {
  return {
    id: 'setup-1', slug: 'setup-1', name: 'S', tagline: 't', description: 'd',
    role: 'sales-rep', industry: null, tags: [], category: 'sales', source: 'community',
    author: 'author-1', version: '0.1.0', created_at: 't', updated_at: 't',
    review_status: status, upvotes: 0, featured: null, popularity: 0, targets: ['claude-app'],
    tier: 'core', instruction_template: 'x', variables: [], knowledge_files: [], scenarios: [],
  } as SetupRow;
}

function memStore(opts: { moderator: boolean; status: string }) {
  const row = { ...baseRow(opts.status) } as Record<string, unknown>;
  const audits: AuditRow[] = [];
  const store: ModerationStore = {
    async isModerator() { return opts.moderator; },
    async getRow() { return row as unknown as SetupRow; },
    async updateRow(_id, patch) { Object.assign(row, patch); },
    async writeAudit(a) { audits.push(a); },
    async listPending() { return [row as unknown as SetupRow]; },
  };
  return { store, row, audits };
}

describe('buildAuditRow', () => {
  it('captures actor, transition, note, and time', () => {
    const a = buildAuditRow({ setupId: 's', moderatorId: 'm', action: 'reject', fromStatus: 'pending', toStatus: 'rejected', note: 'no', now: 'T' });
    expect(a).toEqual({ setup_id: 's', moderator_id: 'm', action: 'reject', from_status: 'pending', to_status: 'rejected', note: 'no', created_at: 'T' });
  });
});

describe('moderator gate', () => {
  it('refuses approve / reject / takedown for a non-moderator', async () => {
    const { store } = memStore({ moderator: false, status: 'pending' });
    await expect(approve('setup-1', 'nobody', store, 'T')).rejects.toBeInstanceOf(NotModeratorError);
    await expect(reject('setup-1', 'nobody', 'note', store, 'T')).rejects.toBeInstanceOf(NotModeratorError);
    const approved = memStore({ moderator: false, status: 'approved' });
    await expect(takedown('setup-1', 'nobody', 'note', approved.store, 'T')).rejects.toBeInstanceOf(NotModeratorError);
  });
});

describe('approve', () => {
  it('moves pending → approved and writes an audit row', async () => {
    const { store, row, audits } = memStore({ moderator: true, status: 'pending' });
    await approve('setup-1', 'mod-1', store, 'T');
    expect(row.review_status).toBe('approved');
    expect(row.review_note).toBeNull();
    expect(audits).toHaveLength(1);
    expect(audits[0].action).toBe('approve');
    expect(audits[0].moderator_id).toBe('mod-1');
  });
  it('refuses to approve a non-pending setup', async () => {
    const { store } = memStore({ moderator: true, status: 'draft' });
    await expect(approve('setup-1', 'mod-1', store, 'T')).rejects.toThrow(/pending/);
  });
});

describe('reject', () => {
  it('requires a note', async () => {
    const { store, row } = memStore({ moderator: true, status: 'pending' });
    await expect(reject('setup-1', 'mod-1', '   ', store, 'T')).rejects.toThrow(/note/);
    expect(row.review_status).toBe('pending'); // unchanged
  });
  it('moves pending → rejected, stores the note, and audits', async () => {
    const { store, row, audits } = memStore({ moderator: true, status: 'pending' });
    await reject('setup-1', 'mod-1', 'Remove the override line.', store, 'T');
    expect(row.review_status).toBe('rejected');
    expect(row.review_note).toBe('Remove the override line.');
    expect(audits[0].action).toBe('reject');
    expect(audits[0].note).toBe('Remove the override line.');
  });
});

describe('takedown', () => {
  it('reverts approved → rejected with a note and vanishes from public (status no longer approved)', async () => {
    const { store, row, audits } = memStore({ moderator: true, status: 'approved' });
    await takedown('setup-1', 'mod-1', 'Reported for impersonation.', store, 'T');
    expect(row.review_status).toBe('rejected');
    expect(row.review_note).toBe('Reported for impersonation.');
    expect(audits[0].action).toBe('takedown');
  });
  it('requires a note and refuses a non-approved setup', async () => {
    const pending = memStore({ moderator: true, status: 'pending' });
    await expect(takedown('setup-1', 'mod-1', 'x', pending.store, 'T')).rejects.toThrow(/approved/);
    const approved = memStore({ moderator: true, status: 'approved' });
    await expect(takedown('setup-1', 'mod-1', '  ', approved.store, 'T')).rejects.toThrow(/note/);
  });
  it('refuses takedown of an approved curated setup', async () => {
    // Build a store that returns source:'curated' — a setup from the Armory catalog.
    const curatedRow = { ...baseRow('approved'), source: 'curated' } as unknown as SetupRow;
    const store: ModerationStore = {
      async isModerator() { return true; },
      async getRow() { return curatedRow; },
      async updateRow() {},
      async writeAudit() {},
      async listPending() { return []; },
    };
    await expect(takedown('setup-1', 'mod-1', 'some note', store, 'T')).rejects.toThrow(
      /curated setups cannot be taken down/,
    );
  });

  it('allows takedown of an approved ai-generated setup', async () => {
    const aiRow = { ...baseRow('approved'), source: 'ai-generated' } as unknown as SetupRow;
    const audits: AuditRow[] = [];
    let storedStatus = 'approved';
    const store: ModerationStore = {
      async isModerator() { return true; },
      async getRow() { return { ...aiRow, review_status: storedStatus } as unknown as SetupRow; },
      async updateRow(_id, patch) {
        if (typeof patch.review_status === 'string') storedStatus = patch.review_status;
        Object.assign(aiRow, patch);
      },
      async writeAudit(a) { audits.push(a); },
      async listPending() { return []; },
    };
    await takedown('setup-1', 'mod-1', 'Harmful content in AI-generated setup.', store, 'T');
    expect(storedStatus).toBe('rejected');
    expect(audits).toHaveLength(1);
    expect(audits[0].action).toBe('takedown');
  });
});
