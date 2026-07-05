/**
 * Metering primitives for the AI-describe feature (Phase 8 Task 8).
 *
 * Checks run in this order (first failure wins):
 *   1. Per-user daily cap  (10 describes per calendar day)
 *   2. Global daily budget ($2 USD, computed from describe_usage rows)
 *
 * Usage is recorded only after a successful model call. The store interface
 * is injectable so unit tests use in-memory doubles with no DB.
 *
 * The describe_usage table is service-role only (no public RLS policies) —
 * all reads and writes use SUPABASE_SERVICE_ROLE_KEY via createSupabaseServiceClient().
 */

import { createSupabaseServiceClient } from '@/lib/supabase/serviceClient';

// ─── Spec constants ───────────────────────────────────────────────────────────

/** Per-user daily describe cap. Spec: 10. */
export const DESCRIBE_PER_USER_CAP = 10;

/** Global daily describe budget in USD. Spec: $2. */
export const DESCRIBE_GLOBAL_BUDGET_USD = 2.0;

// ─── Types ────────────────────────────────────────────────────────────────────

/** Decision shape (same structure as test-drive MeterDecision). */
export interface DescribeMeterDecision {
  allowed: boolean;
  /** Present only on denial. */
  reason?: 'per-user-cap' | 'global-budget';
}

/** One row written to describe_usage after a successful model call. */
export interface DescribeUsageRow {
  userId: string;
  spendUsd: number;
  /** ISO UTC string. */
  createdAt: string;
}

// ─── Store interface ──────────────────────────────────────────────────────────

/**
 * Data access interface for the describe meter.
 * Injectable: unit tests use in-memory doubles; the route uses the Supabase-backed factory.
 */
export interface DescribeMeterStore {
  /** Count describe calls for this user from dayStart (ISO UTC) until now. */
  countUserDescribesToday(userId: string, dayStart: string): Promise<number>;
  /** Sum spend_usd of all describe_usage rows from dayStart (ISO UTC) until now. */
  sumSpendToday(dayStart: string): Promise<number>;
  /** Append a completed describe-call usage row. */
  insert(row: DescribeUsageRow): Promise<void>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** UTC midnight (start of day) for a given ISO timestamp, returned as ISO string. */
function utcDayStart(isoNow: string): string {
  const d = new Date(isoNow);
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  ).toISOString();
}

// ─── Public functions ─────────────────────────────────────────────────────────

/**
 * Checks metering caps in order (per-user first, then global budget).
 * Returns { allowed: true } when both pass; { allowed: false, reason } on first failure.
 */
export async function checkDescribeMeter(
  userId: string,
  store: DescribeMeterStore,
  now: string,
): Promise<DescribeMeterDecision> {
  const dayStart = utcDayStart(now);

  // 1. Per-user daily cap.
  const userCount = await store.countUserDescribesToday(userId, dayStart);
  if (userCount >= DESCRIBE_PER_USER_CAP) {
    return { allowed: false, reason: 'per-user-cap' };
  }

  // 2. Global daily budget.
  const totalSpend = await store.sumSpendToday(dayStart);
  if (totalSpend >= DESCRIBE_GLOBAL_BUDGET_USD) {
    return { allowed: false, reason: 'global-budget' };
  }

  return { allowed: true };
}

/**
 * Appends a usage row after a successful describe call.
 * Called only when describeArtifact returns ok:true.
 */
export async function recordDescribeUsage(
  row: DescribeUsageRow,
  store: DescribeMeterStore,
): Promise<void> {
  await store.insert(row);
}

// ─── Supabase-backed store factory ────────────────────────────────────────────

/**
 * Creates a Supabase-backed DescribeMeterStore using the service-role client.
 * Service role bypasses RLS — the describe_usage table has no public policies.
 *
 * Lazy-initialises the client on first use so the factory is safe to call at
 * module load time without env vars present.
 */
export function createSupabaseDescribeStore(): DescribeMeterStore {
  let client: ReturnType<typeof createSupabaseServiceClient> | null = null;

  function getClient() {
    if (!client) client = createSupabaseServiceClient();
    return client;
  }

  return {
    async countUserDescribesToday(userId, dayStart) {
      const { count, error } = await getClient()
        .from('describe_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', dayStart);
      if (error) throw new Error(`Supabase countUserDescribesToday error: ${error.message}`);
      return count ?? 0;
    },

    async sumSpendToday(dayStart) {
      const { data, error } = await getClient()
        .from('describe_usage')
        .select('spend_usd')
        .gte('created_at', dayStart);
      if (error) throw new Error(`Supabase sumSpendToday error: ${error.message}`);
      return (data as { spend_usd: number }[]).reduce(
        (sum, row) => sum + Number(row.spend_usd),
        0,
      );
    },

    async insert(row) {
      const { error } = await getClient()
        .from('describe_usage')
        .insert({
          user_id: row.userId,
          spend_usd: row.spendUsd,
          created_at: row.createdAt,
        });
      if (error) throw new Error(`Supabase describe_usage insert error: ${error.message}`);
    },
  };
}
