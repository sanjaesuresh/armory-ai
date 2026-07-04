import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a read-only Supabase client using the public anon key.
 * Reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from
 * the environment. Throws at call time (not module load) if either is absent,
 * so unit tests that never call this function are unaffected.
 *
 * This is the plain, session-less reader used for public data (approved
 * setups). For auth-aware access in client components, use
 * createSupabaseBrowserClient below.
 */
export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
  if (!key) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');

  return createClient(url, key);
}

/**
 * Browser client bound to the auth cookies (via @supabase/ssr). Use in client
 * components for signed-in actions (sign-in, sign-out, owner-scoped reads). The
 * session is kept in cookies and refreshed by the middleware.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
  if (!key) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');

  return createBrowserClient(url, key);
}
