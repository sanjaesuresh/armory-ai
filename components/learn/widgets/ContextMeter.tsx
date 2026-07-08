'use client';

import { useRef, useState } from 'react';

/**
 * ContextMeter — teaches "context window" by letting the learner add segments
 * (instructions, messages, a big file) to a visual bar. When additions would
 * overflow 100%, the oldest droppable (message) segments are removed first with
 * a one-line explanation. All animation is CSS-transition-driven; changes are
 * instant under prefers-reduced-motion (handled in globals.css).
 *
 * No props — fully self-contained simulation.
 */

interface Segment {
  id: number;
  label: string;
  pct: number;
  color: string;
  size: string;
  droppable: boolean;
}

/** Segment definitions. pct chosen so that instr(10)+3×msg(15)+file(70)=125 → overflow. */
const DEFS = {
  instructions: { label: 'System instructions', pct: 10, color: 'var(--accent-lilac)', size: '~800 tokens',    droppable: false },
  message:      { label: 'A message',            pct: 15, color: 'var(--accent-sky)',   size: '~1,200 tokens', droppable: true  },
  file:         { label: 'A big file',           pct: 70, color: 'var(--accent-peach)', size: '~56,000 tokens', droppable: false },
} as const;

type ItemKind = keyof typeof DEFS;

function total(segs: Segment[]): number {
  return segs.reduce((s, seg) => s + seg.pct, 0);
}

/** Drop oldest droppable segments until sum ≤ 100 or none remain. Returns count dropped. */
function dropOldest(segs: Segment[]): { updated: Segment[]; dropped: number } {
  const list = [...segs];
  let dropped = 0;
  while (total(list) > 100) {
    const idx = list.findIndex((s) => s.droppable);
    if (idx === -1) break;
    list.splice(idx, 1);
    dropped++;
  }
  return { updated: list, dropped };
}

export default function ContextMeter() {
  const idRef = useRef(0);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [droppedCount, setDroppedCount] = useState(0);
  const [instrAdded, setInstrAdded] = useState(false);

  const sum = total(segments);
  const barPct = Math.min(sum, 100);
  const isOver = sum > 100;

  function handleAdd(kind: ItemKind) {
    if (kind === 'instructions' && instrAdded) return;
    const def = DEFS[kind];
    const newSeg: Segment = { id: idRef.current++, ...def };
    const next = [...segments, newSeg];
    if (total(next) > 100) {
      const { updated, dropped } = dropOldest(next);
      setSegments(updated);
      if (dropped > 0) setDroppedCount((c) => c + dropped);
    } else {
      setSegments(next);
    }
    if (kind === 'instructions') setInstrAdded(true);
  }

  function handleReset() {
    setSegments([]);
    setDroppedCount(0);
    setInstrAdded(false);
  }

  return (
    <section className="lblock wgt-context-meter" aria-labelledby="cm-heading">
      <h2 id="cm-heading">Fill the context window</h2>
      <p>
        Add items below and watch the window fill. When it overflows, the oldest
        messages are dropped, the model no longer sees them.
      </p>

      {/* Bar */}
      <div
        role="meter"
        aria-label="Context window usage"
        aria-valuenow={barPct}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`cm-bar-wrap${isOver ? ' cm-bar-over' : ''}`}
      >
        <div
          className={`cm-bar-fill${isOver ? ' cm-overflow' : ''}`}
          style={{ width: `${barPct}%` }}
        />
        <span className="cm-bar-pct" aria-hidden="true">
          {barPct}% full
        </span>
      </div>

      {/* Overflow explanation — aria role="alert" so screen readers announce it.
          Shown when drops occurred OR when the window is over capacity with nothing to drop. */}
      {(droppedCount > 0 || isOver) && (
        <div className="cm-overflow-msg" role="alert">
          {droppedCount > 0 ? (
            <>
              <strong>
                {droppedCount === 1
                  ? 'Your oldest message was dropped.'
                  : `Your ${droppedCount} oldest messages were dropped.`}
              </strong>{' '}
              Claude can no longer see them, they fell off the context window to make room.
            </>
          ) : (
            <strong>
              The context window is full, the newest content doesn&apos;t fully fit.
            </strong>
          )}
        </div>
      )}

      {/* Segment list */}
      {segments.length > 0 && (
        <ul
          className="cm-items-list"
          aria-label="Items in context window"
          aria-live="polite"
          aria-relevant="additions removals"
        >
          {segments.map((seg) => (
            <li className="cm-item" key={seg.id}>
              <span className="cm-swatch" style={{ background: seg.color }} aria-hidden="true" />
              <span>{seg.label}</span>
              <span className="cm-size-label">{seg.size}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Controls */}
      <div className="cm-add-row">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => handleAdd('instructions')}
          disabled={instrAdded}
          aria-disabled={instrAdded}
        >
          Add instructions
        </button>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => handleAdd('message')}
        >
          Add a message
        </button>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => handleAdd('file')}
        >
          Add a big file
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={handleReset}>
          Reset
        </button>
      </div>
    </section>
  );
}
