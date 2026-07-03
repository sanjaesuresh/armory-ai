// SERVER ONLY — never import from a client component or any file that ships
// to the browser. The SUPABASE_SERVICE_ROLE_KEY bypasses Row Level Security;
// it must only be used in server-side code (API routes, server actions, scripts).

import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client authenticated as the service role.
 *
 * The service role bypasses RLS entirely, so callers have unrestricted access
 * to all tables. All test-drive tables (runtime_config, anon_tokens,
 * testdrive_usage, testdrive_cache, testdrive_meter_state) are service-role
 * only and must be accessed through this client.
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from the
 * environment. Throws at call time (not module load) if either is absent.
 */
export function createSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
