/**
 * Tests for the email rate limiter (mirrors lib/testdrive/meter.test.ts's
 * shape). All tests run against in-memory stubs — no Supabase connection.
 */

import { describe, it, expect } from 'vitest';
import {
  checkEmailRateLimit,
  EMAIL_CAP_PER_WINDOW,
  IP_CAP_PER_WINDOW,
  RATE_LIMIT_WINDOW_HOURS,
  type EmailRateLimitDataSource,
} from './rateLimiter';

interface Row {
  email: string;
  ipHash: string;
  createdAt: string;
}

function makeDataSource() {
  const rows: Row[] = [];
  const ds: EmailRateLimitDataSource = {
    async countEmailSendsSince(email, windowStart) {
      return rows.filter((r) => r.email === email && r.createdAt >= windowStart).length;
    },
    async countIpSendsSince(ipHash, windowStart) {
      return rows.filter((r) => r.ipHash === ipHash && r.createdAt >= windowStart).length;
    },
    async recordSend(row) {
      rows.push(row);
    },
  };
  return { ds, rows };
}

const EMAIL = 'person@example.com';
const IP_HASH = 'ipHash1234567890';
const NOW = '2026-07-09T12:00:00.000Z';

describe('checkEmailRateLimit', () => {
  it('allows a send when both caps are under their limits', async () => {
    const { ds } = makeDataSource();
    const decision = await checkEmailRateLimit({ email: EMAIL, ipHash: IP_HASH, now: NOW, dataSource: ds });
    expect(decision.allowed).toBe(true);
  });

  it('email cap: trips at exactly EMAIL_CAP_PER_WINDOW and names email-cap', async () => {
    const { ds, rows } = makeDataSource();
    for (let i = 0; i < EMAIL_CAP_PER_WINDOW; i++) {
      rows.push({ email: EMAIL, ipHash: `other-ip-${i}`, createdAt: NOW });
    }
    const decision = await checkEmailRateLimit({ email: EMAIL, ipHash: IP_HASH, now: NOW, dataSource: ds });
    expect(decision.allowed).toBe(false);
    if (!decision.allowed) expect(decision.reason).toBe('email-cap');
  });

  it('email cap: under the cap (EMAIL_CAP_PER_WINDOW - 1) is still allowed', async () => {
    const { ds, rows } = makeDataSource();
    for (let i = 0; i < EMAIL_CAP_PER_WINDOW - 1; i++) {
      rows.push({ email: EMAIL, ipHash: `other-ip-${i}`, createdAt: NOW });
    }
    const decision = await checkEmailRateLimit({ email: EMAIL, ipHash: IP_HASH, now: NOW, dataSource: ds });
    expect(decision.allowed).toBe(true);
  });

  it('IP cap: trips at exactly IP_CAP_PER_WINDOW and names ip-cap (different email each time)', async () => {
    const { ds, rows } = makeDataSource();
    for (let i = 0; i < IP_CAP_PER_WINDOW; i++) {
      rows.push({ email: `person${i}@example.com`, ipHash: IP_HASH, createdAt: NOW });
    }
    const decision = await checkEmailRateLimit({ email: EMAIL, ipHash: IP_HASH, now: NOW, dataSource: ds });
    expect(decision.allowed).toBe(false);
    if (!decision.allowed) expect(decision.reason).toBe('ip-cap');
  });

  it('IP cap: under the cap is still allowed', async () => {
    const { ds, rows } = makeDataSource();
    for (let i = 0; i < IP_CAP_PER_WINDOW - 1; i++) {
      rows.push({ email: `person${i}@example.com`, ipHash: IP_HASH, createdAt: NOW });
    }
    const decision = await checkEmailRateLimit({ email: EMAIL, ipHash: IP_HASH, now: NOW, dataSource: ds });
    expect(decision.allowed).toBe(true);
  });

  it('email cap is checked before ip cap (order matters)', async () => {
    const { ds, rows } = makeDataSource();
    for (let i = 0; i < EMAIL_CAP_PER_WINDOW; i++) rows.push({ email: EMAIL, ipHash: IP_HASH, createdAt: NOW });
    for (let i = 0; i < IP_CAP_PER_WINDOW; i++) rows.push({ email: `p${i}@x.com`, ipHash: IP_HASH, createdAt: NOW });
    const decision = await checkEmailRateLimit({ email: EMAIL, ipHash: IP_HASH, now: NOW, dataSource: ds });
    expect(decision.allowed).toBe(false);
    if (!decision.allowed) expect(decision.reason).toBe('email-cap');
  });

  it('resets outside the rolling window (old rows do not count)', async () => {
    const { ds, rows } = makeDataSource();
    const outsideWindow = new Date(
      new Date(NOW).getTime() - (RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000 + 1000),
    ).toISOString();
    for (let i = 0; i < EMAIL_CAP_PER_WINDOW + 2; i++) {
      rows.push({ email: EMAIL, ipHash: `ip-${i}`, createdAt: outsideWindow });
    }
    const decision = await checkEmailRateLimit({ email: EMAIL, ipHash: IP_HASH, now: NOW, dataSource: ds });
    expect(decision.allowed).toBe(true);
  });

  it('recordSend appends a row the next check can see', async () => {
    const { ds } = makeDataSource();
    await ds.recordSend({ email: EMAIL, ipHash: IP_HASH, createdAt: NOW });
    const count = await ds.countEmailSendsSince(EMAIL, '2026-07-09T00:00:00.000Z');
    expect(count).toBe(1);
  });
});
