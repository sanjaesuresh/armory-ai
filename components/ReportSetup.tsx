'use client';

/**
 * ReportSetup — low-key "Report this setup" affordance on the detail page.
 *
 * Signed-in: expands to a reason select + optional note; calls fileReport.
 * Signed-out: clicking reveals an inline AuthPrompt (no redirect, no wall).
 * Never instantiates the browser Supabase client at render time — only in the handler.
 */

import { useState, useRef, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  createSupabaseReportsStore,
  fileReport,
  REPORT_REASONS,
} from '@/lib/community/reports';
import AuthPrompt from '@/components/AuthPrompt';

interface Props {
  setupId: string;
  /** null = signed-out (clicking reveals AuthPrompt) */
  userId: string | null;
}

type Status = 'idle' | 'open' | 'busy' | 'success' | 'already-reported' | 'error';

export default function ReportSetup({ setupId, userId }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [showAuth, setShowAuth] = useState(false);
  const [reason, setReason] = useState<string>(REPORT_REASONS[0]);
  const [note, setNote] = useState('');
  const selectRef = useRef<HTMLSelectElement>(null);

  // WCAG 2.4.3: move focus to the first form field when the form opens so focus
  // is not lost to <body> when the trigger button unmounts.
  useEffect(() => {
    if (status === 'open') {
      selectRef.current?.focus();
    }
  }, [status]);

  function handleOpen() {
    if (!userId) {
      setShowAuth(true);
      return;
    }
    setStatus('open');
  }

  function handleCancel() {
    setStatus('idle');
    setReason(REPORT_REASONS[0]);
    setNote('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || status === 'busy') return;
    setStatus('busy');

    try {
      const store = createSupabaseReportsStore(createSupabaseBrowserClient());
      const result = await fileReport(
        { reporterId: userId, setupId, reason, note: note.trim() || undefined },
        store,
        new Date().toISOString(),
      );
      if (result.ok) {
        setStatus('success');
      } else if (result.code === 'already-reported') {
        setStatus('already-reported');
      } else {
        // invalid-reason — shouldn't happen via the select but handle it.
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  // Signed-out flow: show AuthPrompt in place of the trigger.
  if (showAuth) {
    return (
      <div style={{ marginTop: '12px' }}>
        <AuthPrompt message="Sign in to report a setup." />
      </div>
    );
  }

  if (status === 'success') {
    return (
      <p
        className="report-setup-outcome"
        role="status"
        data-testid="report-setup-success"
      >
        Thanks, our team will take a look.
      </p>
    );
  }

  if (status === 'already-reported') {
    return (
      <p
        className="report-setup-outcome"
        role="status"
        data-testid="report-setup-already"
      >
        You&apos;ve already reported this setup.
      </p>
    );
  }

  return (
    <div className="report-setup" data-testid="report-setup">
      {status === 'idle' && (
        <button
          type="button"
          className="report-setup-trigger"
          onClick={handleOpen}
          data-testid="report-setup-trigger"
        >
          Report this setup
        </button>
      )}

      {(status === 'open' || status === 'busy' || status === 'error') && (
        <form
          className="report-setup-form"
          onSubmit={handleSubmit}
          data-testid="report-setup-form"
        >
          <p className="small" style={{ color: 'var(--ink-soft)', margin: '0 0 12px' }}>
            Help keep the library safe. Reports are reviewed by the Armory team.
          </p>

          <div className="field" style={{ marginBottom: '10px' }}>
            <label htmlFor="report-reason">Reason</label>
            <select
              id="report-reason"
              className="select-el"
              ref={selectRef}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              disabled={status === 'busy'}
            >
              {REPORT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1).replace(/-/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="field" style={{ marginBottom: '12px' }}>
            <label htmlFor="report-note">
              Additional note{' '}
              <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(optional)</span>
            </label>
            <textarea
              id="report-note"
              className="input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Any extra context for the moderation team…"
              disabled={status === 'busy'}
            />
          </div>

          {status === 'error' && (
            <p
              className="small"
              style={{ color: 'var(--bad)', margin: '0 0 10px' }}
              role="alert"
            >
              Something went wrong, please try again.
            </p>
          )}

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="submit"
              className="btn btn-outline btn-sm"
              disabled={status === 'busy'}
            >
              {status === 'busy' ? 'Sending…' : 'Submit report'}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleCancel}
              disabled={status === 'busy'}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
