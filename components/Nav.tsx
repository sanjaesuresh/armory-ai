'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        burgerRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        burgerRef.current && !burgerRef.current.contains(target) &&
        menuRef.current && !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className={`nav${open ? ' open' : ''}`}>
      <div className="wrap nav-inner">
        <Link className="brand" href="/">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
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

        <nav
          className="nav-links"
          id="navLinks"
          aria-label="Main"
          ref={menuRef}
        >
          <Link
            href="/catalog"
            onClick={closeMenu}
            aria-current={pathname === '/catalog' ? 'page' : undefined}
          >
            Browse setups
          </Link>
          <Link href="/#how" onClick={closeMenu}>How it works</Link>
          {/* Mobile-only CTA — shown in the open dropdown, hidden on desktop via CSS */}
          <Link className="btn btn-primary btn-sm nav-mobile-cta" href="/start" onClick={closeMenu}>
            Get started
          </Link>
        </nav>

        <div className="nav-cta">
          <Link className="btn btn-primary btn-sm" href="/start">Get started</Link>
        </div>

        <button
          ref={burgerRef}
          className="nav-burger"
          aria-expanded={open}
          aria-controls="navLinks"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <path d="M6 18L18 6M6 6l12 12" />
              </>
            ) : (
              <>
                <path d="M4 7h16M4 12h16M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>
    </header>
  );
}
