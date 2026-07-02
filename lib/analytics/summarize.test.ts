/**
 * Unit tests for lib/analytics/summarize.ts
 * Pure function — no mocks, no network.
 */

import { describe, it, expect } from 'vitest';
import { summarizeExportEvents } from './summarize';
import type { ExportEventRow } from './summarize';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function row(overrides: Partial<ExportEventRow>): ExportEventRow {
  return {
    id: 1,
    setup_slug: 'marketing-manager',
    target: 'claude-app',
    branch: null,
    kind: 'copy',
    created_at: '2024-06-01T12:00:00Z',
    ...overrides,
  };
}

// ─── summarizeExportEvents ───────────────────────────────────────────────────

describe('summarizeExportEvents', () => {
  it('empty input produces an empty summary, not an error', () => {
    expect(summarizeExportEvents([])).toEqual([]);
  });

  it('counts group by slug and kind', () => {
    const rows: ExportEventRow[] = [
      row({ setup_slug: 'slug-a', kind: 'copy' }),
      row({ setup_slug: 'slug-a', kind: 'copy' }),
      row({ setup_slug: 'slug-a', kind: 'done' }),
      row({ setup_slug: 'slug-b', kind: 'done' }),
    ];
    const result = summarizeExportEvents(rows);

    const a = result.find((s) => s.slug === 'slug-a');
    const b = result.find((s) => s.slug === 'slug-b');

    expect(a).toBeDefined();
    expect(a!.copies).toBe(2);
    expect(a!.dones).toBe(1);

    expect(b).toBeDefined();
    expect(b!.copies).toBe(0);
    expect(b!.dones).toBe(1);
  });

  it('branch split sums to the done total', () => {
    const rows: ExportEventRow[] = [
      row({ kind: 'done', branch: 'pro' }),
      row({ kind: 'done', branch: 'pro' }),
      row({ kind: 'done', branch: 'free' }),
      row({ kind: 'done', branch: null }),
    ];
    const result = summarizeExportEvents(rows);

    expect(result).toHaveLength(1);
    const s = result[0];
    expect(s.dones).toBe(4);
    expect(s.doneByBranch.pro).toBe(2);
    expect(s.doneByBranch.free).toBe(1);
    expect(s.doneByBranch.unknown).toBe(1);
    expect(s.doneByBranch.pro + s.doneByBranch.free + s.doneByBranch.unknown).toBe(s.dones);
  });

  it('a row with an unexpected kind is counted as neither copy nor done', () => {
    const rows: ExportEventRow[] = [
      row({ kind: 'copy' }),
      // Cast to bypass TS — simulates a future kind value or bad DB row.
      row({ kind: 'view' as ExportEventRow['kind'] }),
    ];
    const result = summarizeExportEvents(rows);

    expect(result).toHaveLength(1);
    const s = result[0];
    expect(s.copies).toBe(1);
    expect(s.dones).toBe(0);
    // The unexpected row still contributes to the day series (all events are bucketed).
    expect(Object.values(s.daysSeries).reduce((a, b) => a + b, 0)).toBe(2);
  });

  it('days bucket by UTC date regardless of local timezone', () => {
    const rows: ExportEventRow[] = [
      row({ kind: 'copy', created_at: '2024-06-01T01:00:00Z' }),
      row({ kind: 'done', created_at: '2024-06-01T23:59:59Z' }),
      row({ kind: 'copy', created_at: '2024-06-02T00:00:00Z' }),
    ];
    const result = summarizeExportEvents(rows);

    expect(result).toHaveLength(1);
    const s = result[0];
    expect(s.daysSeries['2024-06-01']).toBe(2);
    expect(s.daysSeries['2024-06-02']).toBe(1);
    // No other day keys
    expect(Object.keys(s.daysSeries)).toHaveLength(2);
  });
});
