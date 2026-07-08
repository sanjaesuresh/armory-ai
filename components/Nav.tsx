'use client';

/**
 * Nav — the sticky top navigation bar.
 *
 * Auth state: this component subscribes to onAuthStateChange via the browser
 * Supabase client. No server reads are needed — the middleware keeps the
 * session cookie fresh, and onAuthStateChange fires an INITIAL_SESSION event
 * immediately on mount from the stored cookie.
 *
 * Why client-side auth here: Nav is already a client component (burger
 * toggle, keyboard handling). Subscribing to onAuthStateChange is the correct
 * pattern for a 'use client' component — it avoids prop-drilling from the
 * server layout and reacts to mid-session sign-in/sign-out events.
 *
 * Account-free guarantee: browse, customize, export, and test-drive links
 * are always visible and never gated by auth state.
 */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import LogoMark from '@/components/icons/LogoMark';

interface AuthUser {
  email: string;
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  /**
   * undefined = still resolving the session (brief, imperceptible)
   * null      = signed out
   * {email}   = signed in
   */
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  const pathname = usePathname();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Subscribe to auth state changes. onAuthStateChange fires an INITIAL_SESSION
  // event synchronously-ish on mount, so there is no persistent loading state.
  useEffect(() => {
    let supabase: ReturnType<typeof createSupabaseBrowserClient> | null = null;
    try {
      supabase = createSupabaseBrowserClient();
    } catch {
      // Supabase env vars not configured (e.g. in tests or build preview).
      // Treat as signed out so sign-in link is visible.
      setUser(null);
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user?.email;
      setUser(email ? { email } : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close on Escape — handles both the burger menu and the account dropdown.
  useEffect(() => {
    if (!open && !accountOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (accountOpen) {
          setAccountOpen(false);
        } else {
          setOpen(false);
          burgerRef.current?.focus();
        }
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, accountOpen]);

  // Close on outside click — handles both menus.
  useEffect(() => {
    if (!open && !accountOpen) return;
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        open &&
        burgerRef.current &&
        !burgerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
      if (
        accountOpen &&
        accountRef.current &&
        !accountRef.current.contains(target)
      ) {
        setAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open, accountOpen]);

  function closeMenu() {
    setOpen(false);
  }

  async function handleSignOut() {
    setAccountOpen(false);
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      // onAuthStateChange fires SIGNED_OUT → setUser(null)
    } catch {
      // Best-effort; session expires naturally.
      setUser(null);
    }
  }

  const isSignedIn = user !== null && user !== undefined;
  const initialLetter = user?.email?.[0]?.toUpperCase() ?? '';

  return (
    <header className={`nav${open ? ' open' : ''}`}>
      <div className="wrap nav-inner">
        <Link className="brand" href="/">
          <LogoMark size={22} />
          Armory
        </Link>

        <nav
          className="nav-links"
          id="navLinks"
          aria-label="Main"
          ref={menuRef}
        >
          <Link
            href="/professionals"
            onClick={closeMenu}
            aria-current={pathname === '/professionals' ? 'page' : undefined}
          >
            Professionals
          </Link>
          <Link
            href="/developers"
            onClick={closeMenu}
            aria-current={pathname === '/developers' ? 'page' : undefined}
          >
            Developers
          </Link>
          <Link
            href="/learn"
            onClick={closeMenu}
            aria-current={pathname?.startsWith('/learn') ? 'page' : undefined}
          >
            Learn AI
          </Link>

          {/* Mobile-only items — hidden on desktop, shown in the burger dropdown */}
          {isSignedIn ? (
            <>
              <Link
                href="/my/setups"
                className="nav-mobile-cta"
                onClick={closeMenu}
                data-testid="mobile-my-setups"
              >
                My setups
              </Link>
              <Link
                href="/my/test-drives"
                className="nav-mobile-cta"
                onClick={closeMenu}
                data-testid="mobile-test-drives"
              >
                Test-drive history
              </Link>
              <button
                type="button"
                className="nav-mobile-btn"
                onClick={() => {
                  handleSignOut();
                  closeMenu();
                }}
                data-testid="mobile-signout"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                className="btn btn-ghost btn-sm nav-mobile-cta"
                href="/account"
                onClick={closeMenu}
                data-testid="mobile-signin"
              >
                Sign in
              </Link>
            </>
          )}
        </nav>

        {/* Desktop CTA area */}
        <div className="nav-cta">
          {isSignedIn ? (
            <div className="nav-account" ref={accountRef}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                aria-haspopup="true"
                aria-expanded={accountOpen}
                aria-label={`Account: ${user!.email}`}
                onClick={() => setAccountOpen((v) => !v)}
                data-testid="account-menu-btn"
              >
                <span className="account-initial" aria-hidden="true">
                  {initialLetter}
                </span>
                {/* Chevron — rotates when open */}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{
                    transform: accountOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform var(--t-base)',
                  }}
                >
                  <path d="M2 4l4 4 4-4" />
                </svg>
              </button>

              {accountOpen && (
                <div
                  className="account-dropdown"
                  data-testid="account-dropdown"
                >
                  <div className="account-dropdown-email">{user!.email}</div>
                  <Link
                    href="/my/setups"
                    onClick={() => setAccountOpen(false)}
                    data-testid="account-my-setups"
                  >
                    My setups
                  </Link>
                  <Link
                    href="/my/test-drives"
                    onClick={() => setAccountOpen(false)}
                    data-testid="account-test-drives"
                  >
                    Test-drive history
                  </Link>
                  <button
                    type="button"
                    className="account-dropdown-signout"
                    onClick={handleSignOut}
                    data-testid="account-signout"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Only render Sign in once auth resolves to null (signed out). */}
              {user === null && (
                <Link
                  className="btn btn-ghost btn-sm"
                  href="/account"
                  data-testid="nav-signin"
                >
                  Sign in
                </Link>
              )}
              <Link className="btn btn-primary btn-sm" href="/start">
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          ref={burgerRef}
          className="nav-burger"
          aria-expanded={open}
          aria-controls="navLinks"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>
    </header>
  );
}
