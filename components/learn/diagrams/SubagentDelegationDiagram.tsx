import type { DiagramProps } from './index';

/**
 * subagent-delegation — how a main agent hands work to a subagent.
 * The main agent hands off a task; the subagent works in its own fresh context
 * and returns a compact summary. Two-arrow loop. No character art.
 */

const HOTSPOTS = [
  { id: 'main-agent', label: 'Main agent', x: 15, y: 50 },
  { id: 'task-handoff', label: 'Task handoff', x: 50, y: 21 },
  { id: 'subagent-context', label: 'Subagent context', x: 85, y: 50 },
  { id: 'returned-summary', label: 'Returned summary', x: 50, y: 82 },
] as const;

export default function SubagentDelegationDiagram({ activeHotspotId, onHotspotSelect }: DiagramProps) {
  return (
    <div className="hotspot-diagram-wrap">
      <svg
        viewBox="0 0 580 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="A main agent hands a task to a subagent that works in its own fresh context, then returns a compact summary — an outbound task arrow above and a return arrow below."
      >
        <defs>
          <marker id="sd-arrow" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill="var(--iris)" />
          </marker>
          <marker id="sd-arrow-back" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill="var(--good)" />
          </marker>
        </defs>

        {/* task-handoff arrow (top, main → subagent) */}
        <path d="M150 96 C 250 44, 330 44, 430 96" stroke="var(--iris)" strokeWidth="2.5" markerEnd="url(#sd-arrow)" />
        {/* returned-summary arrow (bottom, subagent → main) */}
        <path d="M430 164 C 330 216, 250 216, 150 164" stroke="var(--good)" strokeWidth="2.5" markerEnd="url(#sd-arrow-back)" />

        {/* main-agent */}
        <rect x="26" y="90" width="130" height="80" rx="14" fill="var(--iris)" />
        <rect x="44" y="108" width="86" height="8" rx="4" fill="var(--paper)" opacity="0.85" />
        <rect x="44" y="124" width="64" height="8" rx="4" fill="var(--paper)" opacity="0.5" />
        <text x="91" y="156" textAnchor="middle" fontSize="10" fontWeight="800" letterSpacing="0.08em" fill="var(--paper)">MAIN AGENT</text>

        {/* subagent-context */}
        <rect x="424" y="90" width="130" height="80" rx="14" fill="var(--lilac)" stroke="var(--iris)" strokeWidth="1.5" strokeDasharray="5 4" />
        <rect x="442" y="108" width="86" height="8" rx="4" fill="var(--iris)" opacity="0.5" />
        <rect x="442" y="124" width="64" height="8" rx="4" fill="var(--iris)" opacity="0.32" />
        <text x="489" y="156" textAnchor="middle" fontSize="9.5" fontWeight="800" letterSpacing="0.05em" fill="var(--iris-deep)">SUBAGENT</text>

        {/* labels on the arrows */}
        <text x="290" y="58" textAnchor="middle" fontSize="9" fontWeight="700" letterSpacing="0.06em" fill="var(--iris-deep)">TASK →</text>
        <text x="290" y="212" textAnchor="middle" fontSize="9" fontWeight="700" letterSpacing="0.06em" fill="var(--good)">← SUMMARY</text>
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
              aria-label={`${h.label} — ${active ? 'hide' : 'show'} explanation`}
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
