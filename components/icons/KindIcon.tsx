import type { SetupKind } from '@/lib/setup/types';

interface KindIconProps {
  kind: SetupKind;
  /** Icon dimensions in pixels (square). Defaults to 22. */
  size?: number;
  className?: string;
}

/** Inline SVG glyph for each SetupKind value.
 * All paths use currentColor stroke, 1.75px, rounded caps/joins, 24×24 viewBox. */
export default function KindIcon({ kind, size = 22, className }: KindIconProps) {
  const shared = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
    className,
  };

  switch (kind) {
    case 'setup':
      return (
        <svg {...shared}>
          {/* SlidersHorizontal — configuration / setup */}
          <line x1="4" y1="6" x2="20" y2="6" />
          <circle cx="8" cy="6" r="2" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <circle cx="16" cy="12" r="2" />
          <line x1="4" y1="18" x2="20" y2="18" />
          <circle cx="11" cy="18" r="2" />
        </svg>
      );

    case 'agent':
      return (
        <svg {...shared}>
          {/* CPU — autonomous agent */}
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="2" x2="9" y2="4" />
          <line x1="15" y1="2" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="22" />
          <line x1="15" y1="20" x2="15" y2="22" />
          <line x1="20" y1="9" x2="22" y2="9" />
          <line x1="20" y1="15" x2="22" y2="15" />
          <line x1="2" y1="9" x2="4" y2="9" />
          <line x1="2" y1="15" x2="4" y2="15" />
        </svg>
      );

    case 'skill':
      return (
        <svg {...shared}>
          {/* Zap / lightning — a reusable capability */}
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );

    case 'harness':
      return (
        <svg {...shared}>
          {/* Flask / Beaker — test harness */}
          <path d="M7 2h10" />
          <path d="M9 2v6l-5 10a2 2 0 0 0 1.76 3h10.48a2 2 0 0 0 1.76-3L13 8V2" />
          <line x1="9.5" y1="16" x2="9.5" y2="16.01" strokeWidth="2" strokeLinecap="round" />
          <line x1="12.5" y1="14" x2="12.5" y2="14.01" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
