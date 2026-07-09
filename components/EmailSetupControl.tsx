'use client';

/**
 * EmailSetupControl — "Email me my setup", the zero-friction take-away for a
 * signed-out user on the customize review step (Email My Setup plan, Task 7).
 *
 * Posts { email, setupId, setupVersion, answers } to POST /api/email/setup.
 * The server recompiles the setup itself from setupId/answers — this
 * component never sends compiled prompt text, so it can't be used to relay
 * arbitrary content even if the client were tampered with.
 *
 * Styled after AuthPrompt's inline-affordance pattern (message + form +
 * sent/error states) but under its own `.email-setup` class names so the
 * pre-existing `.auth-prompt` rules are never touched.
 */

import { useState } from 'react';
import type { Answers } from '@/lib/setup/types';

type Phase = 'idle' | 'sending' | 'sent' | 'invalid_email' | 'rate_limited' | 'error';

interface Props {
  setupId: string;
  setupVersion: string;
  answers: Answers;
}

/** Copy shown for each non-happy-path phase — never surfaces the raw API error. */
const PHASE_MESSAGE: Partial<Record<Phase, string>> = {
  invalid_email: "That doesn't look like a valid email address. Check it and try again.",
  rate_limited: "You've requested a few links recently — try again in a bit.",
  error: "Couldn't send that. Please try again.",
};

export default function EmailSetupControl({ setupId, setupVersion, answers }: Props) {
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');

  async function sendSetup(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || phase === 'sending') return;
    setPhase('sending');
    try {
      const res = await fetch('/api/email/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, setupId, setupVersion, answers }),
      });
      const body = await res.json().catch(() => null);
      if (res.ok && body?.ok) {
        setPhase('sent');
        return;
      }
      // Map known error codes to their dedicated copy; anything else falls
      // back to the generic 'error' phase rather than showing raw API text.
      const code = body?.code;
      if (code === 'invalid_email') setPhase('invalid_email');
      else if (code === 'rate_limited') setPhase('rate_limited');
      else setPhase('error');
    } catch {
      setPhase('error');
    }
  }

  const inlineError = phase === 'invalid_email' ? PHASE_MESSAGE.invalid_email : null;
  const bannerError =
    phase === 'rate_limited' || phase === 'error' ? PHASE_MESSAGE[phase] : null;

  return (
    <div className="email-setup" data-testid="email-setup" role="group" aria-label="Email me my setup">
      {phase === 'sent' ? (
        <p className="email-setup-sent" role="status" aria-live="polite" data-testid="email-setup-sent">
          Sent! Check <strong>{email.trim()}</strong> for your setup, ready to paste into Claude.
        </p>
      ) : (
        <form className="email-setup-form" onSubmit={sendSetup} noValidate>
          <div className={`field email-setup-field${inlineError ? ' invalid' : ''}`}>
            <label htmlFor="email-setup-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-setup-address"
              className="input"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              placeholder="you@example.com"
              aria-describedby={inlineError ? 'email-setup-error' : undefined}
              aria-invalid={inlineError ? true : undefined}
              data-testid="email-setup-address"
              disabled={phase === 'sending'}
            />
            {inlineError && (
              <p
                id="email-setup-error"
                className="error-msg"
                role="alert"
                aria-live="polite"
                data-testid="email-setup-invalid"
              >
                {inlineError}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            data-testid="email-setup-send"
            disabled={phase === 'sending'}
          >
            {phase === 'sending' ? 'Sending…' : 'Email me my setup'}
          </button>
        </form>
      )}

      {bannerError && (
        <p
          className="email-setup-error"
          role="alert"
          aria-live="polite"
          data-testid={phase === 'rate_limited' ? 'email-setup-rate-limited' : 'email-setup-server-error'}
        >
          {bannerError}
        </p>
      )}

      {phase !== 'sent' && (
        <p className="email-setup-note small muted">
          No account needed. We only use this to send your setup once.
        </p>
      )}
    </div>
  );
}
