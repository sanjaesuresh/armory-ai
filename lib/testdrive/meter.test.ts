/**
 * Tests for the metering module (Task 4).
 *
 * All tests run against in-memory stubs and a stubbed clock — no network,
 * no Supabase connection, no real IP hashing env var required.
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import {
  checkMeter,
  recordUsage,
  budgetStatus,
  saltIp,
  mergeAnonUsageToUser,
  type MeterDataSource,
  type CheckMeterParams,
} from './meter';
import type { UsageRow } from './types';

// ─── Constants (mirror spec values; tests must not hard-code them) ────────────

const TOKEN_CAP = 5;
const IP_CAP = 20;
const BUDGET_USD = 10;
const ALERT_THRESHOLD = 0.8;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns an ISO UTC midnight string for the given Date. */
function utcMidnight(d: Date): string {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toISOString();
}

/** Returns the next UTC midnight ISO string after the given Date. */
function nextUtcMidnight(d: Date): string {
  const next = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1));
  return next.toISOString();
}

function makeDataSource(opts?: {
  tokenRuns?: number;
  ipRuns?: number;
  costToday?: number;
  alertFired?: boolean;
}) {
  const rows: UsageRow[] = [];
  let alertFired = opts?.alertFired ?? false;

  // Fixed overrides take precedence over computed counts.
  const fixedTokenRuns = opts?.tokenRuns;
  const fixedIpRuns = opts?.ipRuns;
  const fixedCost = opts?.costToday;

  const ds: MeterDataSource = {
    async countTokenRunsToday(token: string, dayStart: string) {
      if (fixedTokenRuns !== undefined) return fixedTokenRuns;
      return rows.filter((r) => r.token === token && r.createdAt >= dayStart).length;
    },
    async countUserOrTokenRunsToday(userId: string, token: string, dayStart: string) {
      if (fixedTokenRuns !== undefined) return fixedTokenRuns;
      return rows.filter(
        (r) => (r.userId === userId || r.token === token) && r.createdAt >= dayStart,
      ).length;
    },
    async countIpRunsToday(ipHash: string, dayStart: string) {
      if (fixedIpRuns !== undefined) return fixedIpRuns;
      return rows.filter((r) => r.ipHash === ipHash && r.createdAt >= dayStart).length;
    },
    async sumCostToday(dayStart: string) {
      if (fixedCost !== undefined) return fixedCost;
      return rows
        .filter((r) => r.createdAt >= dayStart)
        .reduce((sum, r) => sum + r.estimatedCostUsd, 0);
    },
    async recordUsage(row: UsageRow) {
      rows.push(row);
    },
    async assignTokenRunsToUser(userId: string, token: string) {
      let n = 0;
      for (const r of rows) {
        if (r.token === token && r.userId === undefined) {
          r.userId = userId;
          n += 1;
        }
      }
      return n;
    },
    async hasAlertFiredToday(_dayKey: string) {
      return alertFired;
    },
    async markAlertFiredToday(_dayKey: string) {
      alertFired = true;
    },
  };

  return { ds, rows, get alertFired() { return alertFired; } };
}

const TOKEN = 'aaaa' + 'bbbb' + 'cccc' + 'dddd' + 'eeee' + 'ffff' + 'gggg' + 'hhhh'; // 32-char fake token
const IP_HASH = 'ipHash1234567890';
const NOW_DATE = new Date('2026-07-02T12:00:00.000Z');
const NOW = NOW_DATE.toISOString();
const DAY_START = utcMidnight(NOW_DATE);

function baseParams(overrides?: Partial<CheckMeterParams>): CheckMeterParams {
  const { ds } = makeDataSource();
  return { token: TOKEN, ipHash: IP_HASH, now: NOW, dataSource: ds, ...overrides };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('checkMeter', () => {
  it('allows a run when all checks are under their caps', async () => {
    const { ds } = makeDataSource({ tokenRuns: 0, ipRuns: 0, costToday: 0 });
    const decision = await checkMeter({ token: TOKEN, ipHash: IP_HASH, now: NOW, dataSource: ds });
    expect(decision.allowed).toBe(true);
    expect(decision.reason).toBeUndefined();
  });

  it('per-token cap: trips at exactly TOKEN_CAP and names session-cap', async () => {
    const { ds } = makeDataSource({ tokenRuns: TOKEN_CAP, ipRuns: 0, costToday: 0 });
    const decision = await checkMeter({ token: TOKEN, ipHash: IP_HASH, now: NOW, dataSource: ds });
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe('session-cap');
    expect(decision.retryAt).toBe(nextUtcMidnight(NOW_DATE));
  });

  it('per-token cap: under the cap (TOKEN_CAP - 1) is still allowed', async () => {
    const { ds } = makeDataSource({ tokenRuns: TOKEN_CAP - 1, ipRuns: 0, costToday: 0 });
    const decision = await checkMeter({ token: TOKEN, ipHash: IP_HASH, now: NOW, dataSource: ds });
    expect(decision.allowed).toBe(true);
  });

  it('per-IP cap: trips independently at IP_CAP and names ip-cap', async () => {
    const { ds } = makeDataSource({ tokenRuns: 0, ipRuns: IP_CAP, costToday: 0 });
    const decision = await checkMeter({ token: TOKEN, ipHash: IP_HASH, now: NOW, dataSource: ds });
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe('ip-cap');
    expect(decision.retryAt).toBe(nextUtcMidnight(NOW_DATE));
  });

  it('per-IP cap: under the cap (IP_CAP - 1) is still allowed', async () => {
    const { ds } = makeDataSource({ tokenRuns: 0, ipRuns: IP_CAP - 1, costToday: 0 });
    const decision = await checkMeter({ token: TOKEN, ipHash: IP_HASH, now: NOW, dataSource: ds });
    expect(decision.allowed).toBe(true);
  });

  it('session-cap is checked before ip-cap (order matters)', async () => {
    // Both caps hit — should see session-cap, not ip-cap
    const { ds } = makeDataSource({ tokenRuns: TOKEN_CAP, ipRuns: IP_CAP, costToday: 0 });
    const decision = await checkMeter({ token: TOKEN, ipHash: IP_HASH, now: NOW, dataSource: ds });
    expect(decision.reason).toBe('session-cap');
  });

  it('global budget: blocks when today cost reaches BUDGET_USD and names global-budget', async () => {
    const { ds } = makeDataSource({ tokenRuns: 0, ipRuns: 0, costToday: BUDGET_USD });
    const decision = await checkMeter({ token: TOKEN, ipHash: IP_HASH, now: NOW, dataSource: ds });
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe('global-budget');
    expect(decision.retryAt).toBeUndefined();
  });

  it('global budget: just under budget is allowed', async () => {
    const { ds } = makeDataSource({ tokenRuns: 0, ipRuns: 0, costToday: BUDGET_USD - 0.001 });
    const decision = await checkMeter({ token: TOKEN, ipHash: IP_HASH, now: NOW, dataSource: ds });
    expect(decision.allowed).toBe(true);
  });

  it('caps reset across UTC midnight (new day starts fresh)', async () => {
    // Simulate: token has TOKEN_CAP runs yesterday, 0 today
    const rows: UsageRow[] = [];
    const yesterdayDate = new Date('2026-07-01T12:00:00.000Z');
    const yesterdayDayStart = utcMidnight(yesterdayDate);
    for (let i = 0; i < TOKEN_CAP; i++) {
      rows.push({
        token: TOKEN,
        ipHash: IP_HASH,
        inputTokens: 100,
        outputTokens: 50,
        estimatedCostUsd: 0.001,
        createdAt: `2026-07-01T1${i}:00:00.000Z`, // yesterday
      });
    }

    const todayDate = new Date('2026-07-02T08:00:00.000Z');
    const todayDayStart = utcMidnight(todayDate);

    const ds: MeterDataSource = {
      async countTokenRunsToday(token, dayStart) {
        return rows.filter((r) => r.token === token && r.createdAt >= dayStart).length;
      },
      async countUserOrTokenRunsToday(userId, token, dayStart) {
        return rows.filter(
          (r) => (r.userId === userId || r.token === token) && r.createdAt >= dayStart,
        ).length;
      },
      async countIpRunsToday(ipHash, dayStart) {
        return rows.filter((r) => r.ipHash === ipHash && r.createdAt >= dayStart).length;
      },
      async sumCostToday(dayStart) {
        return rows
          .filter((r) => r.createdAt >= dayStart)
          .reduce((sum, r) => sum + r.estimatedCostUsd, 0);
      },
      async recordUsage(row) { rows.push(row); },
      async assignTokenRunsToUser() { return 0; },
      async hasAlertFiredToday() { return false; },
      async markAlertFiredToday() { /* noop */ },
    };

    const decision = await checkMeter({
      token: TOKEN,
      ipHash: IP_HASH,
      now: todayDate.toISOString(),
      dataSource: ds,
    });

    expect(decision.allowed).toBe(true);
  });
});

const USER = '11111111-1111-1111-1111-111111111111';
const TOKEN_2 = '1111' + '2222' + '3333' + '4444' + '5555' + '6666' + '7777' + '8888';

function usageRow(overrides: Partial<UsageRow>): UsageRow {
  return {
    token: TOKEN,
    ipHash: IP_HASH,
    inputTokens: 100,
    outputTokens: 50,
    estimatedCostUsd: 0.001,
    createdAt: '2026-07-02T10:00:00.000Z',
    ...overrides,
  };
}

describe('checkMeter — signed-in union cap (Task 4)', () => {
  it('counts the union of the user rows and the current token rows', async () => {
    const { ds, rows } = makeDataSource();
    // 3 rows already owned by the user (from another browser) + 2 on this token.
    for (let i = 0; i < 3; i++) rows.push(usageRow({ userId: USER, token: TOKEN_2, createdAt: `2026-07-02T0${i}:00:00.000Z` }));
    for (let i = 0; i < 2; i++) rows.push(usageRow({ token: TOKEN, createdAt: `2026-07-02T1${i}:00:00.000Z` }));

    // Union = 3 + 2 = 5 = TOKEN_CAP → denied.
    const decision = await checkMeter({ token: TOKEN, ipHash: IP_HASH, now: NOW, dataSource: ds, userId: USER });
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe('session-cap');
  });

  it('signing in on a fresh browser does not mint a new allowance', async () => {
    const { ds, rows } = makeDataSource();
    // The user already used their full daily cap under a previous token.
    for (let i = 0; i < TOKEN_CAP; i++) rows.push(usageRow({ userId: USER, token: TOKEN_2, createdAt: `2026-07-02T0${i}:00:00.000Z` }));

    // New browser: brand-new token with zero rows, but signed in as the same user.
    const decision = await checkMeter({ token: TOKEN, ipHash: 'freship', now: NOW, dataSource: ds, userId: USER });
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe('session-cap');
  });

  it('anonymous cap is unchanged (token-only) when no userId is given', async () => {
    const { ds, rows } = makeDataSource();
    for (let i = 0; i < TOKEN_CAP - 1; i++) rows.push(usageRow({ token: TOKEN, createdAt: `2026-07-02T0${i}:00:00.000Z` }));
    const decision = await checkMeter({ token: TOKEN, ipHash: IP_HASH, now: NOW, dataSource: ds });
    expect(decision.allowed).toBe(true);
  });
});

describe('mergeAnonUsageToUser (Task 4)', () => {
  it('assigns the token\'s anonymous rows to the user and is idempotent', async () => {
    const { ds, rows } = makeDataSource();
    rows.push(usageRow({ token: TOKEN, createdAt: '2026-07-02T01:00:00.000Z' }));
    rows.push(usageRow({ token: TOKEN, createdAt: '2026-07-02T02:00:00.000Z' }));
    rows.push(usageRow({ token: TOKEN_2, createdAt: '2026-07-02T03:00:00.000Z' })); // other token, untouched

    const first = await mergeAnonUsageToUser(USER, TOKEN, ds);
    expect(first).toBe(2);
    expect(rows.filter((r) => r.userId === USER)).toHaveLength(2);
    expect(rows.find((r) => r.token === TOKEN_2)?.userId).toBeUndefined();

    // Re-running changes nothing (rows already owned).
    const second = await mergeAnonUsageToUser(USER, TOKEN, ds);
    expect(second).toBe(0);
    expect(rows.filter((r) => r.userId === USER)).toHaveLength(2);
  });

  it('after merge, the union cap counts the adopted rows exactly once', async () => {
    const { ds, rows } = makeDataSource();
    for (let i = 0; i < TOKEN_CAP; i++) rows.push(usageRow({ token: TOKEN, createdAt: `2026-07-02T0${i}:00:00.000Z` }));

    await mergeAnonUsageToUser(USER, TOKEN, ds);
    // Same user + same token → the rows match both predicates but count once.
    const decision = await checkMeter({ token: TOKEN, ipHash: IP_HASH, now: NOW, dataSource: ds, userId: USER });
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe('session-cap');
  });
});

describe('recordUsage', () => {
  it('appends a usage row via the data source', async () => {
    const { ds, rows } = makeDataSource();
    const row: UsageRow = {
      token: TOKEN,
      ipHash: IP_HASH,
      inputTokens: 1000,
      outputTokens: 200,
      estimatedCostUsd: 0.005,
      createdAt: NOW,
    };
    await recordUsage(row, ds);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual(row);
  });
});

describe('budgetStatus', () => {
  it('returns spentUsd, fraction, and nearLimit=false when under threshold', async () => {
    const { ds } = makeDataSource({ costToday: 5 }); // 50% of $10
    const status = await budgetStatus(ds, NOW);
    expect(status.spentUsd).toBeCloseTo(5);
    expect(status.fraction).toBeCloseTo(0.5);
    expect(status.nearLimit).toBe(false);
  });

  it('nearLimit=true when fraction crosses 80%', async () => {
    const { ds } = makeDataSource({ costToday: 8.5 }); // 85% of $10
    const status = await budgetStatus(ds, NOW);
    expect(status.nearLimit).toBe(true);
  });

  it('emits the alert log once when crossing 80% and not again the same day', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    // First call: alert not yet fired
    const { ds } = makeDataSource({ costToday: 8.5, alertFired: false });
    await budgetStatus(ds, NOW);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('testdrive.budget.alert'),
    );
    consoleSpy.mockClear();

    // Second call same day: alert already fired
    const { ds: ds2 } = makeDataSource({ costToday: 9, alertFired: true });
    await budgetStatus(ds2, NOW);
    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('alert does not fire when under threshold', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const { ds } = makeDataSource({ costToday: 7, alertFired: false }); // 70%
    await budgetStatus(ds, NOW);
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe('saltIp', () => {
  beforeEach(() => {
    process.env.TESTDRIVE_IP_SALT = 'test-salt-value';
  });
  afterEach(() => {
    delete process.env.TESTDRIVE_IP_SALT;
  });

  it('returns a hex string (never the raw IP)', () => {
    const raw = '192.168.1.1';
    const hash = saltIp(raw);
    expect(hash).not.toBe(raw);
    expect(/^[0-9a-f]{64}$/.test(hash)).toBe(true); // SHA-256 = 64 hex chars
  });

  it('returns the same hash for the same IP', () => {
    expect(saltIp('10.0.0.1')).toBe(saltIp('10.0.0.1'));
  });

  it('returns different hashes for different IPs', () => {
    expect(saltIp('10.0.0.1')).not.toBe(saltIp('10.0.0.2'));
  });

  it('throws when TESTDRIVE_IP_SALT is not set', () => {
    delete process.env.TESTDRIVE_IP_SALT;
    expect(() => saltIp('1.2.3.4')).toThrow();
  });
});
