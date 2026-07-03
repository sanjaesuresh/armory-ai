/**
 * Feature flag and kill-switch for the test-drive feature (Task 2).
 *
 * Reads TESTDRIVE_ENABLED as the env default (off unless exactly "true").
 * A runtime-config row can force the feature off without a redeploy (the kill
 * switch). The result is cached in-process for at most 60 seconds.
 *
 * Precedence:
 *   1. env off  → disabled immediately; data source is never called.
 *   2. env on + config row "false" → disabled (kill switch fires).
 *   3. env on + no row (or row is anything other than "false") → enabled.
 *
 * Config cannot force-on when env is off — off is always reachable.
 */

import { createSupabaseServiceClient } from '@/lib/supabase/serviceClient';

// ─── Data source interface ────────────────────────────────────────────────────

export interface FlagsDataSource {
  /** Returns the value for the given config key, or null if no row exists. */
  getConfigValue(key: string): Promise<string | null>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CACHE_TTL_MS = 60_000; // 60 seconds
const CONFIG_KEY = 'testdrive.enabled';

// ─── Public interface ─────────────────────────────────────────────────────────

/**
 * Pure, synchronous render-gate: is the test-drive feature launched at all?
 *
 * Reads ONLY the env var — no I/O, no data source, no failure surface. Use this
 * to decide whether test-drive UI entry points render. It does NOT consult the
 * runtime-config kill switch; that is enforced server-side by the runner (via
 * `createFlagChecker(...).isTestDriveEnabled()`) before any model spend, so a
 * kill flips runs to the feature-off state within the 60s cache window without
 * requiring a Supabase round-trip on every page render.
 */
export function isTestDriveLaunched(): boolean {
  return process.env.TESTDRIVE_ENABLED === 'true';
}

export interface FlagChecker {
  isTestDriveEnabled(): Promise<boolean>;
}

/**
 * Creates a flag checker with its own in-process cache.
 *
 * @param dataSource - injectable data source for the runtime-config table.
 * @param clock      - injectable clock returning epoch ms; defaults to Date.now.
 */
export function createFlagChecker(
  dataSource: FlagsDataSource,
  clock: () => number = Date.now,
): FlagChecker {
  let cached: { value: boolean; at: number } | null = null;

  return {
    async isTestDriveEnabled(): Promise<boolean> {
      // Env-off is absolute — skip the config fetch entirely.
      const envEnabled = process.env.TESTDRIVE_ENABLED === 'true';
      if (!envEnabled) return false;

      // Serve from cache if still fresh.
      const now = clock();
      if (cached !== null && now - cached.at < CACHE_TTL_MS) {
        return cached.value;
      }

      // Fetch config row.
      const configValue = await dataSource.getConfigValue(CONFIG_KEY);

      // Kill switch: config row value "false" disables, anything else (or absent) keeps on.
      const value = configValue !== 'false';
      cached = { value, at: now };
      return value;
    },
  };
}

// ─── Supabase-backed data source ──────────────────────────────────────────────

export function createSupabaseFlagsDataSource(): FlagsDataSource {
  let client: ReturnType<typeof createSupabaseServiceClient> | null = null;

  function getClient() {
    if (!client) client = createSupabaseServiceClient();
    return client;
  }

  return {
    async getConfigValue(key: string): Promise<string | null> {
      const { data, error } = await getClient()
        .from('runtime_config')
        .select('value')
        .eq('key', key)
        .maybeSingle();

      if (error) throw new Error(`Supabase getConfigValue error: ${error.message}`);
      return data ? (data as { value: string }).value : null;
    },
  };
}
