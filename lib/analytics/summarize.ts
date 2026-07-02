/**
 * Pure aggregation over export_events rows.
 *
 * No I/O — the script (scripts/export-report.ts) is responsible for fetching
 * rows from Supabase and passing them in. This function only transforms data.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

/** Matches the export_events table columns exactly. */
export interface ExportEventRow {
  id: number;
  setup_slug: string;
  target: string;
  branch: 'pro' | 'free' | null;
  kind: 'copy' | 'done';
  created_at: string; // ISO 8601 UTC timestamp
}

export interface SlugSummary {
  slug: string;
  /** Number of 'copy' events (user copied the config). */
  copies: number;
  /** Number of 'done' events (user finished the walkthrough). */
  dones: number;
  /** Done events broken out by branch. Unknown = null branch. */
  doneByBranch: { pro: number; free: number; unknown: number };
  /** All events (copy + done) bucketed by UTC date, key = 'YYYY-MM-DD'. */
  daysSeries: Record<string, number>;
}

// ─── UTC date bucketing ───────────────────────────────────────────────────────

/**
 * Extract the UTC date portion from an ISO 8601 timestamp.
 * Slicing the string is correct and timezone-safe: Supabase timestamps are
 * stored and returned in UTC, so the first 10 chars are always YYYY-MM-DD UTC.
 */
function utcDateKey(isoTimestamp: string): string {
  return isoTimestamp.slice(0, 10);
}

// ─── Aggregation ──────────────────────────────────────────────────────────────

export function summarizeExportEvents(rows: ExportEventRow[]): SlugSummary[] {
  const slugMap = new Map<string, SlugSummary>();

  for (const r of rows) {
    if (!slugMap.has(r.setup_slug)) {
      slugMap.set(r.setup_slug, {
        slug: r.setup_slug,
        copies: 0,
        dones: 0,
        doneByBranch: { pro: 0, free: 0, unknown: 0 },
        daysSeries: {},
      });
    }

    const s = slugMap.get(r.setup_slug)!;

    if (r.kind === 'copy') {
      s.copies += 1;
    } else if (r.kind === 'done') {
      s.dones += 1;
      if (r.branch === 'pro') {
        s.doneByBranch.pro += 1;
      } else if (r.branch === 'free') {
        s.doneByBranch.free += 1;
      } else {
        s.doneByBranch.unknown += 1;
      }
    }
    // Rows with an unexpected kind are silently ignored.

    const day = utcDateKey(r.created_at);
    s.daysSeries[day] = (s.daysSeries[day] ?? 0) + 1;
  }

  return Array.from(slugMap.values());
}
