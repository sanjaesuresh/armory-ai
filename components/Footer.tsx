import Link from 'next/link';
import { ROLES } from '@/lib/catalog/roles';
import LogoMark from '@/components/icons/LogoMark';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">

        {/* Brand + promise */}
        <div>
          <Link className="brand" href="/">
            <LogoMark size={22} />
            Armory
          </Link>
          <p className="promise" style={{ color: 'var(--ink-soft)' }}>
            Built for people who use AI, not people who configure AI. Export, don&apos;t host — your setup lives in your Claude, not ours.
          </p>
        </div>

        {/* Site navigation */}
        <nav className="footer-links" aria-label="Site">
          <Link href="/professionals">Browse setups</Link>
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
