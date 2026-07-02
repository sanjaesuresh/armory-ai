import Link from 'next/link';
import type { Setup } from '@/lib/setup/types';

interface SetupCardProps {
  setup: Setup;
}

export default function SetupCard({ setup }: SetupCardProps) {
  return (
    <div
      data-testid={`setup-card-${setup.slug}`}
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '1.25rem',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <Link
        href={`/setup/${setup.slug}`}
        data-testid="card-link"
        style={{
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <span
          data-testid="card-name"
          style={{ fontWeight: 600, fontSize: '1rem', display: 'block', marginBottom: '0.25rem' }}
        >
          {setup.name}
        </span>
      </Link>
      <span
        data-testid="card-tagline"
        style={{ color: '#444', fontSize: '0.9rem', lineHeight: 1.4 }}
      >
        {setup.tagline}
      </span>
      <span style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.25rem' }}>
        {setup.role} · {setup.category}
      </span>
    </div>
  );
}
