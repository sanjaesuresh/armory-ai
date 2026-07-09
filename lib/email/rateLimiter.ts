/**
 * Rate limiting for POST /api/email/setup — mirrors lib/testdrive/meter.ts's
 * shape (injectable data source, Supabase-backed count queries bounded by a
 * rolling time window) rather than inventing a new pattern.
 *
 * Two independent caps, checked in order (first failure wins):
 *   1. per-email cap  — stops one address from being spammed with re-sends.
 *   2. per-IP cap     — stops one client from blasting many different
 *                        addresses (the open-relay abuse case).
 *
 * Both are rolling windows (now - WINDOW_HOURS), not calendar-day buckets —
 * simpler to reason about for a low-traffic endpoint and avoids a burst right
 * at UTC midnight.
 */

import { createSupabaseServiceClient } from '@/lib/supabase/serviceClient';

// ─── Caps (deliberately low — this is an unauthenticated, public endpoint) ────

/** Rolling window size for both caps. */
export const RATE_LIMIT_WINDOW_HOURS = 1;

/** Max sends to the same email address within the window. */
export const EMAIL_CAP_PER_WINDOW = 3;

/** Max sends triggered from the same IP within the window, regardless of destination address. */
export const IP_CAP_PER_WINDOW = 10;

// ─── Data source ───────────────────────────────────────────────────────────

export interface EmailRateLimitDataSource {
  /** Count rows for this email address created since windowStart (ISO UTC). */
  countEmailSendsSince(email: string, windowStart: string): Promise<number>;
  /** Count rows for this IP hash created since windowStart (ISO UTC). */
  countIpSendsSince(ipHash: string, windowStart: string): Promise<number>;
  /** Records a send attempt (called once the send has been accepted for delivery). */
  recordSend(row: { email: string; ipHash: string; createdAt: string }): Promise<void>;
}

export type RateLimitDecision =
  | { allowed: true }
  | { allowed: false; reason: 'email-cap' | 'ip-cap' };

export interface CheckRateLimitParams {
  email: string;
  ipHash: string;
  /** ISO UTC string for "now". */
  now: string;
  dataSource: EmailRateLimitDataSource;
}

function windowStart(isoNow: string): string {
  return new Date(new Date(isoNow).getTime() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
}

/**
 * Checks both caps. Email cap first — it's the more specific, lower-noise
 * signal (a stuck retry loop against one inbox) before falling back to the
 * broader per-IP guard against spraying many addresses.
 */
export async function checkEmailRateLimit(params: CheckRateLimitParams): Promise<RateLimitDecision> {
  const { email, ipHash, now, dataSource } = params;
  const start = windowStart(now);

  const emailCount = await dataSource.countEmailSendsSince(email, start);
  if (emailCount >= EMAIL_CAP_PER_WINDOW) {
    return { allowed: false, reason: 'email-cap' };
  }

  const ipCount = await dataSource.countIpSendsSince(ipHash, start);
  if (ipCount >= IP_CAP_PER_WINDOW) {
    return { allowed: false, reason: 'ip-cap' };
  }

  return { allowed: true };
}

// ─── Supabase-backed data source ──────────────────────────────────────────────

export function createSupabaseEmailRateLimitDataSource(): EmailRateLimitDataSource {
  let client: ReturnType<typeof createSupabaseServiceClient> | null = null;

  function getClient() {
    if (!client) client = createSupabaseServiceClient();
    return client;
  }

  return {
    async countEmailSendsSince(email, windowStartIso) {
      const { count, error } = await getClient()
        .from('email_sends')
        .select('*', { count: 'exact', head: true })
        .eq('email', email)
        .gte('created_at', windowStartIso);
      if (error) throw new Error(`Supabase countEmailSendsSince error: ${error.message}`);
      return count ?? 0;
    },

    async countIpSendsSince(ipHash, windowStartIso) {
      const { count, error } = await getClient()
        .from('email_sends')
        .select('*', { count: 'exact', head: true })
        .eq('ip_hash', ipHash)
        .gte('created_at', windowStartIso);
      if (error) throw new Error(`Supabase countIpSendsSince error: ${error.message}`);
      return count ?? 0;
    },

    async recordSend(row) {
      // Service role bypasses RLS — direct INSERT, no SECURITY DEFINER function needed.
      const { error } = await getClient()
        .from('email_sends')
        .insert({ email: row.email, ip_hash: row.ipHash, created_at: row.createdAt });
      if (error) throw new Error(`Supabase recordSend error: ${error.message}`);
    },
  };
}
