/**
 * Metering primitives for the test-drive feature (Task 4).
 *
 * Checks run in this order (first failure wins):
 *   1. per-token daily cap  (5 runs)
 *   2. per-IP daily cap     (20 runs)
 *   3. global daily budget  ($10 USD)
 *
 * The flag-off check (reason: 'flag-off') is produced upstream by the runner
 * (Task 6). The reason union type includes it here for the shared MeterDecision.
 *
 * Raw IPs are never stored — only an HMAC-SHA-256 digest salted with
 * TESTDRIVE_IP_SALT (server env). The salt must be set; throws otherwise.
 *
 * All daily counts are bounded by UTC midnight (dayStart). The data source
 * interface is injectable so unit tests use in-memory doubles with no DB.
 */

import { createHmac } from 'crypto';
import { createSupabaseServiceClient } from '@/lib/supabase/serviceClient';
import type { MeterDecision, UsageRow } from './types';

// ─── Spec constants ───────────────────────────────────────────────────────────

/** Per-anon-token daily run cap. Spec: 5. */
const TOKEN_CAP = 5;

/** Per-IP daily run cap. Spec: 20. */
const IP_CAP = 20;

/** Global daily budget in USD. Spec: $10. */
const BUDGET_USD = 10;

/** Budget alert threshold fraction. Spec: 80%. */
const ALERT_THRESHOLD = 0.8;

// ─── Data source interface ────────────────────────────────────────────────────

export interface MeterDataSource {
  /** Count runs for this token from dayStart (ISO UTC) until now. */
  countTokenRunsToday(token: string, dayStart: string): Promise<number>;
  /**
   * Count runs from dayStart belonging to EITHER this user id OR this token —
   * the session cap for a signed-in user. Counts each row once (union), so
   * signing in never resets or doubles quota.
   */
  countUserOrTokenRunsToday(userId: string, token: string, dayStart: string): Promise<number>;
  /** Count runs for this IP hash from dayStart (ISO UTC) until now. */
  countIpRunsToday(ipHash: string, dayStart: string): Promise<number>;
  /** Sum estimatedCostUsd of all rows from dayStart (ISO UTC) until now. */
  sumCostToday(dayStart: string): Promise<number>;
  /** Append a completed-run usage row. */
  recordUsage(row: UsageRow): Promise<void>;
  /**
   * Assign this token's still-anonymous usage rows (user_id is null) to the
   * user. Returns the number of rows updated. Idempotent: re-running assigns
   * nothing because the rows already carry a user id.
   */
  assignTokenRunsToUser(userId: string, token: string): Promise<number>;
  /** Returns true if the budget alert has already fired for this dayKey. */
  hasAlertFiredToday(dayKey: string): Promise<boolean>;
  /** Marks the budget alert as fired for this dayKey. */
  markAlertFiredToday(dayKey: string): Promise<void>;
}

// ─── Public types ─────────────────────────────────────────────────────────────

export interface CheckMeterParams {
  token: string;
  ipHash: string;
  /** ISO UTC string for "now". */
  now: string;
  dataSource: MeterDataSource;
  /**
   * The signed-in user's id, when present. When set, the session cap counts the
   * union of the user's rows and this token's rows so signing in cannot mint a
   * fresh allowance.
   */
  userId?: string;
}

export interface BudgetStatus {
  spentUsd: number;
  fraction: number;
  nearLimit: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** UTC midnight (start of day) for a given ISO timestamp, returned as ISO string. */
function utcDayStart(isoNow: string): string {
  const d = new Date(isoNow);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toISOString();
}

/** Next UTC midnight after the given ISO timestamp, returned as ISO string. */
function nextUtcMidnight(isoNow: string): string {
  const d = new Date(isoNow);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1)).toISOString();
}

// ─── Public functions ─────────────────────────────────────────────────────────

/**
 * Returns an HMAC-SHA-256 hex digest of the raw IP, salted with
 * TESTDRIVE_IP_SALT. Throws if the env var is absent.
 */
export function saltIp(rawIp: string): string {
  const salt = process.env.TESTDRIVE_IP_SALT;
  if (!salt) throw new Error('TESTDRIVE_IP_SALT env var is not set');
  return createHmac('sha256', salt).update(rawIp).digest('hex');
}

/**
 * Checks all metering caps in order.
 * Returns { allowed: true } if all pass; { allowed: false, reason, retryAt? } on first failure.
 */
export async function checkMeter(params: CheckMeterParams): Promise<MeterDecision> {
  const { token, ipHash, now, dataSource, userId } = params;
  const dayStart = utcDayStart(now);

  // 1. Per-session daily cap. For a signed-in user the cap counts the union of
  //    their rows and this token's rows; anonymously it is the token alone.
  const tokenRuns = userId
    ? await dataSource.countUserOrTokenRunsToday(userId, token, dayStart)
    : await dataSource.countTokenRunsToday(token, dayStart);
  if (tokenRuns >= TOKEN_CAP) {
    return { allowed: false, reason: 'session-cap', retryAt: nextUtcMidnight(now) };
  }

  // 2. Per-IP daily cap.
  const ipRuns = await dataSource.countIpRunsToday(ipHash, dayStart);
  if (ipRuns >= IP_CAP) {
    return { allowed: false, reason: 'ip-cap', retryAt: nextUtcMidnight(now) };
  }

  // 3. Global daily budget.
  const costToday = await dataSource.sumCostToday(dayStart);
  if (costToday >= BUDGET_USD) {
    return { allowed: false, reason: 'global-budget' };
  }

  return { allowed: true };
}

/**
 * Appends a usage row after a completed (non-cached) run.
 * The ipHash stored here must already be salted — never pass the raw IP.
 */
export async function recordUsage(row: UsageRow, dataSource: MeterDataSource): Promise<void> {
  await dataSource.recordUsage(row);
}

/**
 * Merges a browser's anonymous test-drive usage into a freshly signed-in user:
 * the token's still-anonymous rows adopt the user id. Idempotent — a second
 * call finds no null-owner rows for the token and changes nothing. Returns the
 * number of rows assigned. Best-effort at the sign-in callback; never blocks
 * sign-in.
 */
export async function mergeAnonUsageToUser(
  userId: string,
  token: string,
  dataSource: MeterDataSource,
): Promise<number> {
  return dataSource.assignTokenRunsToUser(userId, token);
}

/**
 * Returns the current day's budget status and emits a once-per-day structured
 * alert log line when the fraction first crosses the alert threshold.
 */
export async function budgetStatus(
  dataSource: MeterDataSource,
  now: string,
): Promise<BudgetStatus> {
  const dayStart = utcDayStart(now);
  const spentUsd = await dataSource.sumCostToday(dayStart);
  const fraction = spentUsd / BUDGET_USD;
  const nearLimit = fraction >= ALERT_THRESHOLD;

  if (nearLimit) {
    const alreadyFired = await dataSource.hasAlertFiredToday(dayStart);
    if (!alreadyFired) {
      console.log(
        JSON.stringify({
          event: 'testdrive.budget.alert',
          spentUsd,
          fraction: Math.round(fraction * 1000) / 1000,
          budgetUsd: BUDGET_USD,
          threshold: ALERT_THRESHOLD,
          dayStart,
        }),
      );
      await dataSource.markAlertFiredToday(dayStart);
    }
  }

  return { spentUsd, fraction, nearLimit };
}

// ─── Supabase-backed data source ──────────────────────────────────────────────

export function createSupabaseMeterDataSource(): MeterDataSource {
  let client: ReturnType<typeof createSupabaseServiceClient> | null = null;

  function getClient() {
    if (!client) client = createSupabaseServiceClient();
    return client;
  }

  return {
    async countTokenRunsToday(token, dayStart) {
      const { count, error } = await getClient()
        .from('testdrive_usage')
        .select('*', { count: 'exact', head: true })
        .eq('token', token)
        .gte('created_at', dayStart);
      if (error) throw new Error(`Supabase countTokenRunsToday error: ${error.message}`);
      return count ?? 0;
    },

    async countUserOrTokenRunsToday(userId, token, dayStart) {
      const { count, error } = await getClient()
        .from('testdrive_usage')
        .select('*', { count: 'exact', head: true })
        .or(`user_id.eq.${userId},token.eq.${token}`)
        .gte('created_at', dayStart);
      if (error) throw new Error(`Supabase countUserOrTokenRunsToday error: ${error.message}`);
      return count ?? 0;
    },

    async countIpRunsToday(ipHash, dayStart) {
      const { count, error } = await getClient()
        .from('testdrive_usage')
        .select('*', { count: 'exact', head: true })
        .eq('ip_hash', ipHash)
        .gte('created_at', dayStart);
      if (error) throw new Error(`Supabase countIpRunsToday error: ${error.message}`);
      return count ?? 0;
    },

    async sumCostToday(dayStart) {
      const { data, error } = await getClient()
        .from('testdrive_usage')
        .select('estimated_cost_usd')
        .gte('created_at', dayStart);
      if (error) throw new Error(`Supabase sumCostToday error: ${error.message}`);
      return (data as { estimated_cost_usd: number }[]).reduce(
        (sum, row) => sum + row.estimated_cost_usd,
        0,
      );
    },

    async recordUsage(row) {
      // Service role bypasses RLS — direct INSERT, no SECURITY DEFINER function needed.
      const { error } = await getClient()
        .from('testdrive_usage')
        .insert({
          token: row.token,
          ip_hash: row.ipHash,
          input_tokens: row.inputTokens,
          output_tokens: row.outputTokens,
          estimated_cost_usd: row.estimatedCostUsd,
          created_at: row.createdAt,
          // Present only for signed-in runs; anonymous rows stay null until merge.
          ...(row.userId ? { user_id: row.userId } : {}),
        });
      if (error) throw new Error(`Supabase recordUsage error: ${error.message}`);
    },

    async assignTokenRunsToUser(userId, token) {
      // Only claim rows that are still anonymous — makes the merge idempotent and
      // prevents reassigning rows already owned by a prior user of this browser.
      const { data, error } = await getClient()
        .from('testdrive_usage')
        .update({ user_id: userId })
        .eq('token', token)
        .is('user_id', null)
        .select('id');
      if (error) throw new Error(`Supabase assignTokenRunsToUser error: ${error.message}`);
      return data?.length ?? 0;
    },

    async hasAlertFiredToday(dayKey) {
      // Reads from the dedicated meter-state table, not runtime_config.
      const { data, error } = await getClient()
        .from('testdrive_meter_state')
        .select('alert_fired')
        .eq('day_key', dayKey)
        .maybeSingle();
      if (error) throw new Error(`Supabase hasAlertFiredToday error: ${error.message}`);
      return data !== null && (data as { alert_fired: boolean }).alert_fired === true;
    },

    async markAlertFiredToday(dayKey) {
      // Service role — direct upsert into the meter-state table.
      const { error } = await getClient()
        .from('testdrive_meter_state')
        .upsert({ day_key: dayKey, alert_fired: true, updated_at: new Date().toISOString() });
      if (error) throw new Error(`Supabase markAlertFiredToday error: ${error.message}`);
    },
  };
}
