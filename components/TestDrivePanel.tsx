'use client';

/**
 * TestDrivePanel — the customize-page test-drive section.
 *
 * Consumes the POST /api/test-drive SSE contract:
 *   event: chunk   data: <JSON-encoded string>
 *   event: done    data: { cached: boolean, usage: {...} }
 *   event: error   data: { code: string, message: string, retryAt?: string }
 *
 * Both a live 200 streaming response and a non-200 body (a single SSE error
 * event) are parsed identically.
 *
 * Flag gating: rendered only when testDriveEnabled=true; the parent server
 * component controls that prop.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Setup, Scenario, Answers } from '@/lib/setup/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase =
  | 'idle'
  | 'streaming'
  | 'done'
  | 'error-model'
  | 'error-timeout'
  | 'error-quota'
  | 'error-budget';

interface SSEError {
  code: string;
  message: string;
  retryAt?: string;
}

// ─── Pastel badge tints (cycling by index) ────────────────────────────────────

const BADGE_TINTS = [
  'var(--butter)',
  'var(--sky)',
  'var(--sage)',
  'var(--blush)',
  'var(--lilac)',
  'var(--peach)',
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconPlay() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function IconStop() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4 2.8 19.5h18.4z" />
      <path d="M12 10v4.5M12 17.2v.1" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function IconScenario() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface Props {
  setup: Setup;
  answers: Answers;
  /** Same gate as canExport in CustomizeView. */
  canRun: boolean;
  /** Same "why disabled" message as the export button. */
  runDisabledReason: string | null;
  /**
   * External trigger from the PreviewPanel "Test-drive with your answers"
   * button. When key increments, the panel auto-selects the given scenarioId
   * and runs it.
   */
  externalRun?: { scenarioId: string; key: number } | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TestDrivePanel({
  setup,
  answers,
  canRun,
  runDisabledReason,
  externalRun,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [streamText, setStreamText] = useState('');
  const [cached, setCached] = useState(false);
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null);
  const [quotaResetAt, setQuotaResetAt] = useState<string | undefined>(undefined);
  // Local run-count tracking: starts at 5 (the per-token cap), decrements on
  // each live (non-cached) run. Set to 0 on a quota error from the server.
  const [runsLeft, setRunsLeft] = useState(5);

  // Refs for abort / cancel logic
  const abortRef = useRef<AbortController | null>(null);
  const userCancelledRef = useRef(false);
  const answersRef = useRef<Answers>(answers);
  const lastExternalKey = useRef<number | null>(null);

  // Keep answers ref fresh without re-creating runScenario
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // ── Core run function ───────────────────────────────────────────────────────

  const runScenario = useCallback(async (scenarioId: string) => {
    if (phase === 'streaming') return; // already running
    const scenario = setup.scenarios.find((s) => s.id === scenarioId);
    if (!scenario) return;

    userCancelledRef.current = false;
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const timeoutId = setTimeout(() => {
      ctrl.abort('timeout');
    }, 60_000);

    setPhase('streaming');
    setStreamText('');
    setCached(false);
    setCurrentScenarioId(scenarioId);

    try {
      const response = await fetch('/api/test-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: setup.slug,
          answers: answersRef.current,
          scenarioId,
        }),
        signal: ctrl.signal,
      });

      if (!response.body) {
        setPhase('error-model');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Parse SSE. Handles both 200 streaming and non-200 with a single
      // SSE error event in the body — the same parsing loop handles both.
      parse: while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let boundary: number;
        while ((boundary = buffer.indexOf('\n\n')) !== -1) {
          const block = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);

          let eventName = 'message';
          let data = '';
          for (const line of block.split('\n')) {
            if (line.startsWith('event: ')) {
              eventName = line.slice(7).trim();
            } else if (line.startsWith('data: ')) {
              data = line.slice(6);
            }
          }

          if (eventName === 'chunk') {
            const text = JSON.parse(data) as string;
            setStreamText((prev) => prev + text);
          } else if (eventName === 'done') {
            const doneData = JSON.parse(data) as { cached: boolean };
            setCached(doneData.cached);
            setPhase('done');
            if (!doneData.cached) {
              setRunsLeft((prev) => Math.max(0, prev - 1));
            }
            break parse;
          } else if (eventName === 'error') {
            const errData = JSON.parse(data) as SSEError;
            applyError(errData);
            break parse;
          }
        }
      }

      reader.releaseLock();
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        if (userCancelledRef.current) {
          setPhase('idle');
          setStreamText('');
          setCurrentScenarioId(null);
        } else {
          // Timeout
          setPhase('error-timeout');
        }
      } else {
        setPhase('error-model');
      }
    } finally {
      clearTimeout(timeoutId);
      abortRef.current = null;
    }

    function applyError(err: SSEError) {
      if (err.code === 'session-cap' || err.code === 'ip-cap') {
        setPhase('error-quota');
        setRunsLeft(0);
        setQuotaResetAt(err.retryAt);
      } else if (err.code === 'global-budget') {
        setPhase('error-budget');
      } else {
        setPhase('error-model');
      }
    }
  }, [phase, setup.slug, setup.scenarios]);

  // ── Cancel ─────────────────────────────────────────────────────────────────

  const handleCancel = useCallback(() => {
    userCancelledRef.current = true;
    abortRef.current?.abort();
  }, []);

  // ── Retry ──────────────────────────────────────────────────────────────────

  const handleRetry = useCallback(() => {
    if (!currentScenarioId) return;
    setPhase('idle');
    setTimeout(() => runScenario(currentScenarioId), 0);
  }, [currentScenarioId, runScenario]);

  // ── External trigger (PreviewPanel button) ──────────────────────────────────

  useEffect(() => {
    if (!externalRun) return;
    if (externalRun.key === lastExternalKey.current) return;
    lastExternalKey.current = externalRun.key;

    if (!canRun) return;

    setSelectedId(externalRun.scenarioId);
    // Run after the state update settles
    const id = externalRun.scenarioId;
    const frameId = requestAnimationFrame(() => {
      runScenario(id);
    });
    return () => cancelAnimationFrame(frameId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalRun?.key]);

  // ── Derived ────────────────────────────────────────────────────────────────

  const currentScenario: Scenario | null =
    (currentScenarioId ?? selectedId)
      ? (setup.scenarios.find((s) => s.id === (phase !== 'idle' ? currentScenarioId : selectedId)) ?? null)
      : null;

  const selectedScenario: Scenario | null = selectedId
    ? (setup.scenarios.find((s) => s.id === selectedId) ?? null)
    : null;

  const isRunning = phase === 'streaming';
  const isDone = phase === 'done';
  const isError = phase.startsWith('error-');

  // Run button: disabled if no scenario selected, not ready, running, or quota hit
  const runDisabled = !canRun || !selectedId || isRunning || runsLeft === 0 || phase === 'error-quota';

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <section className="td-section" data-testid="test-drive-panel" aria-label="Test-drive your setup">
      <div style={{ marginBottom: '6px' }}>
        <span className="eyebrow">Optional</span>
      </div>
      <h2>Try it before you export</h2>
      <p className="muted" style={{ maxWidth: '48em', marginBottom: 0 }}>
        Pick a scenario and run it through your customized setup — see real output stream back,
        then compare it to what a good response looks like.
      </p>

      {/* ── Scenario picker ────────────────────────────────────────────────── */}
      {setup.scenarios.length === 0 ? (
        <p className="muted" style={{ marginTop: '24px', fontStyle: 'italic' }}>
          This setup has no test scenarios defined.
        </p>
      ) : (
        <div
          className="scenario-grid"
          role="group"
          aria-label="Choose a scenario"
          style={{
            gridTemplateColumns:
              setup.scenarios.length === 1
                ? '1fr'
                : setup.scenarios.length === 2
                ? 'repeat(2, 1fr)'
                : undefined,
          }}
        >
          {setup.scenarios.map((scenario, i) => (
            <button
              key={scenario.id}
              type="button"
              className="scenario-card"
              aria-pressed={selectedId === scenario.id}
              onClick={() => setSelectedId(scenario.id)}
              disabled={isRunning}
            >
              <span
                className="icon-badge"
                style={{ background: BADGE_TINTS[i % BADGE_TINTS.length] }}
              >
                <IconScenario />
              </span>
              <h3>{scenario.title}</h3>
              <p>{scenario.userInput}</p>
              <span className="cost">
                <IconClock />
                Free · ~5 sec
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ── Run bar ────────────────────────────────────────────────────────── */}
      {setup.scenarios.length > 0 && (
        <>
          <div className="credit-bar">
            <div className="left">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: 'var(--good)', flexShrink: 0 }}>
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
              <div>
                <strong>
                  {runsLeft > 0
                    ? `${runsLeft} free test-drive${runsLeft === 1 ? '' : 's'} left today`
                    : 'No free test-drives left today'}
                </strong>
                <br />
                <span className="small" style={{ color: 'var(--ink-soft)' }}>
                  Runs reset at midnight UTC. Each run is short and capped — never open-ended.
                </span>
              </div>
            </div>

            {isRunning ? (
              <button
                type="button"
                className="btn btn-outline btn-lg"
                onClick={handleCancel}
                data-testid="test-drive-cancel-btn"
              >
                <IconStop />
                Stop
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-lg"
                disabled={runDisabled}
                aria-disabled={runDisabled}
                onClick={() => selectedId && runScenario(selectedId)}
                data-testid="test-drive-run-btn"
              >
                Run scenario
                <IconPlay />
              </button>
            )}
          </div>

          {/* Why disabled note — same pattern as export */}
          {!canRun && runDisabledReason && !isRunning && (
            <p
              role="status"
              style={{
                fontSize: '0.88rem',
                color: 'var(--ink-soft)',
                marginTop: '10px',
                fontWeight: 600,
              }}
            >
              {runDisabledReason}
            </p>
          )}
          {canRun && !selectedId && !isRunning && !isDone && !isError && (
            <p
              style={{
                fontSize: '0.88rem',
                color: 'var(--muted)',
                marginTop: '10px',
              }}
            >
              Pick a scenario above to enable the run button.{' '}
              <span style={{ color: 'var(--ink-soft)' }}>
                Test-drives can&apos;t see files you attach — they stay on your device.
              </span>
            </p>
          )}
          {(canRun && selectedId) && !isRunning && !isDone && !isError && (
            <p className="small" style={{ color: 'var(--ink-soft)', marginTop: '10px' }}>
              Test-drives can&apos;t see files you attach — they stay on your device.
            </p>
          )}
        </>
      )}

      {/* ── Running state ──────────────────────────────────────────────────── */}
      {isRunning && (
        <div
          className="loading-row"
          role="status"
          aria-label="Running your scenario"
          style={{ marginTop: '24px' }}
        >
          <span className="spinner" aria-hidden="true" />
          <span>
            Running your scenario
            {selectedScenario ? <> — <em>{selectedScenario.title}</em></> : ''}
            …
          </span>
        </div>
      )}

      {/* ── Streaming output (aria-live region) ────────────────────────────── */}
      {(isRunning || isDone) && currentScenario && (
        <div style={{ marginTop: '24px' }}>
          {isDone && cached && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: 'var(--iris-tint)',
                color: 'var(--iris-deep)',
                padding: '4px 12px',
                borderRadius: '999px',
                marginBottom: '14px',
              }}
            >
              <IconCheck />
              Instant example
            </div>
          )}

          <div className="td-compare">
            {/* Left: streaming / final output */}
            <div className="out-card out-yours">
              <div className="out-head">
                <IconCheck />
                Your output
              </div>
              <div
                className="out-body"
                aria-live="polite"
                aria-label="Streaming output"
                data-testid="test-drive-output"
                style={{ whiteSpace: 'pre-wrap', minHeight: '80px' }}
              >
                {streamText || (isRunning ? (
                  <span className="muted" style={{ fontStyle: 'italic' }}>Generating…</span>
                ) : null)}
              </div>
            </div>

            {/* Right: expected behavior */}
            <div className="out-card out-expected">
              <div className="out-head">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                What a good response looks like
              </div>
              <div
                className="out-body"
                data-testid="test-drive-expected"
              >
                {currentScenario.expectedBehavior}
              </div>
            </div>
          </div>

          {isDone && (
            <div
              className="success-note"
              style={{ marginTop: '16px', marginBottom: '0' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
              Once exported, your setup creates output like this in your own Claude — any time,
              no Armory needed.
            </div>
          )}

          {/* Run another scenario */}
          {isDone && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setPhase('idle');
                  setStreamText('');
                  setCurrentScenarioId(null);
                }}
              >
                Try another scenario
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Error states ───────────────────────────────────────────────────── */}
      {phase === 'error-model' && (
        <div className="error-banner" role="alert" style={{ marginTop: '24px' }} data-testid="test-drive-error">
          <IconAlert />
          <div>
            <strong>Something went wrong running your scenario</strong>
            <p>Your free test-drive wasn&apos;t used. Give it another try.</p>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleRetry}
              data-testid="test-drive-retry-btn"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {phase === 'error-timeout' && (
        <div className="error-banner" role="alert" style={{ marginTop: '24px' }} data-testid="test-drive-error">
          <IconAlert />
          <div>
            <strong>The scenario took too long to run</strong>
            <p>Your free test-drive wasn&apos;t used. Give it another try.</p>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleRetry}
              data-testid="test-drive-retry-btn"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {phase === 'error-quota' && (
        <div
          style={{
            background: 'var(--warn-tint)',
            border: '1px solid rgba(138, 92, 19, 0.25)',
            borderRadius: 'var(--r-md)',
            padding: '18px 20px',
            marginTop: '24px',
            display: 'flex',
            gap: '14px',
            alignItems: 'flex-start',
          }}
          role="alert"
          data-testid="test-drive-quota-error"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: 'var(--warn)', flexShrink: 0, marginTop: '2px' }}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <div style={{ color: 'var(--warn)' }}>
            <strong style={{ display: 'block', marginBottom: '2px' }}>
              You&apos;ve used your free test-drives for today
            </strong>
            <p style={{ margin: '0', fontSize: '0.9rem' }}>
              They reset at midnight UTC
              {quotaResetAt
                ? ` (${new Date(quotaResetAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short' })})`
                : ''}.
              You can still export your setup — a test-drive is optional.
            </p>
          </div>
        </div>
      )}

      {phase === 'error-budget' && (
        <div
          style={{
            background: 'var(--oat)',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--r-md)',
            padding: '18px 20px',
            marginTop: '24px',
            display: 'flex',
            gap: '14px',
            alignItems: 'flex-start',
          }}
          role="alert"
          data-testid="test-drive-budget-error"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: 'var(--ink-soft)', flexShrink: 0, marginTop: '2px' }}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <div style={{ color: 'var(--ink-soft)' }}>
            <strong style={{ display: 'block', marginBottom: '2px', color: 'var(--ink)' }}>
              Test-drives are busy right now
            </strong>
            <p style={{ margin: '0', fontSize: '0.9rem' }}>
              Try again in a little while — this is temporary. Your setup is ready to export
              whenever you are.
            </p>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ marginTop: '10px' }}
              onClick={handleRetry}
              data-testid="test-drive-retry-btn"
            >
              Try again
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
