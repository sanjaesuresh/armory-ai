'use client';

/**
 * UpvoteButton — togglable upvote control for the setup detail page.
 *
 * Signed-in: optimistic toggle via toggleUpvote; reverts on failure.
 * Signed-out: clicking reveals an inline AuthPrompt (no redirect, no wall).
 * Never instantiates the browser Supabase client at render time — only in the handler.
 */

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { createSupabaseUpvotesStore, toggleUpvote } from '@/lib/community/upvotes';
import AuthPrompt from '@/components/AuthPrompt';

interface Props {
  setupId: string;
  initialCount: number;
  initialUpvoted: boolean;
  /** null = signed-out (clicking reveals AuthPrompt) */
  userId: string | null;
}

export default function UpvoteButton({
  setupId,
  initialCount,
  initialUpvoted,
  userId,
}: Props) {
  const [count, setCount] = useState(initialCount);
  const [upvoted, setUpvoted] = useState(initialUpvoted);
  const [busy, setBusy] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (!userId) {
      setShowAuth(true);
      return;
    }
    if (busy) return;

    // Optimistic update before the round-trip.
    const prevCount = count;
    const prevUpvoted = upvoted;
    const nextUpvoted = !upvoted;
    setUpvoted(nextUpvoted);
    setCount(nextUpvoted ? count + 1 : count - 1);
    setError(null);
    setBusy(true);

    try {
      const store = createSupabaseUpvotesStore(createSupabaseBrowserClient());
      const result = await toggleUpvote(
        { userId, setupId },
        store,
        new Date().toISOString(),
      );
      // Reconcile with server's authoritative count.
      setCount(result.count);
      setUpvoted(result.upvoted);
    } catch {
      // Revert optimistic update on any failure.
      setCount(prevCount);
      setUpvoted(prevUpvoted);
      setError('Could not save your upvote — please try again.');
    } finally {
      setBusy(false);
    }
  }

  const countLabel = `${count} ${count === 1 ? 'upvote' : 'upvotes'}`;
  const ariaLabel = upvoted
    ? `Remove upvote — ${countLabel}`
    : `Upvote — ${countLabel}`;

  return (
    <div className="upvote-wrap">
      <button
        type="button"
        className={`upvote-btn${upvoted ? ' upvote-btn--active' : ''}`}
        aria-pressed={upvoted}
        aria-label={ariaLabel}
        onClick={handleClick}
        disabled={busy}
        data-testid="upvote-button"
      >
        <span aria-hidden="true">▲</span>
        <span>{countLabel}</span>
      </button>

      {error && (
        <p
          className="small"
          style={{ color: 'var(--bad)', margin: '6px 0 0' }}
          role="alert"
          data-testid="upvote-error"
        >
          {error}
        </p>
      )}

      {showAuth && (
        <div style={{ marginTop: '16px' }} data-testid="upvote-auth-prompt">
          <AuthPrompt message="Sign in to upvote setups." />
        </div>
      )}
    </div>
  );
}
