'use client';

/**
 * TakedownControl — moderator-only control to take down an approved community setup.
 *
 * This component is rendered only when:
 *   - The viewer is a confirmed moderator (checked server-side in the detail page)
 *   - The setup is source==='community' AND reviewStatus==='approved'
 *
 * The actual privilege check happens in POST /api/admin/moderate (server), so even if
 * this component is rendered by mistake, the route enforces the moderator gate.
 *
 * Never imports server-only modules (createSupabaseServiceClient, etc.).
 */

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  setupId: string;
}

type Status = 'idle' | 'open' | 'busy' | 'done' | 'error';

export default function TakedownControl({ setupId }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('idle');
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // WCAG 2.4.3: move focus to the note textarea when the form opens so focus
  // is not lost to <body> when the trigger button unmounts.
  useEffect(() => {
    if (status === 'open') {
      textareaRef.current?.focus();
    }
  }, [status]);

  if (status === 'done') {
    return (
      <p
        className="small"
        style={{ color: 'var(--muted)', margin: 0 }}
        data-testid="takedown-done"
      >
        Setup taken down.
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim() || status === 'busy') return;
    setStatus('busy');
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setupId, action: 'takedown', note: note.trim() }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        setStatus('done');
        router.refresh();
      } else {
        setStatus('error');
        setErrorMsg(data.error ?? 'Action failed — please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error — please try again.');
    }
  }

  return (
    <div className="takedown-control" data-testid="takedown-control">
      {status === 'idle' && (
        <button
          type="button"
          className="takedown-trigger"
          onClick={() => setStatus('open')}
          data-testid="takedown-open"
        >
          Take down
        </button>
      )}

      {(status === 'open' || status === 'busy' || status === 'error') && (
        <form
          onSubmit={handleSubmit}
          className="takedown-form"
          data-testid="takedown-form"
        >
          <p
            className="small"
            style={{ color: 'var(--ink-soft)', margin: '0 0 10px', fontWeight: 600 }}
          >
            Moderator action: remove this setup from the public catalog.
          </p>

          <div className="field" style={{ marginBottom: '12px' }}>
            <label htmlFor="takedown-note">
              Reason{' '}
              <span style={{ fontWeight: 400, color: 'var(--muted)' }}>
                (required — the author sees this verbatim)
              </span>
            </label>
            <textarea
              id="takedown-note"
              className="input"
              ref={textareaRef}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              required
              placeholder="Explain why this setup is being removed…"
              disabled={status === 'busy'}
              data-testid="takedown-note"
            />
          </div>

          {errorMsg && (
            <p
              className="small"
              style={{ color: 'var(--bad)', margin: '0 0 10px' }}
              role="alert"
              data-testid="takedown-error"
            >
              {errorMsg}
            </p>
          )}

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="submit"
              className="btn btn-outline btn-sm"
              disabled={status === 'busy' || !note.trim()}
              data-testid="takedown-submit"
            >
              {status === 'busy' ? 'Taking down…' : 'Confirm takedown'}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setStatus('idle');
                setNote('');
                setErrorMsg('');
              }}
              disabled={status === 'busy'}
              data-testid="takedown-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
