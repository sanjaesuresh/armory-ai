// SERVER ONLY — creates request-scoped Supabase clients that read/write the
// auth session cookies. Never import from a client component.
//
// Two clients:
//   createSupabaseServerClient() — anon-key client bound to the request cookies,
//     for server components / route handlers that act as the signed-in user
//     (RLS applies via the user's JWT). Use getUser() to authenticate.
//   The service-role client stays in lib/supabase/serviceClient.ts (privileged,
//     RLS-bypassing) for trusted server jobs only.

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

type CookieToSet = { name: string; value: string; options: CookieOptions };

function requireEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
  if (!anonKey) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
  return { url, anonKey };
}

/**
 * Request-scoped server client bound to the Next.js cookie store. Reads the
 * user's session from cookies and applies RLS as that user. In a pure Server
 * Component the cookie writes are no-ops (cookies are read-only there) — the
 * middleware refreshes the session, so that is safe.
 */
export async function createSupabaseServerClient() {
  const { url, anonKey } = requireEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component where cookies are read-only.
          // The middleware session refresh handles cookie updates.
        }
      },
    },
  });
}

/**
 * Returns the authenticated user for the current request, or null when signed
 * out. Uses getUser() (which validates the JWT with the auth server) — never
 * trust getSession() alone for authorization.
 *
 * Never throws: if Supabase env is absent, or the auth call fails, it returns
 * null. This keeps the account-free guarantee intact — a page that reads the
 * session for an optional affordance can never be broken by its absence.
 */
export async function getSessionUser() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user ?? null;
  } catch {
    return null;
  }
}
