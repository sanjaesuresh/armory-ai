'use client';

/**
 * NewBuildStarter — renders the "Start a new setup" button on /build.
 *
 * Creates the draft server-side via the browser Supabase client (RLS enforces
 * that the author field matches the signed-in user), then navigates to
 * /build/<id>. Using a button (rather than creating on-load) avoids duplicate
 * drafts if the user refreshes the /build page.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  buildDraftRow,
  createSupabaseDraftsStore,
  type DraftInput,
} from '@/lib/community/drafts';

export default function NewBuildStarter() {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    setStarting(true);
    setError(null);
    try {
      // Client created only inside the handler — not at module/render time.
      const client = createSupabaseBrowserClient();
      const {
        data: { user },
        error: authError,
      } = await client.auth.getUser();
      if (authError || !user) throw new Error('Not signed in.');

      const id = crypto.randomUUID();
      // Seed a valid placeholder slug: draft-<8 hex chars>
      const shortHex = id.replace(/-/g, '').slice(0, 8);
      const now = new Date().toISOString();

      const initialInput: DraftInput = {
        slug: `draft-${shortHex}`,
        name: '',
        tagline: '',
        description: '',
        role: '',
        industry: null,
        category: 'general',
        tags: [],
        targets: ['claude-app'],
        tier: 'core',
        instructionTemplate: '',
        variables: [],
        knowledgeFiles: [],
        scenarios: [],
      };

      const store = createSupabaseDraftsStore(client);
      await store.insertRow(
        buildDraftRow({ id, authorId: user.id, now, input: initialInput }),
      );
      router.push(`/build/${id}`);
    } catch {
      setError('Could not start a new setup. Check your connection and try again.');
      setStarting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary btn-lg"
        onClick={handleStart}
        disabled={starting}
        aria-disabled={starting}
        data-testid="start-new-setup"
      >
        {starting ? 'Starting…' : 'Start a new setup'}
      </button>
      {error && (
        <p
          role="alert"
          style={{ color: 'var(--bad)', fontSize: '0.9rem', marginTop: 12 }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
