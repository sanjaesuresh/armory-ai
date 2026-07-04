'use client';

/**
 * SaveSetupControl — the "Save my setup" action on the customize review step
 * (Phase 4 Task 3).
 *
 * Signed out: reveals the inline AuthPrompt with a plain "what this unlocks"
 * message — never a login wall, never navigating away. Because the answers live
 * in sessionStorage and the magic link returns to this same page, completing
 * sign-in leaves the typed answers intact; the user lands back here signed in
 * and can save.
 *
 * Signed in: names the setup (defaulting to the setup's name) and saves the
 * current answers with the setup id + version through the browser Supabase
 * client under RLS.
 */

import { useState } from 'react';
import Link from 'next/link';
import type { Answers } from '@/lib/setup/types';
import AuthPrompt from '@/components/AuthPrompt';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { createSupabaseSavedSetupsStore } from '@/lib/saved/savedSetups';

interface Props {
  setupId: string;
  setupVersion: string;
  setupName: string;
  slug: string;
  answers: Answers;
  signedIn: boolean;
  userId?: string;
}

type Mode = 'idle' | 'auth' | 'naming' | 'saved';

export default function SaveSetupControl({
  setupId,
  setupVersion,
  setupName,
  slug,
  answers,
  signedIn,
  userId,
}: Props) {
  const [mode, setMode] = useState<Mode>('idle');
  const [name, setName] = useState(setupName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSaveClick() {
    setError(null);
    setMode(signedIn ? 'naming' : 'auth');
  }

  async function doSave() {
    if (!userId) {
      setError('Please sign in again to save.');
      return;
    }
    const trimmed = name.trim() || setupName;
    setSaving(true);
    setError(null);
    try {
      const store = createSupabaseSavedSetupsStore(createSupabaseBrowserClient());
      await store.save({
        userId,
        setupId,
        setupVersion,
        name: trimmed,
        answers,
      });
      setMode('saved');
    } catch {
      setError('Could not save your setup. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (mode === 'saved') {
    return (
      <div className="success-note" style={{ margin: '16px 0 0' }} data-testid="save-success">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
        <span>
          Saved to your account.{' '}
          <Link href="/my/setups" data-testid="save-view-link">View in My setups</Link>.
        </span>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--hairline)' }}>
      {mode === 'idle' && (
        <button
          type="button"
          className="btn btn-outline"
          onClick={onSaveClick}
          data-testid="save-setup-button"
        >
          Save my setup
        </button>
      )}

      {mode === 'auth' && (
        <div data-testid="save-auth-prompt">
          <AuthPrompt
            message="Sign in to save this setup and pick it up on any device. Your answers stay right here."
            redirectTo={`/setup/${slug}/customize`}
          />
        </div>
      )}

      {mode === 'naming' && (
        <div>
          <label htmlFor="save-setup-name" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 6 }}>
            Name this setup
          </label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input
              id="save-setup-name"
              className="input"
              value={name}
              disabled={saving}
              onChange={(e) => setName(e.target.value)}
              style={{ flex: 1, minWidth: 200 }}
              data-testid="save-setup-name"
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={doSave}
              disabled={saving}
              data-testid="save-setup-confirm"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setMode('idle')}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" style={{ marginTop: 10, fontSize: '0.85rem', color: 'var(--bad)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
