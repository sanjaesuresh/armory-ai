import type { CalloutBlock as CalloutBlockData } from '@/lib/learn/types';

/**
 * CalloutBlock — a tip or warning aside. Tone selects the visual treatment and
 * the icon; the accessible name ("Tip" / "Warning") carries the tone to AT.
 */

const TONE = {
  tip: { label: 'Tip', className: 'callout-tip' },
  warning: { label: 'Warning', className: 'callout-warning' },
} as const;

function TipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.9 4.8L18.7 9l-4.8 1.9L12 15.7l-1.9-4.8L5.3 9l4.8-1.2z" />
      <path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3.5l9 15.5H3z" />
      <path d="M12 9.5v4.5" />
      <path d="M12 17.4h.01" />
    </svg>
  );
}

export default function CalloutBlock({ block }: { block: CalloutBlockData }) {
  const tone = TONE[block.tone];
  return (
    <aside className={`lblock block-callout ${tone.className}`} role="note" aria-label={tone.label}>
      <span className="callout-icon">{block.tone === 'tip' ? <TipIcon /> : <WarningIcon />}</span>
      <div className="callout-body">
        <p>{block.passage}</p>
      </div>
    </aside>
  );
}
