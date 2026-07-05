/**
 * Tests for the AI-describe meter (Phase 8 Task 8).
 *
 * All tests run against in-memory stubs — no network, no Supabase connection.
 * Covers per-user daily cap, global daily budget, and calendar-day scoping.
 */

import { describe, it, expect } from 'vitest';
import {
  checkDescribeMeter,
  recordDescribeUsage,
  DESCRIBE_PER_USER_CAP,
  DESCRIBE_GLOBAL_BUDGET_USD,
  type DescribeMeterStore,
  type DescribeUsageRow,
} from './describeMeter';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** UTC midnight for the given ISO timestamp. */
function utcDayStart(isoNow: string): string {
  const d = new Date(isoNow);
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  ).toISOString();
}

interface StoreState {
  rows: DescribeUsageRow[];
}

/**
 * Builds an in-memory DescribeMeterStore. Accepts optional fixed overrides so
 * tests can assert specific count/spend scenarios without constructing rows.
 */
function makeStore(opts: {
  fixedUserCount?: number;
  fixedGlobalSpend?: number;
} = {}): { store: DescribeMeterStore; state: StoreState } {
  const rows: DescribeUsageRow[] = [];
  const { fixedUserCount, fixedGlobalSpend } = opts;

  const store: DescribeMeterStore = {
    async countUserDescribesToday(userId, dayStart) {
      if (fixedUserCount !== undefined) return fixedUserCount;
      return rows.filter(
        (r) => r.userId === userId && r.createdAt >= dayStart,
      ).length;
    },
    async sumSpendToday(dayStart) {
      if (fixedGlobalSpend !== undefined) return fixedGlobalSpend;
      return rows
        .filter((r) => r.createdAt >= dayStart)
        .reduce((sum, r) => sum + r.spendUsd, 0);
    },
    async insert(row) {
      rows.push(row);
    },
  };

  return { store, state: { rows } };
}

// ─── Tests: checkDescribeMeter ────────────────────────────────────────────────

const TODAY = '2026-07-04T14:00:00Z';
const USER_ID = 'user-abc-123';

describe('checkDescribeMeter', () => {
  it(`allows when user has ${DESCRIBE_PER_USER_CAP - 1} describes today`, async () => {
    const { store } = makeStore({ fixedUserCount: DESCRIBE_PER_USER_CAP - 1, fixedGlobalSpend: 0 });
    const result = await checkDescribeMeter(USER_ID, store, TODAY);
    expect(result.allowed).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it(`denies with "per-user-cap" reason when user has ${DESCRIBE_PER_USER_CAP} describes today`, async () => {
    const { store } = makeStore({ fixedUserCount: DESCRIBE_PER_USER_CAP, fixedGlobalSpend: 0 });
    const result = await checkDescribeMeter(USER_ID, store, TODAY);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('per-user-cap');
  });

  it('denies with "global-budget" reason when global spend reaches the $2 budget', async () => {
    const { store } = makeStore({ fixedUserCount: 0, fixedGlobalSpend: DESCRIBE_GLOBAL_BUDGET_USD });
    const result = await checkDescribeMeter(USER_ID, store, TODAY);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('global-budget');
  });

  it('denies with "global-budget" when spend exceeds budget, regardless of user count', async () => {
    const { store } = makeStore({ fixedUserCount: 2, fixedGlobalSpend: DESCRIBE_GLOBAL_BUDGET_USD + 0.5 });
    const result = await checkDescribeMeter(USER_ID, store, TODAY);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('global-budget');
  });

  it('does not count usage rows from yesterday', async () => {
    const { store, state } = makeStore();
    const YESTERDAY = '2026-07-03T23:59:00Z';
    // Add 10 rows from yesterday — none should count today
    for (let i = 0; i < DESCRIBE_PER_USER_CAP; i++) {
      state.rows.push({ userId: USER_ID, spendUsd: 0.01, createdAt: YESTERDAY });
    }
    const result = await checkDescribeMeter(USER_ID, store, TODAY);
    expect(result.allowed).toBe(true);
  });

  it('per-user check runs first (user cap checked before global budget)', async () => {
    // Both conditions are true — user cap must fire first.
    const { store } = makeStore({
      fixedUserCount: DESCRIBE_PER_USER_CAP,
      fixedGlobalSpend: DESCRIBE_GLOBAL_BUDGET_USD,
    });
    const result = await checkDescribeMeter(USER_ID, store, TODAY);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('per-user-cap');
  });
});

// ─── Tests: recordDescribeUsage ───────────────────────────────────────────────

describe('recordDescribeUsage', () => {
  it('inserts the usage row into the store', async () => {
    const { store, state } = makeStore();
    const row: DescribeUsageRow = { userId: USER_ID, spendUsd: 0.005, createdAt: TODAY };
    await recordDescribeUsage(row, store);
    expect(state.rows).toHaveLength(1);
    expect(state.rows[0]).toEqual(row);
  });
});
