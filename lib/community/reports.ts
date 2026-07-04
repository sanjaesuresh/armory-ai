/**
 * Community reports (Phase 5 Task 6). A signed-in user reports an approved setup
 * with a reason from a closed set and an optional note. The unique (reporter,
 * setup) pair rate-limits to one report per user per setup; repeated reports
 * surface the setup in the moderator queue.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export const REPORT_REASONS = ['spam', 'harmful', 'broken', 'impersonation', 'other'] as const;
export const REPORT_NOTE_MAX = 1000;
export type ReportReason = (typeof REPORT_REASONS)[number];

export function isValidReason(reason: string): reason is ReportReason {
  return (REPORT_REASONS as readonly string[]).includes(reason);
}

export interface FileReportInput {
  reporterId: string;
  setupId: string;
  reason: string;
  note?: string;
}

export type FileReportResult =
  | { ok: true }
  | { ok: false; code: 'invalid-reason' | 'already-reported' };

export interface ReportsStore {
  /** Insert a report; resolves { duplicate: true } on a unique-pair violation. */
  insert(row: { reporter_id: string; setup_id: string; reason: string; note: string | null; created_at: string }): Promise<{ duplicate: boolean }>;
}

/**
 * Files a report. Rejects an unknown reason and enforces the one-per-user-per-
 * setup rate limit (a duplicate is reported back, not thrown).
 */
export async function fileReport(
  input: FileReportInput,
  store: ReportsStore,
  now: string,
): Promise<FileReportResult> {
  if (!isValidReason(input.reason)) return { ok: false, code: 'invalid-reason' };
  const truncatedNote = input.note ? input.note.slice(0, REPORT_NOTE_MAX) : input.note;
  const { duplicate } = await store.insert({
    reporter_id: input.reporterId,
    setup_id: input.setupId,
    reason: input.reason,
    note: truncatedNote?.trim() ? truncatedNote.trim() : null,
    created_at: now,
  });
  if (duplicate) return { ok: false, code: 'already-reported' };
  return { ok: true };
}

// ─── Supabase-backed store ────────────────────────────────────────────────────

/** Postgres unique-violation SQLSTATE. */
const UNIQUE_VIOLATION = '23505';

export function createSupabaseReportsStore(client: SupabaseClient): ReportsStore {
  return {
    async insert(row) {
      const { error } = await client.from('reports').insert(row);
      if (error) {
        if ((error as { code?: string }).code === UNIQUE_VIOLATION) return { duplicate: true };
        throw new Error(`report insert failed: ${error.message}`);
      }
      return { duplicate: false };
    },
  };
}
