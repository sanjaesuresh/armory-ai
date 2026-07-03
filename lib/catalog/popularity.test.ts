/**
 * Tests for the pure popularity aggregation.
 *
 * No I/O — all data is injected. Time is also injected (now: Date) so the
 * function is deterministic in tests and in production.
 */

import { describe, it, expect } from 'vitest';
import { computePopularity, type PopularityEventRow } from './popularity';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Build a minimal event row with a timestamp relative to `now`.
 * daysAgo = 0 means at `now` exactly; positive values are in the past.
 */
function makeEvent(
  setup_slug: string,
  kind: 'copy' | 'done',
  daysAgo: number,
  now: Date,
): PopularityEventRow {
  const msAgo = daysAgo * 24 * 60 * 60 * 1000;
  const ts = new Date(now.getTime() - msAgo);
  return { setup_slug, kind, created_at: ts.toISOString() };
}

// Fixed reference time for all tests — no real clock reads.
const NOW = new Date('2026-07-03T12:00:00.000Z');

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('computePopularity', () => {
  it('counts only done events within the 30-day window, per slug', () => {
    const events: PopularityEventRow[] = [
      makeEvent('slug-a', 'done', 1, NOW),   // 1 day ago — inside
      makeEvent('slug-a', 'done', 15, NOW),  // 15 days ago — inside
      makeEvent('slug-b', 'done', 5, NOW),   // 5 days ago — inside
    ];
    const result = computePopularity(events, NOW);
    expect(result.get('slug-a')).toBe(2);
    expect(result.get('slug-b')).toBe(1);
  });

  it('does not count copy events', () => {
    const events: PopularityEventRow[] = [
      makeEvent('slug-a', 'copy', 1, NOW),   // copy — ignored
      makeEvent('slug-a', 'copy', 5, NOW),   // copy — ignored
      makeEvent('slug-a', 'done', 10, NOW),  // done — counted
    ];
    const result = computePopularity(events, NOW);
    expect(result.get('slug-a')).toBe(1);
  });

  it('excludes events strictly outside the 30-day window', () => {
    const events: PopularityEventRow[] = [
      makeEvent('slug-a', 'done', 29, NOW),  // inside
      makeEvent('slug-a', 'done', 31, NOW),  // outside (31 days ago)
    ];
    const result = computePopularity(events, NOW);
    expect(result.get('slug-a')).toBe(1);
  });

  it('includes events at exactly the 30-day boundary (>= cutoff)', () => {
    // Event created exactly 30 days before now equals the cutoff — included.
    const events: PopularityEventRow[] = [
      makeEvent('slug-a', 'done', 30, NOW),  // exactly at cutoff — inside
      makeEvent('slug-b', 'done', 31, NOW),  // 1 ms past cutoff — outside
    ];
    const result = computePopularity(events, NOW);
    expect(result.get('slug-a')).toBe(1);
    expect(result.get('slug-b')).toBeUndefined(); // slug-b has 0 events inside window
  });

  it('returns 0 for known slugs with no qualifying events (allSlugs param)', () => {
    const events: PopularityEventRow[] = [
      makeEvent('slug-a', 'done', 1, NOW),  // slug-a has 1 done inside window
    ];
    const result = computePopularity(events, NOW, ['slug-a', 'slug-b', 'slug-c']);
    expect(result.get('slug-a')).toBe(1);
    expect(result.get('slug-b')).toBe(0);  // no events — must be 0, not missing
    expect(result.get('slug-c')).toBe(0);  // no events — must be 0, not missing
  });

  it('slugs with no qualifying events because only copy events exist aggregate to 0', () => {
    const events: PopularityEventRow[] = [
      makeEvent('slug-a', 'copy', 1, NOW),  // copy only — no done events
      makeEvent('slug-a', 'copy', 2, NOW),
    ];
    const result = computePopularity(events, NOW, ['slug-a']);
    expect(result.get('slug-a')).toBe(0);
  });

  it('slugs with all events outside the window aggregate to 0 via allSlugs', () => {
    const events: PopularityEventRow[] = [
      makeEvent('slug-a', 'done', 45, NOW),  // outside 30-day window
      makeEvent('slug-a', 'done', 60, NOW),  // outside
    ];
    const result = computePopularity(events, NOW, ['slug-a']);
    expect(result.get('slug-a')).toBe(0);
  });

  it('handles an empty events array; all allSlugs get 0', () => {
    const result = computePopularity([], NOW, ['alpha', 'beta']);
    expect(result.get('alpha')).toBe(0);
    expect(result.get('beta')).toBe(0);
  });

  it('is deterministic — same inputs produce the same Map', () => {
    const events: PopularityEventRow[] = [
      makeEvent('slug-a', 'done', 3, NOW),
      makeEvent('slug-b', 'done', 7, NOW),
    ];
    const r1 = computePopularity(events, NOW);
    const r2 = computePopularity(events, NOW);
    expect(r1.get('slug-a')).toBe(r2.get('slug-a'));
    expect(r1.get('slug-b')).toBe(r2.get('slug-b'));
  });

  it('counts multiple done events for the same slug correctly', () => {
    const events: PopularityEventRow[] = Array.from({ length: 10 }, (_, i) =>
      makeEvent('heavy-hitter', 'done', i + 1, NOW),
    );
    const result = computePopularity(events, NOW);
    expect(result.get('heavy-hitter')).toBe(10);
  });
});
