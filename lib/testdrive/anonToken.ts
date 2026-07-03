/**
 * Anonymous identity token for the test-drive feature (Task 3).
 *
 * Reads the armory_td cookie; if present and well-formed (32 lowercase hex
 * chars = 128 bits of randomness), returns it and touches last-seen. If
 * absent or malformed, generates a new CSPRNG token, persists it, and sets
 * the cookie. Malformed values never reach the data source.
 *
 * The token is the meter's per-session key — not auth identity. Clearing
 * cookies resets it; the per-IP cap and global budget are the backstops.
 */

import { randomBytes } from 'crypto';
import { createSupabaseServiceClient } from '@/lib/supabase/serviceClient';

// ─── Cookie helpers ───────────────────────────────────────────────────────────

export const COOKIE_NAME = 'armory_td';

/** 1 year in seconds. */
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  maxAge: number;
}

export type CookieReader = (name: string) => string | undefined;
export type CookieWriter = (name: string, value: string, options: CookieOptions) => void;

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: ONE_YEAR_SECONDS,
};

// ─── Token format ─────────────────────────────────────────────────────────────

/**
 * 128 bits = 16 bytes, encoded as 32 lowercase hex chars.
 * Opaque, URL-safe (hex uses only 0-9a-f).
 */
export const TOKEN_REGEX = /^[0-9a-f]{32}$/;

function isWellFormed(value: string): boolean {
  return TOKEN_REGEX.test(value);
}

function generateToken(): string {
  return randomBytes(16).toString('hex');
}

// ─── Data source interface ────────────────────────────────────────────────────

export interface AnonTokenDataSource {
  /** Returns true if a token row already exists. */
  tokenExists(token: string): Promise<boolean>;
  /** Persists a new token row. */
  createToken(token: string, now: string): Promise<void>;
  /** Updates last_seen_at for an existing token. */
  touchLastSeen(token: string, now: string): Promise<void>;
}

// ─── Public function ──────────────────────────────────────────────────────────

/**
 * Returns the current anon token for this browser session, issuing a new one
 * if the cookie is absent or malformed.
 *
 * @param cookieReader - reads a named cookie value (or undefined if absent).
 * @param cookieWriter - sets a named cookie with options.
 * @param dataSource   - injectable persistence layer.
 * @param now          - ISO UTC string for timestamp columns; defaults to new Date().toISOString().
 */
export async function getOrIssueAnonToken(
  cookieReader: CookieReader,
  cookieWriter: CookieWriter,
  dataSource: AnonTokenDataSource,
  now: string = new Date().toISOString(),
): Promise<string> {
  const raw = cookieReader(COOKIE_NAME);

  // Validate before touching the data source.
  if (raw !== undefined && isWellFormed(raw)) {
    // Touch last-seen; return unchanged, do not re-set the cookie.
    await dataSource.touchLastSeen(raw, now);
    return raw;
  }

  // Absent or malformed: generate fresh token (old value never reaches DS).
  const token = generateToken();
  await dataSource.createToken(token, now);
  cookieWriter(COOKIE_NAME, token, COOKIE_OPTIONS);
  return token;
}

// ─── Supabase-backed data source ──────────────────────────────────────────────

export function createSupabaseAnonTokenDataSource(): AnonTokenDataSource {
  let client: ReturnType<typeof createSupabaseServiceClient> | null = null;

  function getClient() {
    if (!client) client = createSupabaseServiceClient();
    return client;
  }

  return {
    async tokenExists(token: string): Promise<boolean> {
      const { data, error } = await getClient()
        .from('anon_tokens')
        .select('token_id')
        .eq('token_id', token)
        .maybeSingle();
      if (error) throw new Error(`Supabase tokenExists error: ${error.message}`);
      return data !== null;
    },

    async createToken(token: string, now: string): Promise<void> {
      const { error } = await getClient()
        .from('anon_tokens')
        .insert({ token_id: token, created_at: now, last_seen_at: now });
      if (error) throw new Error(`Supabase createToken error: ${error.message}`);
    },

    async touchLastSeen(token: string, now: string): Promise<void> {
      const { error } = await getClient()
        .from('anon_tokens')
        .update({ last_seen_at: now })
        .eq('token_id', token);
      if (error) throw new Error(`Supabase touchLastSeen error: ${error.message}`);
    },
  };
}
