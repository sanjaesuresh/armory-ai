/**
 * Shared types for the test-drive metering primitives (Tasks 2–5).
 * No runtime dependencies — plain TypeScript interfaces and string-literal unions.
 */

// ─── MeterDecision ────────────────────────────────────────────────────────────

export type MeterDenialReason = 'flag-off' | 'session-cap' | 'ip-cap' | 'global-budget';

export interface MeterDecision {
  allowed: boolean;
  /** Present only on denial. */
  reason?: MeterDenialReason;
  /** ISO UTC string; present for daily-cap denials (session-cap, ip-cap). */
  retryAt?: string;
}

// ─── UsageSnapshot ────────────────────────────────────────────────────────────

/** Token and cost snapshot attached to a completed run or a cache entry. */
export interface UsageSnapshot {
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
}

// ─── UsageRow ─────────────────────────────────────────────────────────────────

/** One row written to the usage table after a completed (non-cached) run. */
export interface UsageRow extends UsageSnapshot {
  token: string;
  /** HMAC-SHA-256 hex digest of the raw IP with TESTDRIVE_IP_SALT. */
  ipHash: string;
  /** ISO UTC string. */
  createdAt: string;
}
