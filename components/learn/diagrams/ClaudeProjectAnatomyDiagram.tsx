import type { DiagramProps } from './index';

/**
 * claude-project-anatomy — the three layers of a Claude Project.
 * Standing instructions on top, attached knowledge files in the middle, and the
 * project's chats below. Numbered rail on the right. No character art.
 */

const HOTSPOTS = [
  { id: 'project-instructions', label: 'Project instructions', x: 91, y: 25 },
  { id: 'knowledge-files', label: 'Knowledge files', x: 91, y: 54 },
  { id: 'project-chats', label: 'Project chats', x: 91, y: 84 },
] as const;

export default function ClaudeProjectAnatomyDiagram({ activeHotspotId, onHotspotSelect }: DiagramProps) {
  return (
    <div className="hotspot-diagram-wrap">
      <svg
        viewBox="0 0 580 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="A Claude Project stacked in three layers: standing instructions at the top, attached knowledge files in the middle, and the project's chats at the bottom."
      >
        {/* project frame */}
        <rect x="16" y="16" width="548" height="228" rx="16" fill="var(--oat)" stroke="var(--iris)" strokeWidth="1.5" strokeDasharray="6 5" />
        <text x="34" y="12" fontSize="9.5" fontWeight="700" letterSpacing="0.12em" fill="var(--iris-deep)">CLAUDE PROJECT</text>

        {/* project-instructions band */}
        <rect x="30" y="28" width="470" height="52" rx="10" fill="var(--iris-tint)" stroke="var(--iris)" strokeWidth="1.25" />
        <text x="44" y="46" fontSize="9" fontWeight="700" letterSpacing="0.08em" fill="var(--iris-deep)">PROJECT INSTRUCTIONS</text>
        <rect x="44" y="54" width="320" height="7" rx="3.5" fill="var(--iris)" opacity="0.45" />
        <rect x="44" y="66" width="240" height="7" rx="3.5" fill="var(--iris)" opacity="0.3" />

        {/* knowledge-files band */}
        <rect x="30" y="90" width="470" height="66" rx="10" fill="var(--sky)" stroke="var(--accent-sky)" strokeWidth="1.25" />
        <text x="44" y="108" fontSize="9" fontWeight="700" letterSpacing="0.08em" fill="var(--accent-sky)">KNOWLEDGE FILES</text>
        <rect x="44" y="116" width="96" height="30" rx="6" fill="var(--paper)" stroke="var(--hairline)" strokeWidth="1" />
        <rect x="52" y="124" width="12" height="12" rx="2" fill="var(--accent-sky)" opacity="0.5" />
        <rect x="150" y="116" width="96" height="30" rx="6" fill="var(--paper)" stroke="var(--hairline)" strokeWidth="1" />
        <rect x="158" y="124" width="12" height="12" rx="2" fill="var(--accent-sky)" opacity="0.5" />
        <rect x="256" y="116" width="96" height="30" rx="6" fill="var(--paper)" stroke="var(--hairline)" strokeWidth="1" />
        <rect x="264" y="124" width="12" height="12" rx="2" fill="var(--accent-sky)" opacity="0.5" />

        {/* project-chats band */}
        <rect x="30" y="166" width="470" height="66" rx="10" fill="var(--paper)" stroke="var(--hairline-strong)" strokeWidth="1.25" />
        <text x="44" y="184" fontSize="9" fontWeight="700" letterSpacing="0.08em" fill="var(--muted)">PROJECT CHATS</text>
        <rect x="300" y="192" width="188" height="15" rx="7.5" fill="var(--iris-tint)" />
        <rect x="44" y="192" width="150" height="15" rx="7.5" fill="var(--oat)" />
        <rect x="330" y="212" width="158" height="15" rx="7.5" fill="var(--iris-tint)" />
        <rect x="44" y="212" width="130" height="15" rx="7.5" fill="var(--oat)" />
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
