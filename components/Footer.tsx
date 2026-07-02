import Link from 'next/link';
import { ROLES } from '@/lib/catalog/roles';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">

        {/* Brand + promise */}
        <div>
          <Link className="brand" href="/">
            <svg width="22" height="22" viewBox="0 0 26 26" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="24" height="24" rx="7.5" fill="#272319" />
              <path
                d="M8.2 19 13 7.5 17.8 19M9.9 15.2h6.2"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Armory
          </Link>
          <p className="promise" style={{ color: 'var(--ink-soft)' }}>
            Built for people who use AI, not people who configure AI. Export, don&apos;t host — your setup lives in your Claude, not ours.
          </p>
        </div>

        {/* Site navigation */}
        <nav className="footer-links" aria-label="Site">
          <Link href="/catalog">Browse setups</Link>
          <Link href="/#how">How it works</Link>
        </nav>

        {/* Role landing pages */}
        <nav aria-label="Setups by role">
          <p className="eyebrow" style={{ marginBottom: '12px' }}>By role</p>
          <div className="footer-role-col">
            {ROLES.map((r) => (
              <Link key={r.id} href={`/for/${r.id}`}>
                {r.label}
              </Link>
            ))}
          </div>
        </nav>

      </div>
    </footer>
  );
}
