import type { DiagramProps } from './index';

/**
 * knowledge-file-flow — how an uploaded file becomes a grounded answer.
 * Your file is indexed; your question retrieves matching passages, which the
 * model turns into an answer. Paper-craft collage, no character art.
 */

const HOTSPOTS = [
  { id: 'your-file', label: 'Your file', x: 15, y: 26 },
  { id: 'index', label: 'Index', x: 50, y: 26 },
  { id: 'question', label: 'Your question', x: 15, y: 74 },
  { id: 'retrieved-passages', label: 'Retrieved passages', x: 50, y: 74 },
  { id: 'answer', label: 'Answer', x: 86, y: 74 },
] as const;

export default function KnowledgeFileFlowDiagram({ activeHotspotId, onHotspotSelect }: DiagramProps) {
  return (
    <div className="hotspot-diagram-wrap">
      <svg
        viewBox="0 0 580 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="An uploaded file is turned into an index; a question retrieves the matching passages, which the model uses to compose a grounded answer."
      >
        <defs>
          <marker id="kf-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill="var(--hairline-strong)" />
          </marker>
        </defs>

        {/* your-file → index (top row) */}
        <path d="M132 66 H206" stroke="var(--hairline-strong)" strokeWidth="2" markerEnd="url(#kf-arrow)" />
        {/* index → retrieved (down) */}
        <path d="M262 108 V150" stroke="var(--hairline-strong)" strokeWidth="2" markerEnd="url(#kf-arrow)" />
        {/* question → retrieved (bottom row) */}
        <path d="M136 196 H206" stroke="var(--hairline-strong)" strokeWidth="2" markerEnd="url(#kf-arrow)" />
        {/* retrieved → answer */}
        <path d="M320 196 H392" stroke="var(--hairline-strong)" strokeWidth="2" markerEnd="url(#kf-arrow)" />

        {/* your-file — a document */}
        <path d="M52 34 h44 l16 16 v40 a4 4 0 0 1 -4 4 h-56 a4 4 0 0 1 -4 -4 v-52 a4 4 0 0 1 4 -4 Z" fill="var(--paper)" stroke="var(--accent-sky)" strokeWidth="1.5" />
        <path d="M96 34 v16 h16" fill="none" stroke="var(--accent-sky)" strokeWidth="1.5" />
        <rect x="56" y="60" width="48" height="5" rx="2.5" fill="var(--muted)" opacity="0.4" />
        <rect x="56" y="72" width="40" height="5" rx="2.5" fill="var(--muted)" opacity="0.4" />
        <text x="82" y="108" textAnchor="middle" fontSize="9" fontWeight="700" letterSpacing="0.06em" fill="var(--muted)">YOUR FILE</text>

        {/* index — a grid */}
        <rect x="212" y="30" width="100" height="66" rx="10" fill="var(--lilac)" stroke="var(--iris)" strokeWidth="1.25" />
        <rect x="224" y="42" width="34" height="18" rx="4" fill="var(--iris)" opacity="0.28" />
        <rect x="266" y="42" width="34" height="18" rx="4" fill="var(--iris)" opacity="0.4" />
        <rect x="224" y="66" width="34" height="18" rx="4" fill="var(--iris)" opacity="0.4" />
        <rect x="266" y="66" width="34" height="18" rx="4" fill="var(--iris)" opacity="0.28" />
        <text x="262" y="108" textAnchor="middle" fontSize="9" fontWeight="700" letterSpacing="0.06em" fill="var(--muted)">INDEX</text>

        {/* question — a query bubble */}
        <rect x="40" y="168" width="96" height="42" rx="12" fill="var(--iris-tint)" stroke="var(--iris)" strokeWidth="1.25" />
        <rect x="54" y="182" width="60" height="6" rx="3" fill="var(--iris)" opacity="0.5" />
        <rect x="54" y="194" width="44" height="6" rx="3" fill="var(--iris)" opacity="0.32" />
        <text x="88" y="228" textAnchor="middle" fontSize="9" fontWeight="700" letterSpacing="0.06em" fill="var(--muted)">QUESTION</text>

        {/* retrieved-passages — highlighted snippets */}
        <rect x="212" y="160" width="108" height="58" rx="10" fill="var(--butter)" stroke="var(--accent-butter)" strokeWidth="1.25" />
        <rect x="224" y="172" width="84" height="9" rx="3" fill="var(--accent-butter)" opacity="0.55" />
        <rect x="224" y="186" width="72" height="9" rx="3" fill="var(--accent-butter)" opacity="0.4" />
        <rect x="224" y="200" width="60" height="9" rx="3" fill="var(--accent-butter)" opacity="0.3" />
        <text x="266" y="234" textAnchor="middle" fontSize="8.5" fontWeight="700" letterSpacing="0.05em" fill="var(--muted)">PASSAGES</text>

        {/* answer — final bubble */}
        <rect x="398" y="164" width="150" height="50" rx="12" fill="var(--mint)" stroke="var(--good)" strokeWidth="1.5" />
        <rect x="412" y="178" width="118" height="7" rx="3.5" fill="var(--good)" opacity="0.5" />
        <rect x="412" y="192" width="88" height="7" rx="3.5" fill="var(--good)" opacity="0.3" />
        <text x="473" y="232" textAnchor="middle" fontSize="9" fontWeight="700" letterSpacing="0.06em" fill="var(--muted)">ANSWER</text>
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
