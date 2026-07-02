import Link from 'next/link';

interface EmptyStateProps {
  showClearLink?: boolean;
}

export default function EmptyState({ showClearLink = false }: EmptyStateProps) {
  return (
    <div
      data-testid="empty-state"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '3rem 1rem',
        textAlign: 'center',
        color: '#555',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
        No setups for this role yet — more are on the way.
      </p>
      {showClearLink && (
        <Link
          href="/catalog"
          data-testid="clear-filters"
          style={{
            color: '#1a1a1a',
            fontWeight: 600,
            fontSize: '0.95rem',
            textDecoration: 'underline',
          }}
        >
          Show all setups
        </Link>
      )}
    </div>
  );
}
