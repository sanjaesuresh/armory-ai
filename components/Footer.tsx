import Link from 'next/link';
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
          <Link href="/learn">Learn AI</Link>
        </nav>

      </div>

      {/* Author credit — brand-green links open the maker's profiles in a new tab */}
      <div className="wrap footer-credit">
        <span>
          built by{' '}
          <a
            href="https://github.com/sanjaesuresh"
            target="_blank"
            rel="noopener noreferrer"
          >
            sanjae suresh
          </a>
        </span>
        <span className="footer-credit-links">
          <a
            href="https://github.com/sanjaesuresh"
            target="_blank"
            rel="noopener noreferrer"
          >
            github
          </a>
          <a
            href="https://www.linkedin.com/in/sanjae-suresh/"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin
          </a>
        </span>
      </div>
    </footer>
  );
}
