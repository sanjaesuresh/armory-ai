import { describe, it, expect } from 'vitest';
import { fileReport, isValidReason, REPORT_REASONS, REPORT_NOTE_MAX, type ReportsStore } from './reports';

function memStore(opts: { duplicate?: boolean } = {}) {
  const inserted: unknown[] = [];
  const store: ReportsStore = {
    async insert(row) {
      if (opts.duplicate) return { duplicate: true };
      inserted.push(row);
      return { duplicate: false };
    },
  };
  return { store, inserted };
}

describe('isValidReason', () => {
  it('accepts the closed set and rejects anything else', () => {
    for (const r of REPORT_REASONS) expect(isValidReason(r)).toBe(true);
    expect(isValidReason('nonsense')).toBe(false);
    expect(isValidReason('')).toBe(false);
  });
});

describe('fileReport', () => {
  it('files a valid report', async () => {
    const { store, inserted } = memStore();
    const res = await fileReport({ reporterId: 'u1', setupId: 's1', reason: 'spam', note: '  bad  ' }, store, 'T');
    expect(res.ok).toBe(true);
    expect(inserted).toHaveLength(1);
    expect((inserted[0] as { note: string }).note).toBe('bad'); // trimmed
  });

  it('rejects an unknown reason without inserting', async () => {
    const { store, inserted } = memStore();
    const res = await fileReport({ reporterId: 'u1', setupId: 's1', reason: 'whatever' }, store, 'T');
    expect(res).toEqual({ ok: false, code: 'invalid-reason' });
    expect(inserted).toHaveLength(0);
  });

  it('rate-limits a duplicate report (one per user per setup)', async () => {
    const { store } = memStore({ duplicate: true });
    const res = await fileReport({ reporterId: 'u1', setupId: 's1', reason: 'spam' }, store, 'T');
    expect(res).toEqual({ ok: false, code: 'already-reported' });
  });

  it('stores a null note when none is given', async () => {
    const { store, inserted } = memStore();
    await fileReport({ reporterId: 'u1', setupId: 's1', reason: 'broken' }, store, 'T');
    expect((inserted[0] as { note: string | null }).note).toBeNull();
  });

  it('truncates an over-long note to REPORT_NOTE_MAX before storing', async () => {
    const { store, inserted } = memStore();
    const overlong = 'x'.repeat(REPORT_NOTE_MAX + 500);
    await fileReport({ reporterId: 'u1', setupId: 's1', reason: 'spam', note: overlong }, store, 'T');
    const stored = (inserted[0] as { note: string }).note;
    expect(stored.length).toBeLessThanOrEqual(REPORT_NOTE_MAX);
    expect(stored).toBe('x'.repeat(REPORT_NOTE_MAX));
  });
});
