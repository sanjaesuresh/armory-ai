import Link from 'next/link';
import { ROLES } from '@/lib/catalog/roles';

export default function RolePicker() {
  return (
    <main className="section-tight">
      <div className="wrap">
        <div
          className="center"
          style={{ marginBottom: '36px' }}
        >
          <span className="eyebrow">Pick your role</span>
          <h1
            style={{
              fontSize: 'clamp(1.8rem,3.4vw,2.4rem)',
              margin: '0 0 10px',
            }}
          >
            What best describes your role?
          </h1>
          <p
            className="muted"
            style={{
              margin: '0 auto',
              maxWidth: '36em',
              fontSize: '1.05rem',
            }}
          >
            Pick the closest match, we&apos;ll show you setups that fit how you
            work.
          </p>
        </div>

        <div className="role-grid">
          {ROLES.map((role) => (
            <Link
              key={role.id}
              href={`/professionals?role=${role.id}`}
              data-testid={`role-card-${role.id}`}
              className="role-card"
            >
              <strong>{role.label}</strong>
              <span>{role.description}</span>
            </Link>
          ))}
        </div>

        <div className="center" style={{ marginTop: '28px' }}>
          <Link
            href="/professionals"
            data-testid="escape-link"
            className="small"
            style={{ color: 'var(--ink-soft)' }}
          >
            Not sure? Browse popular setups
          </Link>
        </div>
      </div>
    </main>
  );
}
