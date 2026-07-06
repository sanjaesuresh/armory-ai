import type { DiagramProps } from './index';

/**
 * chatgpt-project-anatomy — what a ChatGPT Project holds, and what sits outside it.
 * A project frame containing instructions, files and chats; a separate plain chat
 * on the right shows what a non-project conversation looks like. No character art.
 */

const HOTSPOTS = [
  { id: 'project-instructions', label: 'Project instructions', x: 40, y: 22 },
  { id: 'project-files', label: 'Project files', x: 22, y: 68 },
  { id: 'chats', label: 'Chats', x: 55, y: 68 },
  { id: 'outside-chat', label: 'Chat outside the project', x: 90, y: 30 },
] as const;

export default function ChatGptProjectAnatomyDiagram({ activeHotspotId, onHotspotSelect }: DiagramProps) {
  return (
    <div className="hotspot-diagram-wrap">
      <svg
        viewBox="0 0 580 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="A ChatGPT project frame holding shared instructions, uploaded files and its chats, beside a separate plain chat that sits outside any project."
      >
        {/* project frame */}
        <rect x="16" y="18" width="400" height="226" rx="16" fill="var(--oat)" stroke="var(--iris)" strokeWidth="1.5" strokeDasharray="6 5" />
        <text x="34" y="14" fontSize="9.5" fontWeight="700" letterSpacing="0.12em" fill="var(--iris-deep)">PROJECT</text>

        {/* project-instructions band */}
        <rect x="30" y="30" width="372" height="48" rx="10" fill="var(--iris-tint)" stroke="var(--iris)" strokeWidth="1.25" />
        <text x="44" y="47" fontSize="9" fontWeight="700" letterSpacing="0.08em" fill="var(--iris-deep)">CUSTOM INSTRUCTIONS</text>
        <rect x="44" y="54" width="240" height="6.5" rx="3.25" fill="var(--iris)" opacity="0.45" />
        <rect x="44" y="65" width="180" height="6.5" rx="3.25" fill="var(--iris)" opacity="0.3" />

        {/* project-files */}
        <rect x="30" y="92" width="176" height="140" rx="11" fill="var(--sky)" stroke="var(--accent-sky)" strokeWidth="1.25" />
        <text x="44" y="110" fontSize="9" fontWeight="700" letterSpacing="0.08em" fill="var(--accent-sky)">FILES</text>
        <rect x="44" y="120" width="148" height="26" rx="6" fill="var(--paper)" stroke="var(--hairline)" strokeWidth="1" />
        <rect x="52" y="128" width="12" height="10" rx="2" fill="var(--accent-sky)" opacity="0.5" />
        <rect x="72" y="130" width="96" height="6" rx="3" fill="var(--muted)" opacity="0.4" />
        <rect x="44" y="152" width="148" height="26" rx="6" fill="var(--paper)" stroke="var(--hairline)" strokeWidth="1" />
        <rect x="52" y="160" width="12" height="10" rx="2" fill="var(--accent-sky)" opacity="0.5" />
        <rect x="72" y="162" width="80" height="6" rx="3" fill="var(--muted)" opacity="0.4" />

        {/* chats */}
        <rect x="216" y="92" width="186" height="140" rx="11" fill="var(--paper)" stroke="var(--hairline-strong)" strokeWidth="1.25" />
        <text x="230" y="110" fontSize="9" fontWeight="700" letterSpacing="0.08em" fill="var(--muted)">CHATS</text>
        <rect x="272" y="120" width="118" height="16" rx="8" fill="var(--iris-tint)" />
        <rect x="230" y="144" width="140" height="16" rx="8" fill="var(--oat)" />
        <rect x="288" y="168" width="102" height="16" rx="8" fill="var(--iris-tint)" />
        <rect x="230" y="192" width="128" height="16" rx="8" fill="var(--oat)" />

        {/* outside-chat — separate plain conversation */}
        <rect x="440" y="66" width="124" height="128" rx="12" fill="var(--oat-deep)" stroke="var(--hairline-strong)" strokeWidth="1.25" />
        <text x="454" y="58" fontSize="9" fontWeight="700" letterSpacing="0.08em" fill="var(--muted)">PLAIN CHAT</text>
        <rect x="470" y="82" width="80" height="15" rx="7.5" fill="var(--paper)" stroke="var(--hairline)" strokeWidth="1" />
        <rect x="454" y="106" width="94" height="15" rx="7.5" fill="var(--paper)" stroke="var(--hairline)" strokeWidth="1" />
        <rect x="470" y="130" width="80" height="15" rx="7.5" fill="var(--paper)" stroke="var(--hairline)" strokeWidth="1" />
        <text x="502" y="176" textAnchor="middle" fontSize="8.5" fontStyle="italic" fill="var(--muted)">no shared setup</text>
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
