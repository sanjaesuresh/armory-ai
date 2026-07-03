/**
 * Pure popularity aggregation over export_events rows.
 *
 * Counts the number of 'done'-kind export events per setup slug within a
 * trailing 30-day window ending at an injected `now` (no clock reads inside
 * this module — callers provide the reference time, keeping the function
 * deterministic and easy to test).
 *
 * Phase 5 extensibility: upvotes join this aggregation by adding a second term
 * to the same per-slug bucket. Pass an `upvotesBySlug` map alongside events
 * when that data is available. The current implementation only handles events.
 *
 * No I/O — the script (scripts/refresh-popularity.ts) is responsible for
 * fetching rows from Supabase and writing results back. This function only
 * transforms data.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

/** Minimal event shape required by the popularity aggregation. */
export interface PopularityEventRow {
  /** Slug of the setup this event belongs to. */
  setup_slug: string;
  /** Event kind — only 'done' events contribute to popularity. */
  kind: string;
  /** ISO 8601 UTC timestamp, e.g. "2026-06-15T10:30:00.000Z". */
  created_at: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Width of the trailing window in milliseconds (30 days). */
const WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

// ─── Aggregation ──────────────────────────────────────────────────────────────

/**
 * Compute per-slug popularity counts from export_events rows.
 *
 * Only 'done'-kind events within the [now − 30 days, now] window are counted.
 * Events at exactly the cutoff boundary (created_at === now − 30 days) are
 * included (>= semantics).
 *
 * @param events   - Event rows to aggregate (any kind; non-done rows ignored).
 * @param now      - Reference time for the trailing window.
 * @param allSlugs - Optional: when provided, every slug in this list appears in
 *   the returned Map with at least 0, guaranteeing no slug is "missing" even
 *   if it has no qualifying events. Pass the full list of known setup slugs so
 *   callers can rely on Map.get(slug) returning a number (not undefined).
 *
 * @returns Map<slug, count> — count of done events in the window per slug.
 */
export function computePopularity(
  events: PopularityEventRow[],
  now: Date,
  allSlugs?: string[],
): Map<string, number> {
  const counts = new Map<string, number>();

  // Seed all known slugs with 0 so they are never absent from the result.
  if (allSlugs !== undefined) {
    for (const slug of allSlugs) {
      counts.set(slug, 0);
    }
  }

  const cutoffMs = now.getTime() - WINDOW_MS;

  for (const event of events) {
    if (event.kind !== 'done') continue;
    const eventMs = new Date(event.created_at).getTime();
    if (eventMs < cutoffMs) continue;
    counts.set(event.setup_slug, (counts.get(event.setup_slug) ?? 0) + 1);
  }

  return counts;
}
