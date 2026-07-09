import type { DiagramProps } from './index';

/**
 * prompt-anatomy: a single prompt broken into its five parts, stacked as
 * segments inside one card. Paper-craft collage, no character art.
 */

// badges sit at each segment's top-right corner (as a % of the 580x260 viewBox)
// so the numbered sticker never covers the centered label/sample text inside it.
const HOTSPOTS = [
  { id: 'role', label: 'Role', x: 93, y: 6 },
  { id: 'task', label: 'Task', x: 93, y: 24.5 },
  { id: 'constraints', label: 'Constraints', x: 93, y: 47 },
  { id: 'format', label: 'Format', x: 93, y: 69.5 },
  { id: 'examples', label: 'Examples', x: 93, y: 88.5 },
] as const;

export default function PromptAnatomyDiagram({ activeHotspotId, onHotspotSelect }: DiagramProps) {
  return (
    <div className="hotspot-diagram-wrap">
      <svg
        viewBox="0 0 580 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="A single prompt broken into five stacked parts: role, task, constraints, format, and examples."
      >
        {/* outer prompt card */}
        <rect x="24" y="10" width="500" height="240" rx="14" fill="var(--paper)" stroke="var(--hairline-strong)" strokeWidth="1.5" />

        {/* role */}
        <rect x="40" y="24" width="468" height="34" rx="8" fill="var(--iris)" />
        <text x="58" y="46" fontSize="9.5" fontWeight="800" letterSpacing="0.06em" fill="var(--paper)">ROLE</text>
        <text x="112" y="46" fontSize="10.5" fill="var(--paper)" opacity="0.92">&quot;You are a senior copy editor&quot;</text>

        {/* task */}
        <rect x="40" y="66" width="468" height="34" rx="8" fill="var(--sky)" stroke="var(--accent-sky)" strokeWidth="1.25" />
        <text x="58" y="88" fontSize="9.5" fontWeight="800" letterSpacing="0.06em" fill="var(--accent-sky)">TASK</text>
        <text x="112" y="88" fontSize="10.5" fill="var(--ink)" opacity="0.85">&quot;Rewrite this paragraph&quot;</text>

        {/* constraints */}
        <rect x="40" y="108" width="468" height="34" rx="8" fill="var(--butter)" stroke="var(--accent-butter)" strokeWidth="1.25" />
        <text x="58" y="130" fontSize="9.5" fontWeight="800" letterSpacing="0.04em" fill="var(--accent-butter)">CONSTRAINTS</text>
        <text x="196" y="130" fontSize="10.5" fill="var(--ink)" opacity="0.85">&quot;Under 100 words, keep the meaning&quot;</text>

        {/* format */}
        <rect x="40" y="150" width="468" height="34" rx="8" fill="var(--lilac)" stroke="var(--accent-lilac)" strokeWidth="1.25" />
        <text x="58" y="172" fontSize="9.5" fontWeight="800" letterSpacing="0.06em" fill="var(--accent-lilac)">FORMAT</text>
        <text x="132" y="172" fontSize="10.5" fill="var(--ink)" opacity="0.85">&quot;Return a bulleted list&quot;</text>

        {/* examples */}
        <rect x="40" y="192" width="468" height="42" rx="8" fill="var(--mint)" stroke="var(--good)" strokeWidth="1.25" />
        <text x="58" y="211" fontSize="9.5" fontWeight="800" letterSpacing="0.04em" fill="var(--good)">EXAMPLES</text>
        <text x="58" y="226" fontSize="9.5" fill="var(--ink)" opacity="0.75">&quot;Like this: &apos;Sharp, direct, no filler.&apos;&quot;</text>
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
