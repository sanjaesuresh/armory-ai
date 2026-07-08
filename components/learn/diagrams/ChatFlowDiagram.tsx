import type { DiagramProps } from './index';

/**
 * chat-flow — how one chat turn moves through the model.
 * Left → right pipeline: your message + the running history feed the model,
 * which produces a response. Paper-craft collage, no character art.
 */

const HOTSPOTS = [
  { id: 'your-message', label: 'Your message', x: 13, y: 30 },
  { id: 'conversation-history', label: 'Conversation history', x: 39, y: 30 },
  { id: 'the-model', label: 'The model', x: 65, y: 30 },
  { id: 'response', label: 'Response', x: 88, y: 30 },
] as const;

export default function ChatFlowDiagram({ activeHotspotId, onHotspotSelect }: DiagramProps) {
  return (
    <div className="hotspot-diagram-wrap">
      <svg
        viewBox="0 0 580 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="A chat turn flows left to right: your message and the conversation history feed the model, which returns a response."
      >
        {/* connecting arrows */}
        <path d="M133 118 H160" stroke="var(--hairline-strong)" strokeWidth="2" markerEnd="url(#cf-arrow)" />
        <path d="M295 118 H320" stroke="var(--hairline-strong)" strokeWidth="2" markerEnd="url(#cf-arrow)" />
        <path d="M436 118 H460" stroke="var(--hairline-strong)" strokeWidth="2" markerEnd="url(#cf-arrow)" />
        <defs>
          <marker id="cf-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill="var(--hairline-strong)" />
          </marker>
        </defs>

        {/* your-message */}
        <rect x="24" y="88" width="104" height="60" rx="12" fill="var(--iris-tint)" stroke="var(--iris)" strokeWidth="1.5" />
        <rect x="38" y="104" width="72" height="7" rx="3.5" fill="var(--iris)" opacity="0.55" />
        <rect x="38" y="118" width="52" height="7" rx="3.5" fill="var(--iris)" opacity="0.35" />
        <text x="76" y="166" textAnchor="middle" fontSize="9.5" fontWeight="700" letterSpacing="0.06em" fill="var(--muted)">YOUR MESSAGE</text>

        {/* conversation-history — stacked bubbles */}
        <rect x="162" y="70" width="132" height="96" rx="11" fill="var(--oat)" stroke="var(--hairline-strong)" strokeWidth="1.5" />
        <rect x="174" y="82" width="80" height="13" rx="6.5" fill="var(--iris-tint)" />
        <rect x="200" y="102" width="82" height="13" rx="6.5" fill="var(--paper)" stroke="var(--hairline)" strokeWidth="1" />
        <rect x="174" y="122" width="66" height="13" rx="6.5" fill="var(--iris-tint)" />
        <rect x="200" y="142" width="82" height="13" rx="6.5" fill="var(--paper)" stroke="var(--hairline)" strokeWidth="1" />
        <text x="228" y="182" textAnchor="middle" fontSize="9.5" fontWeight="700" letterSpacing="0.06em" fill="var(--muted)">HISTORY</text>

        {/* the-model */}
        <rect x="322" y="80" width="114" height="76" rx="14" fill="var(--iris)" />
        <rect x="340" y="100" width="78" height="8" rx="4" fill="var(--paper)" opacity="0.85" />
        <rect x="340" y="116" width="60" height="8" rx="4" fill="var(--paper)" opacity="0.55" />
        <text x="379" y="146" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="0.12em" fill="var(--paper)">MODEL</text>

        {/* response */}
        <rect x="462" y="88" width="94" height="60" rx="12" fill="var(--mint)" stroke="var(--good)" strokeWidth="1.5" />
        <rect x="476" y="104" width="64" height="7" rx="3.5" fill="var(--good)" opacity="0.5" />
        <rect x="476" y="118" width="46" height="7" rx="3.5" fill="var(--good)" opacity="0.3" />
        <text x="509" y="166" textAnchor="middle" fontSize="9.5" fontWeight="700" letterSpacing="0.06em" fill="var(--muted)">RESPONSE</text>
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
