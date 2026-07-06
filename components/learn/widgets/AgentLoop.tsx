'use client';

import { useEffect, useState } from 'react';

/**
 * AgentLoop — teaches the Claude Code agent loop by stepping a highlight
 * around four stations: Your request → Claude decides → Tool runs → Result
 * returns. The example task is finding and fixing a typo — the loop runs
 * twice (read, then edit), teaching that the loop repeats until done.
 *
 * Animation: CSS transitions move the highlight; the auto-run path uses
 * setTimeout but the manual-step path never depends on any timer completing.
 * Under prefers-reduced-motion the CSS transition is 0s (global rule in
 * globals.css), and Run simply jumps to the done state.
 *
 * No props — fully self-contained simulation. No character art.
 */

const STATIONS = [
  { id: 'your-request',   label: 'Your request'    },
  { id: 'claude-decides', label: 'Claude decides'  },
  { id: 'tool-runs',      label: 'Tool runs'       },
  { id: 'result-returns', label: 'Result returns'  },
] as const;

/** Each hop: which station is active + one-sentence narration. */
const HOPS = [
  {
    station: 0,
    narration: 'You ask: "Find and fix the typo in README.md."',
  },
  {
    station: 1,
    narration:
      'Claude decides to read the file first — it cannot edit what it has not seen.',
  },
  {
    station: 2,
    narration: 'The read tool fetches README.md.',
  },
  {
    station: 3,
    narration: 'The file content returns. Claude spots the typo.',
  },
  {
    station: 1,
    narration:
      'Claude decides to edit the file — it knows exactly where the typo is.',
  },
  {
    station: 2,
    narration: 'The edit tool rewrites the typo in README.md.',
  },
  {
    station: 3,
    narration: 'The edit succeeded. Claude reports back: "Fixed!"',
  },
] as const;

const LAST_HOP = HOPS.length - 1;
const RUN_INTERVAL_MS = 700;

export default function AgentLoop() {
  const [hopIndex, setHopIndex] = useState(0);
  const [autoRunning, setAutoRunning] = useState(false);

  const isDone = hopIndex === LAST_HOP;
  const currentHop = HOPS[hopIndex];
  const activeStation = currentHop.station;

  /* Auto-run: advance one hop per tick. Uses setTimeout so each hop is an
   * independent render that updates the narration. Cleanup on unmount or when
   * running stops. The manual-step path never depends on this timer. */
  useEffect(() => {
    if (!autoRunning) return;
    if (hopIndex >= LAST_HOP) {
      setAutoRunning(false);
      return;
    }
    const timer = setTimeout(() => {
      setHopIndex((i) => i + 1);
    }, RUN_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [autoRunning, hopIndex]);

  function handleRun() {
    if (isDone) {
      setHopIndex(0);
      return;
    }
    // Under prefers-reduced-motion, skip directly to done; otherwise auto-play.
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setHopIndex(LAST_HOP);
    } else {
      setAutoRunning(true);
    }
  }

  function handleStep() {
    if (hopIndex < LAST_HOP) setHopIndex((i) => i + 1);
  }

  function handleRestart() {
    setHopIndex(0);
    setAutoRunning(false);
  }

  /* Loop counter: hop 0 is the initial request; hops 1-3 are loop 1 (read);
   * hops 4-6 are loop 2 (edit). Show "Loop N of 2" when past the request. */
  const loopNumber = hopIndex === 0 ? null : hopIndex <= 3 ? 1 : 2;

  return (
    <section className="lblock wgt-agent-loop" aria-labelledby="al-heading">
      <h2 id="al-heading">The agent loop</h2>
      <p>
        Claude Code doesn't just reply — it loops: decide what to do, run a
        tool, observe the result, then decide again. The loop repeats until the
        task is done.
      </p>

      {/* Circular station diagram — pure CSS/SVG, no character art */}
      <div className="al-diagram" aria-hidden="true">
        <svg
          viewBox="0 0 240 240"
          xmlns="http://www.w3.org/2000/svg"
          className="al-diagram-svg"
          aria-hidden="true"
        >
          {/* Circular connecting path */}
          <circle
            cx="120" cy="120" r="72"
            fill="none"
            stroke="var(--hairline-strong)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          {/* Arrowheads at each cardinal point */}
          <defs>
            <marker id="al-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill="var(--muted)" />
            </marker>
          </defs>
          {/* Arrow arcs between stations (clockwise) */}
          <path
            d="M 156 62 A 72 72 0 0 1 180 120"
            fill="none" stroke="var(--muted)" strokeWidth="1.5"
            markerEnd="url(#al-arrow)"
          />
          <path
            d="M 180 138 A 72 72 0 0 1 138 186"
            fill="none" stroke="var(--muted)" strokeWidth="1.5"
            markerEnd="url(#al-arrow)"
          />
          <path
            d="M 102 186 A 72 72 0 0 1 60 138"
            fill="none" stroke="var(--muted)" strokeWidth="1.5"
            markerEnd="url(#al-arrow)"
          />
          <path
            d="M 60 102 A 72 72 0 0 1 102 54"
            fill="none" stroke="var(--muted)" strokeWidth="1.5"
            markerEnd="url(#al-arrow)"
          />

          {/* Station 0 — top (Your request) */}
          <rect
            x="78" y="24" width="84" height="36" rx="8"
            className={`al-station-node${activeStation === 0 ? ' al-station-active' : ''}`}
          />
          <text x="120" y="46" className="al-station-text" aria-hidden="true">Your request</text>

          {/* Station 1 — right (Claude decides) */}
          <rect
            x="168" y="102" width="60" height="36" rx="8"
            className={`al-station-node${activeStation === 1 ? ' al-station-active' : ''}`}
          />
          <text x="198" y="118" className="al-station-text" aria-hidden="true">Claude</text>
          <text x="198" y="131" className="al-station-text" aria-hidden="true">decides</text>

          {/* Station 2 — bottom (Tool runs) */}
          <rect
            x="78" y="180" width="84" height="36" rx="8"
            className={`al-station-node${activeStation === 2 ? ' al-station-active' : ''}`}
          />
          <text x="120" y="202" className="al-station-text" aria-hidden="true">Tool runs</text>

          {/* Station 3 — left (Result returns) */}
          <rect
            x="12" y="102" width="60" height="36" rx="8"
            className={`al-station-node${activeStation === 3 ? ' al-station-active' : ''}`}
          />
          <text x="42" y="118" className="al-station-text" aria-hidden="true">Result</text>
          <text x="42" y="131" className="al-station-text" aria-hidden="true">returns</text>
        </svg>
      </div>

      {/* Loop counter */}
      {loopNumber && (
        <p className="al-loop-badge" aria-hidden="true">
          Loop {loopNumber} of 2
        </p>
      )}

      {/* Narration — aria-live so screen readers announce each hop */}
      <p
        className="al-narration"
        aria-live="polite"
        aria-atomic="true"
      >
        {currentHop.narration}
      </p>

      {/* Controls */}
      <div className="al-controls">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleRun}
          disabled={autoRunning}
          aria-label={isDone ? 'Restart loop from the beginning' : 'Run the loop automatically'}
        >
          {isDone ? 'Restart' : 'Run'}
        </button>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={handleStep}
          disabled={isDone || autoRunning}
          aria-label="Step manually — advance one hop"
        >
          Step
        </button>
        {isDone && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={handleRestart}
          >
            Reset
          </button>
        )}
      </div>
    </section>
  );
}
