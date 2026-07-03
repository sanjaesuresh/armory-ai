/**
 * Tests for the feature-flag / kill-switch module (Task 2).
 *
 * All tests run against in-memory stubs — no network, no Supabase connection.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { createFlagChecker, type FlagsDataSource } from './flags';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeDataSource(configValue: string | null): FlagsDataSource {
  return {
    async getConfigValue(_key: string) {
      return configValue;
    },
  };
}

function makeTracked(configValue: string | null) {
  let fetchCount = 0;
  const ds: FlagsDataSource = {
    async getConfigValue(_key: string) {
      fetchCount++;
      return configValue;
    },
  };
  return { ds, get calls() { return fetchCount; } };
}

function makeStubClock(startMs = 1_000_000) {
  let ms = startMs;
  return {
    now: () => ms,
    advance: (delta: number) => { ms += delta; },
  };
}

afterEach(() => {
  delete process.env.TESTDRIVE_ENABLED;
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('isTestDriveEnabled', () => {
  it('is disabled when TESTDRIVE_ENABLED is absent (default off)', async () => {
    delete process.env.TESTDRIVE_ENABLED;
    const { isTestDriveEnabled } = createFlagChecker(makeDataSource(null), makeStubClock().now);
    expect(await isTestDriveEnabled()).toBe(false);
  });

  it('is disabled when TESTDRIVE_ENABLED is not exactly "true"', async () => {
    process.env.TESTDRIVE_ENABLED = '1';
    const { isTestDriveEnabled } = createFlagChecker(makeDataSource(null), makeStubClock().now);
    expect(await isTestDriveEnabled()).toBe(false);
  });

  it('is enabled when TESTDRIVE_ENABLED is "true" and no config row exists', async () => {
    process.env.TESTDRIVE_ENABLED = 'true';
    const { isTestDriveEnabled } = createFlagChecker(makeDataSource(null), makeStubClock().now);
    expect(await isTestDriveEnabled()).toBe(true);
  });

  it('kill switch: config row "false" overrides env-on to disabled', async () => {
    process.env.TESTDRIVE_ENABLED = 'true';
    const { isTestDriveEnabled } = createFlagChecker(makeDataSource('false'), makeStubClock().now);
    expect(await isTestDriveEnabled()).toBe(false);
  });

  it('config row cannot force-on when env is off', async () => {
    delete process.env.TESTDRIVE_ENABLED;
    const { isTestDriveEnabled } = createFlagChecker(makeDataSource('true'), makeStubClock().now);
    expect(await isTestDriveEnabled()).toBe(false);
  });

  it('data source is not called when env is off', async () => {
    delete process.env.TESTDRIVE_ENABLED;
    const tracked = makeTracked('true');
    const { isTestDriveEnabled } = createFlagChecker(tracked.ds, makeStubClock().now);
    await isTestDriveEnabled();
    expect(tracked.calls).toBe(0);
  });

  it('cached value is returned within the 60s window (data source called only once)', async () => {
    process.env.TESTDRIVE_ENABLED = 'true';
    const clock = makeStubClock();
    const tracked = makeTracked(null);
    const { isTestDriveEnabled } = createFlagChecker(tracked.ds, clock.now);
    await isTestDriveEnabled();
    clock.advance(30_000); // 30s — within window
    await isTestDriveEnabled();
    expect(tracked.calls).toBe(1);
  });

  it('cached value refreshes after the 60s cache window', async () => {
    process.env.TESTDRIVE_ENABLED = 'true';
    const clock = makeStubClock();
    const tracked = makeTracked(null);
    const { isTestDriveEnabled } = createFlagChecker(tracked.ds, clock.now);
    await isTestDriveEnabled();
    clock.advance(61_000); // 61s — past window
    await isTestDriveEnabled();
    expect(tracked.calls).toBe(2);
  });
});
