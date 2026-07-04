'use client';

/**
 * SubmissionActions — inline actions for a single submission row.
 *
 * Pending rows: "Withdraw to edit" (pending → draft).
 * Rejected rows: "Edit & resubmit" (rejected → draft, then navigates to /build/<id>).
 *
 * Uses the browser Supabase client + the drafts store (RLS-scoped to the author).
 * Server state is refreshed via router.refresh() after a successful withdraw so
 * the server component re-renders the updated list.
 *
 * Never imports server-only modules (createAnthropicModelClient, submit route).
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  createSupabaseDraftsStore,
  withdrawSubmission,
  reopenRejected,
} from '@/lib/community/drafts';

interface Props {
  id: string;
  reviewStatus: 'pending' | 'rejected';
}

export default function SubmissionActions({ id, reviewStatus }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleWithdraw() {
    setBusy(true);
    setError(null);
    try {
      const store = createSupabaseDraftsStore(createSupabaseBrowserClient());
      await withdrawSubmission(id, store, new Date().toISOString());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
      setBusy(false);
    }
  }

  async function handleReopen() {
    setBusy(true);
    setError(null);
    try {
      const store = createSupabaseDraftsStore(createSupabaseBrowserClient());
      await reopenRejected(id, store, new Date().toISOString());
      router.push(`/build/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
      setBusy(false);
    }
  }

  return (
    <>
      {reviewStatus === 'pending' && (
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={handleWithdraw}
          disabled={busy}
          data-testid="submission-withdraw"
        >
          {busy ? 'Withdrawing…' : 'Withdraw to edit'}
        </button>
      )}

      {reviewStatus === 'rejected' && (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => void handleReopen()}
          disabled={busy}
          data-testid="submission-reopen"
        >
          {busy ? 'Opening…' : 'Edit & resubmit'}
        </button>
      )}

      {error && (
        <p
          role="alert"
          style={{ fontSize: '0.82rem', color: 'var(--bad)', margin: '6px 0 0', flexBasis: '100%' }}
          data-testid="submission-action-error"
        >
          {error}
        </p>
      )}
    </>
  );
}
