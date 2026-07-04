/**
 * Nav component tests.
 * Environment: jsdom (routed via vitest.config.ts dom project).
 *
 * Auth state is injected by mocking createSupabaseBrowserClient so these
 * tests run without a live Supabase connection.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import Nav from './Nav';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

// ---- Supabase client mock ----------------------------------------

vi.mock('@/lib/supabase/client', () => ({
  createSupabaseBrowserClient: vi.fn(),
}));

type AuthCallback = (event: string, session: null | { user: { email: string } }) => void;

function mockSupabase(userEmail: string | null): Partial<SupabaseClient> {
  const unsubscribe = vi.fn();
  return {
    auth: {
      onAuthStateChange: vi.fn((cb: AuthCallback) => {
        // Fire the initial session event synchronously so tests don't need waitFor.
        if (userEmail) {
          cb('SIGNED_IN', { user: { email: userEmail } });
        } else {
          cb('SIGNED_OUT', null);
        }
        return { data: { subscription: { unsubscribe } } };
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    } as unknown as SupabaseClient['auth'],
  } as Partial<SupabaseClient>;
}

beforeEach(() => {
  // Default: signed out — keeps existing tests unaffected.
  vi.mocked(createSupabaseBrowserClient).mockReturnValue(
    mockSupabase(null) as ReturnType<typeof createSupabaseBrowserClient>,
  );
});

// ---- Existing tests (unchanged behaviour, now backed by the mock) -----

describe('Nav', () => {
  it('renders the brand logo link to /', () => {
    render(<Nav />);
    const brand = screen.getByRole('link', { name: /Armory/i });
    expect(brand).toHaveAttribute('href', '/');
  });

  it('renders "Browse setups" link to /catalog', () => {
    render(<Nav />);
    const link = screen.getByRole('link', { name: 'Browse setups' });
    expect(link).toHaveAttribute('href', '/catalog');
  });

  it('renders "How it works" link to /#how', () => {
    render(<Nav />);
    const link = screen.getByRole('link', { name: 'How it works' });
    expect(link).toHaveAttribute('href', '/#how');
  });

  it('renders "Get started" CTA link(s) to /start', () => {
    render(<Nav />);
    // Two links: desktop nav-cta and the mobile-only link inside the dropdown.
    const links = screen.getAllByRole('link', { name: 'Get started' });
    expect(links.length).toBeGreaterThanOrEqual(1);
    links.forEach((link) => expect(link).toHaveAttribute('href', '/start'));
  });

  it('burger button starts with aria-expanded=false', () => {
    render(<Nav />);
    const burger = screen.getByRole('button', { name: /open menu/i });
    expect(burger).toHaveAttribute('aria-expanded', 'false');
  });

  it('burger toggles aria-expanded to true on click', () => {
    render(<Nav />);
    const burger = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(burger);
    expect(burger).toHaveAttribute('aria-expanded', 'true');
  });

  it('burger toggles aria-expanded back to false on second click', () => {
    render(<Nav />);
    const burger = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(burger);
    fireEvent.click(burger);
    expect(burger).toHaveAttribute('aria-expanded', 'false');
  });

  it('pressing Escape closes the menu and aria-expanded returns to false', () => {
    render(<Nav />);
    const burger = screen.getByRole('button', { name: /open menu/i });

    // Open it
    fireEvent.click(burger);
    expect(burger).toHaveAttribute('aria-expanded', 'true');

    // Close via Escape
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(burger).toHaveAttribute('aria-expanded', 'false');
  });

  it('burger has aria-controls pointing to the nav links element', () => {
    render(<Nav />);
    const burger = screen.getByRole('button', { name: /open menu/i });
    expect(burger).toHaveAttribute('aria-controls', 'navLinks');
    expect(document.getElementById('navLinks')).not.toBeNull();
  });

  it('clicking burger open adds "open" class to the nav element', () => {
    render(<Nav />);
    const burger = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(burger);
    // header has className="nav open" when open
    expect(document.querySelector('.nav')).toHaveClass('open');
  });

  it('pressing Escape removes "open" class from the nav element', () => {
    render(<Nav />);
    const burger = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(burger);
    expect(document.querySelector('.nav')).toHaveClass('open');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.querySelector('.nav')).not.toHaveClass('open');
  });
});

// ---- Auth-aware tests ------------------------------------------------

describe('Nav — signed-out state', () => {
  it('shows a "Sign in" link to /account when signed out', async () => {
    render(<Nav />);
    await waitFor(() => {
      const link = screen.getByTestId('nav-signin');
      expect(link).toHaveAttribute('href', '/account');
    });
  });

  it('does not render the account menu button when signed out', async () => {
    render(<Nav />);
    await waitFor(() => {
      expect(screen.queryByTestId('account-menu-btn')).toBeNull();
    });
  });

  it('shows a mobile Sign in link inside the nav links when signed out', () => {
    render(<Nav />);
    const mobileSignIn = screen.getByTestId('mobile-signin');
    expect(mobileSignIn).toHaveAttribute('href', '/account');
  });
});

describe('Nav — signed-in state', () => {
  beforeEach(() => {
    vi.mocked(createSupabaseBrowserClient).mockReturnValue(
      mockSupabase('ada@armory.example') as ReturnType<typeof createSupabaseBrowserClient>,
    );
  });

  it('shows the account menu button with the user initial when signed in', async () => {
    render(<Nav />);
    await waitFor(() => {
      const btn = screen.getByTestId('account-menu-btn');
      expect(btn).toBeInTheDocument();
      // aria-label includes the email
      expect(btn).toHaveAttribute('aria-label', 'Account: ada@armory.example');
    });
  });

  it('does not show a "Sign in" link when signed in', async () => {
    render(<Nav />);
    await waitFor(() => {
      expect(screen.queryByTestId('nav-signin')).toBeNull();
    });
  });

  it('account menu button starts closed (aria-expanded=false)', async () => {
    render(<Nav />);
    await waitFor(() => {
      const btn = screen.getByTestId('account-menu-btn');
      expect(btn).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('clicking the account button opens the dropdown', async () => {
    render(<Nav />);
    await waitFor(() => screen.getByTestId('account-menu-btn'));
    const btn = screen.getByTestId('account-menu-btn');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('account-dropdown')).toBeInTheDocument();
  });

  it('dropdown shows the user email, My setups, Test-drive history, and Sign out', async () => {
    render(<Nav />);
    await waitFor(() => screen.getByTestId('account-menu-btn'));
    fireEvent.click(screen.getByTestId('account-menu-btn'));

    const dropdown = screen.getByTestId('account-dropdown');
    expect(dropdown).toHaveTextContent('ada@armory.example');
    expect(screen.getByTestId('account-my-setups')).toHaveAttribute('href', '/my/setups');
    expect(screen.getByTestId('account-test-drives')).toHaveAttribute('href', '/my/test-drives');
    expect(screen.getByTestId('account-signout')).toBeInTheDocument();
  });

  it('Escape closes the account dropdown when it is open', async () => {
    render(<Nav />);
    await waitFor(() => screen.getByTestId('account-menu-btn'));
    const btn = screen.getByTestId('account-menu-btn');
    fireEvent.click(btn);
    expect(screen.getByTestId('account-dropdown')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByTestId('account-dropdown')).toBeNull();
  });

  it('shows mobile account links (My setups, Test-drive history) when signed in', async () => {
    render(<Nav />);
    await waitFor(() => screen.getByTestId('mobile-my-setups'));
    expect(screen.getByTestId('mobile-my-setups')).toHaveAttribute('href', '/my/setups');
    expect(screen.getByTestId('mobile-test-drives')).toHaveAttribute('href', '/my/test-drives');
    expect(screen.getByTestId('mobile-signout')).toBeInTheDocument();
  });

  it('does not show the "Get started" link when signed in', async () => {
    render(<Nav />);
    await waitFor(() => screen.getByTestId('account-menu-btn'));
    expect(screen.queryByRole('link', { name: 'Get started' })).toBeNull();
  });
});
