import Link from 'next/link';
import { ROLES } from '@/lib/catalog/roles';

export default function RolePicker() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>
        What best describes your role?
      </h1>
      <p style={{ color: '#555', marginBottom: '2rem', textAlign: 'center', fontSize: '1rem' }}>
        Pick the closest match — we'll show you setups that fit how you work.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem',
          width: '100%',
          marginBottom: '2rem',
        }}
      >
        {ROLES.map((role) => (
          <Link
            key={role.id}
            href={`/catalog?role=${role.id}`}
            data-testid={`role-card-${role.id}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '1.25rem',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              background: '#fff',
            }}
          >
            <span style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{role.icon}</span>
            <span style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '1rem' }}>{role.label}</span>
            <span style={{ color: '#555', fontSize: '0.875rem', lineHeight: 1.4 }}>{role.description}</span>
          </Link>
        ))}
      </div>
      <Link
        href="/catalog"
        data-testid="escape-link"
        style={{ color: '#555', fontSize: '0.9rem' }}
      >
        Not sure? Browse popular setups
      </Link>
    </main>
  );
}
