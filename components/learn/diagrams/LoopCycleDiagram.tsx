import type { DiagramProps } from './index';

/**
 * loop-cycle, the agent loop as a five-stage cycle: decide, act, observe,
 * verify, iterate. Nodes sit at pentagon points around a 580x260 viewBox with
 * curved arrows carrying the cycle clockwise back to the start. "Verify" is
 * the engineering lever, so it renders larger and in the accent green, the
 * only stage that visually breaks the pattern.
 */

// badges sit at each node's top-right corner (as a % of the 580x260 viewBox)
// so the numbered sticker never covers the centered label text inside the node.
const HOTSPOTS = [
  { id: 'decide', label: 'Decide', x: 33, y: 12 },
  { id: 'act', label: 'Act', x: 71.5, y: 32 },
  { id: 'observe', label: 'Observe', x: 62, y: 76 },
  // upper-right of the (larger) verify circle, in open space, so it clears the label + sub-caption
  { id: 'verify', label: 'Verify', x: 34, y: 71 },
  { id: 'iterate', label: 'Iterate', x: 6.5, y: 32 },
] as const;

export default function LoopCycleDiagram({ activeHotspotId, onHotspotSelect }: DiagramProps) {
  return (
    <div className="hotspot-diagram-wrap">
      <svg
        viewBox="0 0 580 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="The agent loop as a cycle: decide, act, observe, verify, iterate, feeding back into decide. Verify is highlighted as the engineering lever."
      >
        <defs>
          <marker id="lc-arrow" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill="var(--hairline-strong)" />
          </marker>
          <marker id="lc-arrow-verify" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill="var(--iris)" />
          </marker>
        </defs>

        {/* cycle arrows, clockwise: decide -> act -> observe -> verify -> iterate -> decide */}
        <g fill="none" strokeWidth="1.75">
          <path d="M330 60 A150 92 0 0 1 448 108" stroke="var(--hairline-strong)" markerEnd="url(#lc-arrow)" />
          <path d="M462 148 A150 92 0 0 1 388 205" stroke="var(--hairline-strong)" markerEnd="url(#lc-arrow)" />
          {/* observe -> verify: leads into the lever, drawn in the accent to foreshadow it */}
          <path d="M348 222 A150 92 0 0 1 232 222" stroke="var(--iris)" markerEnd="url(#lc-arrow-verify)" />
          <path d="M132 205 A150 92 0 0 1 118 148" stroke="var(--hairline-strong)" markerEnd="url(#lc-arrow)" />
          <path d="M132 108 A150 92 0 0 1 250 60" stroke="var(--hairline-strong)" markerEnd="url(#lc-arrow)" />
        </g>

        {/* decide, top */}
        <circle cx="290" cy="53" r="40" fill="var(--sky)" stroke="var(--accent-sky)" strokeWidth="1.25" />
        <text x="290" y="49" textAnchor="middle" fontSize="9.5" fontWeight="800" letterSpacing="0.06em" fill="var(--accent-sky)">DECIDE</text>
        <text x="290" y="62" textAnchor="middle" fontSize="7.5" fill="var(--ink-soft)">model picks next move</text>

        {/* act, upper right */}
        <circle cx="490" cy="117" r="40" fill="var(--butter)" stroke="var(--accent-butter)" strokeWidth="1.25" />
        <text x="490" y="113" textAnchor="middle" fontSize="9.5" fontWeight="800" letterSpacing="0.06em" fill="var(--accent-butter)">ACT</text>
        <text x="490" y="126" textAnchor="middle" fontSize="7.5" fill="var(--ink-soft)">runs a tool</text>

        {/* observe, lower right */}
        <circle cx="413" cy="219" r="40" fill="var(--mint)" stroke="var(--accent-mint)" strokeWidth="1.25" />
        <text x="413" y="215" textAnchor="middle" fontSize="9.5" fontWeight="800" letterSpacing="0.06em" fill="var(--accent-mint)">OBSERVE</text>
        <text x="413" y="228" textAnchor="middle" fontSize="7.5" fill="var(--ink-soft)">reads the result</text>

        {/* verify, lower left, the engineering lever: bigger radius, filled in the accent green */}
        <circle cx="167" cy="219" r="46" fill="var(--iris-tint)" stroke="var(--iris)" strokeWidth="2.5" />
        <text x="167" y="213" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="0.06em" fill="var(--iris)">VERIFY</text>
        <text x="167" y="227" textAnchor="middle" fontSize="7.5" fill="var(--ink-soft)">the lever you engineer</text>

        {/* iterate, upper left */}
        <circle cx="90" cy="117" r="40" fill="var(--iris-tint)" stroke="var(--iris-deep)" strokeWidth="1.25" opacity="0.75" />
        <text x="90" y="113" textAnchor="middle" fontSize="9.5" fontWeight="800" letterSpacing="0.06em" fill="var(--iris-deep)">ITERATE</text>
        <text x="90" y="126" textAnchor="middle" fontSize="7.5" fill="var(--ink-soft)">loop again, or stop</text>
      </svg>

      <div className="hotspot-btn-layer">
        {HOTSPOTS.map((h, i) => {
          const active = activeHotspotId === h.id;
          return (
            <button
              key={h.id}
              type="button"
              className="hotspot-btn"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              data-hotspot-id={h.id}
              aria-pressed={active}
              aria-expanded={active}
              aria-label={`${h.label}, ${active ? 'hide' : 'show'} explanation`}
              onClick={() => onHotspotSelect(h.id)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
