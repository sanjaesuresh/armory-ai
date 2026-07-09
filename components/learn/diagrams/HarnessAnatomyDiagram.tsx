import type { DiagramProps } from './index';

/**
 * harness-anatomy — the parts that make up an agentic coding harness.
 * A model, its tools, permissions, a CLAUDE.md and hooks all feed the central
 * agent loop. Paper-craft collage, no character art.
 */

// badges sit at each box's top-right corner (as a % of the 580x260 viewBox) so
// the numbered sticker never covers the centered label text inside the box.
const HOTSPOTS = [
  { id: 'model', label: 'Model', x: 29, y: 13 },
  { id: 'tools', label: 'Tools', x: 61.5, y: 10 },
  { id: 'permissions', label: 'Permissions', x: 92.5, y: 13 },
  { id: 'claude-md', label: 'CLAUDE.md', x: 26.5, y: 68 },
  { id: 'hooks', label: 'Hooks', x: 92.5, y: 68 },
  { id: 'loop', label: 'The loop', x: 55, y: 46 },
] as const;

export default function HarnessAnatomyDiagram({ activeHotspotId, onHotspotSelect }: DiagramProps) {
  return (
    <div className="hotspot-diagram-wrap">
      <svg
        viewBox="0 0 580 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="An agentic coding harness: a model, its tools, permissions, a CLAUDE.md and hooks all connect into a central agent loop."
      >
        {/* spokes into the loop */}
        <g stroke="var(--hairline-strong)" strokeWidth="1.75">
          <path d="M120 74 L246 138" />
          <path d="M290 66 V118" />
          <path d="M460 74 L334 138" />
          <path d="M120 186 L246 150" />
          <path d="M460 186 L334 150" />
        </g>

        {/* model */}
        <rect x="40" y="34" width="132" height="52" rx="11" fill="var(--iris)" />
        <text x="106" y="65" textAnchor="middle" fontSize="10" fontWeight="800" letterSpacing="0.08em" fill="var(--paper)">MODEL</text>

        {/* tools */}
        <rect x="222" y="26" width="136" height="52" rx="11" fill="var(--sky)" stroke="var(--accent-sky)" strokeWidth="1.25" />
        <rect x="238" y="44" width="20" height="16" rx="3" fill="var(--accent-sky)" opacity="0.5" />
        <rect x="264" y="44" width="20" height="16" rx="3" fill="var(--accent-sky)" opacity="0.35" />
        <text x="316" y="57" textAnchor="middle" fontSize="10" fontWeight="800" letterSpacing="0.06em" fill="var(--accent-sky)">TOOLS</text>

        {/* permissions */}
        <rect x="408" y="34" width="132" height="52" rx="11" fill="var(--butter)" stroke="var(--accent-butter)" strokeWidth="1.25" />
        <path d="M430 62 v-8 a8 8 0 0 1 16 0 v8 Z" fill="none" stroke="var(--accent-butter)" strokeWidth="1.75" />
        <rect x="428" y="60" width="20" height="14" rx="3" fill="var(--accent-butter)" opacity="0.55" />
        <text x="490" y="65" textAnchor="middle" fontSize="9.5" fontWeight="800" letterSpacing="0.04em" fill="var(--accent-butter)">PERMS</text>

        {/* claude-md */}
        <path d="M46 176 h96 l14 14 v34 a4 4 0 0 1 -4 4 h-106 a4 4 0 0 1 -4 -4 v-44 a4 4 0 0 1 4 -4 Z" fill="var(--paper)" stroke="var(--hairline-strong)" strokeWidth="1.5" />
        <path d="M142 176 v14 h14" fill="none" stroke="var(--hairline-strong)" strokeWidth="1.5" />
        <text x="98" y="212" textAnchor="middle" fontSize="9.5" fontWeight="800" letterSpacing="0.02em" fill="var(--ink-soft)">CLAUDE.md</text>

        {/* hooks */}
        <rect x="408" y="176" width="132" height="52" rx="11" fill="var(--mint)" stroke="var(--good)" strokeWidth="1.25" />
        <path d="M430 190 v18 a8 8 0 0 0 16 0" fill="none" stroke="var(--good)" strokeWidth="1.75" />
        <text x="490" y="208" textAnchor="middle" fontSize="10" fontWeight="800" letterSpacing="0.06em" fill="var(--good)">HOOKS</text>

        {/* loop — central ring */}
        <circle cx="290" cy="150" r="42" fill="var(--iris-tint)" stroke="var(--iris)" strokeWidth="1.75" />
        <path d="M290 122 A28 28 0 1 1 264 138" fill="none" stroke="var(--iris)" strokeWidth="3" strokeLinecap="round" markerEnd="url(#ha-loop)" />
        <defs>
          <marker id="ha-loop" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill="var(--iris)" />
          </marker>
        </defs>
        <text x="290" y="154" textAnchor="middle" fontSize="9.5" fontWeight="800" letterSpacing="0.06em" fill="var(--iris-deep)">LOOP</text>
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
