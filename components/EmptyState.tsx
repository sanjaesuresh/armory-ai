import Link from 'next/link';

interface EmptyStateProps {
  /**
   * When provided, "Show all setups" is a navigation link to this href.
   * Used when ?role= produced no topPicks (clear needs to reset the URL).
   */
  clearHref?: string;
  /**
   * When provided, "Show all setups" is a button that calls this function.
   * Used when client-side search/chip filtering produced 0 results.
   */
  onReset?: () => void;
  message?: string;
}

/* SVG illustration — dark-theme palette:
   stroke uses --ink-soft (#b6b6b8), fills use --raise (#2b2b2c) for surfaces
   and --oat-deep (#1c1c1d) for the ground shadow. Accent arcs use --iris (#3ddc80). */
const EMPTY_SVG = (
  <svg
    width="120"
    height="90"
    viewBox="0 0 120 90"
    fill="none"
    stroke="#b6b6b8"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <ellipse cx="62" cy="78" rx="38" ry="5" fill="#1c1c1d" stroke="none" />
    <path d="M34 42 60 30l26 12-26 12z" fill="#2b2b2c" />
    <path d="M34 42v22l26 12V54M86 42v22L60 76V54" />
    <path
      d="M34 42 24 50l26 13 10-9M86 42l10 8-26 13-10-9"
      fill="#2b2b2c"
    />
    <path
      d="M52 20c2-5 8-6 10-2M66 14c3-3 8-1 8 3"
      stroke="#3ddc80"
    />
  </svg>
);

export default function EmptyState({
  clearHref,
  onReset,
  message = 'No setups match these filters',
}: EmptyStateProps) {
  return (
    <div data-testid="empty-state" className="empty">
      {EMPTY_SVG}
      <h3>{message}</h3>
      <p>
        Try a different search, or clear the filters, more setups are on the
        way.
      </p>
      {clearHref && (
        <Link
          href={clearHref}
          data-testid="clear-filters"
          className="btn btn-outline btn-sm"
        >
          Show all setups
        </Link>
      )}
      {!clearHref && onReset && (
        <button
          type="button"
          onClick={onReset}
          data-testid="clear-filters"
          className="btn btn-outline btn-sm"
        >
          Show all setups
        </button>
      )}
    </div>
  );
}
