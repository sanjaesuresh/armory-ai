/**
 * UpvoteButton component tests.
 * Environment: jsdom (vitest.config.ts routes components/**\/*.test.tsx here).
 *
 * Tests the signed-out → AuthPrompt flow and the optimistic toggle logic.
 * Never instantiates a real Supabase client — the browser client is mocked at
 * the module level so it is only constructed in handlers, not at render time.
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UpvoteButton from './UpvoteButton';

// ── Module mocks ──────────────────────────────────────────────────────────────

// createSupabaseBrowserClient must never be called at render time — only in the
// click handler. The mock returns a no-op object; the real toggleUpvote impl is
// also mocked below so no Supabase calls escape.
vi.mock('@/lib/supabase/client', () => ({
  createSupabaseBrowserClient: vi.fn(() => ({})),
}));

// Mock toggleUpvote and createSupabaseUpvotesStore so the test controls responses
// without real Supabase interactions.
vi.mock('@/lib/community/upvotes', () => ({
  createSupabaseUpvotesStore: vi.fn(() => ({})),
  toggleUpvote: vi.fn(),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getToggleUpvoteMock() {
  const mod = await import('@/lib/community/upvotes');
  return mod.toggleUpvote as ReturnType<typeof vi.fn>;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('UpvoteButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial count and upvoted=false state', () => {
    render(
      <UpvoteButton setupId="s1" initialCount={5} initialUpvoted={false} userId={null} />,
    );
    const btn = screen.getByTestId('upvote-button');
    expect(btn.textContent).toContain('5 upvotes');
    expect(btn.getAttribute('aria-pressed')).toBe('false');
  });

  it('renders singular "upvote" for a count of 1', () => {
    render(
      <UpvoteButton setupId="s1" initialCount={1} initialUpvoted={false} userId={null} />,
    );
    expect(screen.getByTestId('upvote-button').textContent).toContain('1 upvote');
  });

  it('signed-out: clicking reveals AuthPrompt, does NOT call toggleUpvote', async () => {
    const user = userEvent.setup();
    render(
      <UpvoteButton setupId="s1" initialCount={5} initialUpvoted={false} userId={null} />,
    );

    await user.click(screen.getByTestId('upvote-button'));

    expect(screen.getByTestId('auth-prompt')).toBeTruthy();
    const toggleMock = await getToggleUpvoteMock();
    expect(toggleMock).not.toHaveBeenCalled();
  });

  it('signed-out: AuthPrompt shows the "Sign in to upvote setups." message', async () => {
    const user = userEvent.setup();
    render(
      <UpvoteButton setupId="s1" initialCount={5} initialUpvoted={false} userId={null} />,
    );

    await user.click(screen.getByTestId('upvote-button'));

    expect(screen.getByText(/Sign in to upvote setups\./i)).toBeTruthy();
  });

  it('signed-in: optimistic upvote increments count immediately', async () => {
    const user = userEvent.setup();
    const toggleMock = await getToggleUpvoteMock();
    // Simulate a slow response — the optimistic update should be visible before it resolves.
    let resolveToggle!: (v: { upvoted: boolean; count: number }) => void;
    toggleMock.mockReturnValueOnce(
      new Promise<{ upvoted: boolean; count: number }>((res) => {
        resolveToggle = res;
      }),
    );

    render(
      <UpvoteButton setupId="s1" initialCount={5} initialUpvoted={false} userId="user-1" />,
    );

    await user.click(screen.getByTestId('upvote-button'));

    // Optimistic: count should be 6 and aria-pressed true before the server responds.
    expect(screen.getByTestId('upvote-button').textContent).toContain('6 upvotes');
    expect(screen.getByTestId('upvote-button').getAttribute('aria-pressed')).toBe('true');

    // Resolve with server count — reconcile to authoritative value.
    resolveToggle({ upvoted: true, count: 7 });
    await waitFor(() => {
      expect(screen.getByTestId('upvote-button').textContent).toContain('7 upvotes');
    });
  });

  it('signed-in: reverts optimistic update on toggleUpvote failure', async () => {
    const user = userEvent.setup();
    const toggleMock = await getToggleUpvoteMock();
    toggleMock.mockRejectedValueOnce(new Error('network error'));

    render(
      <UpvoteButton setupId="s1" initialCount={5} initialUpvoted={false} userId="user-1" />,
    );

    await user.click(screen.getByTestId('upvote-button'));

    // After the rejection the count should revert to 5 and an error message shown.
    await waitFor(() => {
      expect(screen.getByTestId('upvote-button').textContent).toContain('5 upvotes');
    });
    expect(screen.getByTestId('upvote-error')).toBeTruthy();
  });

  it('signed-in: shows aria-pressed=true when initialUpvoted=true', () => {
    render(
      <UpvoteButton setupId="s1" initialCount={12} initialUpvoted={true} userId="user-1" />,
    );
    expect(screen.getByTestId('upvote-button').getAttribute('aria-pressed')).toBe('true');
  });
});
