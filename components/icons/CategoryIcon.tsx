import type { Category } from '@/lib/setup/types';

interface CategoryIconProps {
  category: Category;
  /** Icon dimensions in pixels (square). Defaults to 22. */
  size?: number;
  className?: string;
}

/** Inline SVG glyph for each Category value.
 * All paths use currentColor stroke, 1.75px, rounded caps/joins, 24×24 viewBox. */
export default function CategoryIcon({
  category,
  size = 22,
  className,
}: CategoryIconProps) {
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

  switch (category) {
    case 'content':
      return (
        <svg {...shared}>
          {/* FileText */}
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="12" y2="17" />
        </svg>
      );

    case 'marketing':
      return (
        <svg {...shared}>
          {/* Megaphone */}
          <path d="m3 11 19-9v18L3 13" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
      );

    case 'engineering':
      return (
        <svg {...shared}>
          {/* Code angle brackets */}
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );

    case 'design':
      return (
        <svg {...shared}>
          {/* Pen-tool / vector pen nib */}
          <path d="m12 19 7-7 3 3-7 7-3-3z" />
          <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="m2 2 7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      );

    case 'product':
      return (
        <svg {...shared}>
          {/* Layers */}
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );

    case 'sales':
      return (
        <svg {...shared}>
          {/* TrendingUp */}
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      );

    case 'customer-support':
      return (
        <svg {...shared}>
          {/* MessageCircle — chat bubble */}
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );

    case 'finance':
      return (
        <svg {...shared}>
          {/* DollarSign */}
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );

    case 'legal':
      return (
        <svg {...shared}>
          {/* Scale / Balance */}
          <line x1="12" y1="3" x2="12" y2="20" />
          <polyline points="3 7 12 3 21 7" />
          <path d="M7.5 7L4 15a3.5 3.5 0 0 0 7 0z" />
          <path d="M16.5 7L13 15a3.5 3.5 0 0 0 7 0z" />
          <line x1="9" y1="20" x2="15" y2="20" />
        </svg>
      );

    case 'hr':
      return (
        <svg {...shared}>
          {/* Users */}
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );

    case 'operations':
      return (
        <svg {...shared}>
          {/* Settings — spoked gear */}
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
        </svg>
      );

    case 'research':
      return (
        <svg {...shared}>
          {/* Search */}
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );

    case 'education':
      return (
        <svg {...shared}>
          {/* GraduationCap */}
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );

    case 'writing':
      return (
        <svg {...shared}>
          {/* Pencil / Edit */}
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      );

    case 'data':
      return (
        <svg {...shared}>
          {/* BarChart */}
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
          <line x1="2" y1="20" x2="22" y2="20" />
        </svg>
      );

    case 'devops':
      return (
        <svg {...shared}>
          {/* Terminal >_ */}
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );

    case 'general':
      return (
        <svg {...shared}>
          {/* Grid 2×2 */}
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      );

    default:
      return (
        <svg {...shared}>
          {/* Fallback — circle with centre dot */}
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}
