'use client';

/**
 * AuthPrompt — the inline "sign in to unlock X" affordance (Section 8).
 *
 * Rendered in place of a gated action for a signed-out user. It never navigates
 * away or shows a bare login wall: it states, in plain language, what signing in
 * unlocks, then offers a passwordless email sign-in link right there.
 *
 * Reused by every gated action in Phase 4 (Save my setup, history, stored files)
 * and Phase 5.
 */

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type Phase = 'idle' | 'sending' | 'sent' | 'error';

interface Props {
  /** Plain-language explanation of what signing in unlocks. */
  message: string;
  /** Where to return after the magic link is clicked (defaults to current path). */
  redirectTo?: string;
}

export default function AuthPrompt({ message, redirectTo }: Props) {
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setPhase('sending');
    try {
      const supabase = createSupabaseBrowserClient();
      const emailRedirectTo =
        typeof window !== 'undefined'
          ? `${window.location.origin}/account/callback?next=${encodeURIComponent(
              redirectTo ?? window.location.pathname,
            )}`
          : undefined;
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo },
      });
      if (error) throw error;
      setPhase('sent');
    } catch {
      // Never surface the raw provider error.
      setPhase('error');
    }
  }

  return (
    <div className="auth-prompt" data-testid="auth-prompt" role="group" aria-label="Sign in to continue">
      <p className="auth-prompt-msg">{message}</p>

      {phase === 'sent' ? (
        <p className="auth-prompt-sent" data-testid="auth-prompt-sent">
          Check your email, we sent a one-tap sign-in link to{' '}
          <strong>{email.trim()}</strong>. It works on any device.
        </p>
      ) : (
        <form className="auth-prompt-form" onSubmit={sendLink}>
          <input
            type="email"
            required
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            data-testid="auth-prompt-email"
            disabled={phase === 'sending'}
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            data-testid="auth-prompt-send"
            disabled={phase === 'sending'}
          >
            {phase === 'sending' ? 'Sending…' : 'Email me a sign-in link'}
          </button>
        </form>
      )}

      {phase === 'error' && (
        <p className="auth-prompt-error" role="alert" data-testid="auth-prompt-error">
          That didn&apos;t go through. Check the address and try again.
        </p>
      )}

      <p className="auth-prompt-note small muted">
        No password needed. We never post or charge anything.
      </p>
    </div>
  );
}
