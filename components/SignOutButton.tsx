'use client';

/**
 * SignOutButton — a client-side button that calls supabase.auth.signOut()
 * and refreshes the router so server components re-read the session.
 *
 * Rendered inside server-component pages (e.g. app/account/page.tsx) as a
 * leaf client island. Keep this component minimal — all auth logic stays in
 * createSupabaseBrowserClient + supabase.auth.onAuthStateChange in Nav.
 */

import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

interface Props {
  className?: string;
}

export default function SignOutButton({ className }: Props) {
  const router = useRouter();

  async function handleSignOut() {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      // Best-effort: the session will expire naturally.
    }
    // Refresh so server components (account page) re-read getSessionUser().
    router.refresh();
  }

  return (
    <button
      type="button"
      className={className ?? 'btn btn-outline btn-sm'}
      onClick={handleSignOut}
      data-testid="sign-out-btn"
    >
      Sign out
    </button>
  );
}
