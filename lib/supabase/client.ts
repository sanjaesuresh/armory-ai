import { createClient } from '@supabase/supabase-js';

/**
 * Creates a read-only Supabase client using the public anon key.
 * Reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from
 * the environment. Throws at call time (not module load) if either is absent,
 * so unit tests that never call this function are unaffected.
 */
export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
  if (!key) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');

  return createClient(url, key);
}
