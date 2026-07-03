/**
 * Tests for the anonymous identity token module (Task 3).
 *
 * All tests use in-memory stubs for cookie access and the data source.
 * No network, no Supabase connection required.
 */

import { describe, it, expect } from 'vitest';
import {
  getOrIssueAnonToken,
  COOKIE_NAME,
  TOKEN_REGEX,
  type AnonTokenDataSource,
  type CookieReader,
  type CookieWriter,
  type CookieOptions,
} from './anonToken';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeDataSource() {
  const stored = new Map<string, { createdAt: string; lastSeenAt: string }>();
  let touchedToken: string | null = null;
  let createdToken: string | null = null;

  const ds: AnonTokenDataSource = {
    async tokenExists(token: string) {
      return stored.has(token);
    },
    async createToken(token: string, now: string) {
      createdToken = token;
      stored.set(token, { createdAt: now, lastSeenAt: now });
    },
    async touchLastSeen(token: string, now: string) {
      touchedToken = token;
      const entry = stored.get(token);
      if (entry) stored.set(token, { ...entry, lastSeenAt: now });
    },
  };

  return { ds, stored, get touchedToken() { return touchedToken; }, get createdToken() { return createdToken; } };
}

function makeCookies(initial?: string) {
  let stored: string | undefined = initial;
  let writtenValue: string | undefined;
  let writtenOptions: CookieOptions | undefined;

  const reader: CookieReader = (_name: string) => stored;
  const writer: CookieWriter = (_name: string, value: string, options: CookieOptions) => {
    stored = value;
    writtenValue = value;
    writtenOptions = options;
  };

  return {
    reader,
    writer,
    get writtenValue() { return writtenValue; },
    get writtenOptions() { return writtenOptions; },
  };
}

const NOW = '2026-07-02T00:00:00.000Z';

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('getOrIssueAnonToken', () => {
  it('absent cookie: issues a new token, persists it, and sets the cookie', async () => {
    const { ds, stored, createdToken } = makeDataSource();
    const cookies = makeCookies(undefined); // no cookie

    const token = await getOrIssueAnonToken(cookies.reader, cookies.writer, ds, NOW);

    // Token matches format
    expect(TOKEN_REGEX.test(token)).toBe(true);
    // Cookie was written
    expect(cookies.writtenValue).toBe(token);
    // Cookie options: httpOnly, secure, sameSite=lax, 1-year
    expect(cookies.writtenOptions?.httpOnly).toBe(true);
    expect(cookies.writtenOptions?.secure).toBe(true);
    expect(cookies.writtenOptions?.sameSite).toBe('lax');
    expect(cookies.writtenOptions?.maxAge).toBe(60 * 60 * 24 * 365);
    // Stored in data source
    expect(stored.has(token)).toBe(true);
  });

  it('present valid token: returned unchanged, last-seen touched, not re-issued', async () => {
    const state = makeDataSource();

    // Pre-create a valid token in the data source
    const existingToken = 'a'.repeat(32); // 32 hex chars = valid format
    await state.ds.createToken(existingToken, NOW);

    const cookies = makeCookies(existingToken);
    const returned = await getOrIssueAnonToken(cookies.reader, cookies.writer, state.ds, NOW);

    expect(returned).toBe(existingToken);
    // No new entry created (same entry exists)
    expect(state.stored.size).toBe(1);
    // last-seen was touched
    expect(state.touchedToken).toBe(existingToken);
    // Cookie was NOT re-written (writtenValue is undefined because the writer was never called)
    expect(cookies.writtenValue).toBeUndefined();
  });

  it('malformed cookie: replaced with new token, old value never reaches data source', async () => {
    const { ds, stored } = makeDataSource();
    const badValue = 'not-a-valid-token!!!';
    const cookies = makeCookies(badValue);

    const token = await getOrIssueAnonToken(cookies.reader, cookies.writer, ds, NOW);

    // New valid token issued
    expect(TOKEN_REGEX.test(token)).toBe(true);
    expect(token).not.toBe(badValue);
    // Bad value never reached data source
    expect(stored.has(badValue)).toBe(false);
    // New token persisted
    expect(stored.has(token)).toBe(true);
  });

  it('malformed cookie of wrong length: replaced', async () => {
    const { ds } = makeDataSource();
    // 31 hex chars — one short
    const cookies = makeCookies('a'.repeat(31));

    const token = await getOrIssueAnonToken(cookies.reader, cookies.writer, ds, NOW);

    expect(TOKEN_REGEX.test(token)).toBe(true);
    expect(token).not.toBe('a'.repeat(31));
  });

  it('issued tokens are unique across calls', async () => {
    const ds1 = makeDataSource().ds;
    const ds2 = makeDataSource().ds;

    const t1 = await getOrIssueAnonToken(makeCookies().reader, makeCookies().writer, ds1, NOW);
    const t2 = await getOrIssueAnonToken(makeCookies().reader, makeCookies().writer, ds2, NOW);

    expect(t1).not.toBe(t2);
  });

  it('cookie name is armory_td', () => {
    expect(COOKIE_NAME).toBe('armory_td');
  });
});
