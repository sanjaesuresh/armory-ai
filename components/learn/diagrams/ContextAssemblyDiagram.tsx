import type { DiagramProps } from './index';

/**
 * context-assembly — how the context window gets assembled each turn.
 * Four source boxes (instructions, files, history, retrieval) feed spokes into
 * a central "context window" box, the convergence point the model actually reads.
 * Paper-craft flat style, no character art.
 */

// badges sit at each box's top-right corner (as a % of the 580x260 viewBox) so
// the numbered sticker never covers the centered label text inside the box.
const HOTSPOTS = [
  { id: 'instructions', label: 'Instructions', x: 26, y: 10 },
  { id: 'files', label: 'Files', x: 56, y: 10 },
  { id: 'history', label: 'History', x: 92.5, y: 22 },
  { id: 'retrieval', label: 'Retrieval', x: 92.5, y: 68 },
  { id: 'window', label: 'Context window', x: 55, y: 89 },
] as const;

export default function ContextAssemblyDiagram({ activeHotspotId, onHotspotSelect }: DiagramProps) {
  return (
    <div className="hotspot-diagram-wrap">
      <svg
        viewBox="0 0 580 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Four sources, instructions, files, conversation history, and retrieved passages, feed into a central context window that the model actually reads."
      >
        {/* spokes into the window */}
        <g stroke="var(--hairline-strong)" strokeWidth="1.75">
          <path d="M120 78 L246 176" />
          <path d="M310 80 L300 176" />
          <path d="M470 92 L354 178" />
          <path d="M470 168 L354 196" />
        </g>

        {/* instructions */}
        <rect x="30" y="26" width="150" height="52" rx="11" fill="var(--iris-tint)" stroke="var(--iris)" strokeWidth="1.25" />
        <rect x="46" y="42" width="80" height="7" rx="3.5" fill="var(--iris)" opacity="0.5" />
        <rect x="46" y="54" width="56" height="7" rx="3.5" fill="var(--iris)" opacity="0.35" />
        <text x="105" y="18" textAnchor="middle" fontSize="9" fontWeight="800" letterSpacing="0.05em" fill="var(--iris-deep)">INSTRUCTIONS</text>

        {/* files */}
        <rect x="216" y="26" width="150" height="52" rx="11" fill="var(--sky)" stroke="var(--accent-sky)" strokeWidth="1.25" />
        <rect x="232" y="42" width="24" height="30" rx="3" fill="var(--paper)" stroke="var(--accent-sky)" strokeWidth="1" />
        <rect x="262" y="42" width="24" height="30" rx="3" fill="var(--paper)" stroke="var(--accent-sky)" strokeWidth="1" opacity="0.8" />
        <text x="291" y="18" textAnchor="middle" fontSize="9" fontWeight="800" letterSpacing="0.05em" fill="var(--accent-sky)">FILES</text>

        {/* history */}
        <rect x="402" y="40" width="148" height="52" rx="11" fill="var(--butter)" stroke="var(--accent-butter)" strokeWidth="1.25" />
        <rect x="418" y="56" width="60" height="7" rx="3.5" fill="var(--accent-butter)" opacity="0.55" />
        <rect x="484" y="56" width="50" height="7" rx="3.5" fill="var(--accent-butter)" opacity="0.35" />
        <rect x="418" y="68" width="90" height="7" rx="3.5" fill="var(--accent-butter)" opacity="0.4" />
        <text x="476" y="32" textAnchor="middle" fontSize="9" fontWeight="800" letterSpacing="0.05em" fill="var(--accent-butter)">HISTORY</text>

        {/* retrieval */}
        <rect x="402" y="120" width="148" height="52" rx="11" fill="var(--mint)" stroke="var(--good)" strokeWidth="1.25" />
        <circle cx="428" cy="146" r="10" fill="none" stroke="var(--good)" strokeWidth="1.75" />
        <path d="M435 153 L444 162" stroke="var(--good)" strokeWidth="1.75" strokeLinecap="round" />
        <text x="486" y="150" textAnchor="middle" fontSize="9" fontWeight="800" letterSpacing="0.04em" fill="var(--good)">RETRIEVAL</text>

        {/* context window — convergence point */}
        <rect x="185" y="176" width="210" height="60" rx="12" fill="var(--iris-tint)" stroke="var(--iris)" strokeWidth="2" />
        <text x="290" y="203" textAnchor="middle" fontSize="10.5" fontWeight="800" letterSpacing="0.04em" fill="var(--iris-deep)">CONTEXT WINDOW</text>
        <text x="290" y="219" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="var(--ink-soft)">what the model actually reads</text>
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
