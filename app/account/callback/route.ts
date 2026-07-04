// Magic-link / OTP callback: exchanges the auth code for a session cookie, then
// redirects to `next` (defaults to /account). Standard @supabase/ssr flow.
//
// On first successful sign-in this is also where the anonymous test-drive usage
// merges into the account: the browser's anon token's still-unowned rows adopt
// the new user id so quota carries over (Task 4). Best-effort — a merge failure
// never blocks sign-in.

import { type NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { COOKIE_NAME, TOKEN_REGEX } from '@/lib/testdrive/anonToken';
import { mergeAnonUsageToUser, createSupabaseMeterDataSource } from '@/lib/testdrive/meter';

async function mergeAnonUsage(request: NextRequest, userId: string): Promise<void> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token || !TOKEN_REGEX.test(token)) return;
  try {
    await mergeAnonUsageToUser(userId, token, createSupabaseMeterDataSource());
  } catch (err) {
    console.error('[account/callback] anon-usage merge failed:', err);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/account';

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const userId = data.user?.id;
      if (userId) await mergeAnonUsage(request, userId);
      // Only allow same-origin relative redirects.
      const dest = next.startsWith('/') ? next : '/account';
      return NextResponse.redirect(`${origin}${dest}`);
    }
  }

  // Failed / missing code — send to the account page with a recoverable error.
  return NextResponse.redirect(`${origin}/account?error=auth`);
}
