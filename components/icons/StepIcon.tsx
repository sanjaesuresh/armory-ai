interface StepIconProps {
  /**
   * Named step. "How it works" steps: browse | customize | test-drive | export.
   * Compiler-pipeline stages: role | questions | compiled | paste.
   */
  name:
    | 'browse'
    | 'customize'
    | 'test-drive'
    | 'export'
    | 'role'
    | 'questions'
    | 'compiled'
    | 'paste';
  /** Icon dimensions in pixels (square). Defaults to 22. */
  size?: number;
  className?: string;
}

/** Inline SVG glyph for named homepage/pipeline steps.
 * All paths use currentColor stroke, 1.75px, rounded caps/joins, 24×24 viewBox. */
export default function StepIcon({ name, size = 22, className }: StepIconProps) {
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

  switch (name) {
    case 'browse':
      return (
        <svg {...shared}>
          {/* Search / magnifying glass */}
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );

    case 'customize':
      return (
        <svg {...shared}>
          {/* SlidersHorizontal */}
          <line x1="4" y1="6" x2="20" y2="6" />
          <circle cx="8" cy="6" r="2" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <circle cx="16" cy="12" r="2" />
          <line x1="4" y1="18" x2="20" y2="18" />
          <circle cx="11" cy="18" r="2" />
        </svg>
      );

    case 'test-drive':
      return (
        <svg {...shared}>
          {/* Play circle */}
          <circle cx="12" cy="12" r="9" />
          <polygon
            points="10 8 16 12 10 16 10 8"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );

    case 'export':
      return (
        <svg {...shared}>
          {/* Download */}
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      );

    case 'role':
      return (
        <svg {...shared}>
          {/* User / person */}
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );

    case 'questions':
      return (
        <svg {...shared}>
          {/* MessageSquare — answer questions */}
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );

    case 'compiled':
      return (
        <svg {...shared}>
          {/* Package — compiled output */}
          <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );

    case 'paste':
      return (
        <svg {...shared}>
          {/* Clipboard */}
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" />
        </svg>
      );
  }
}
