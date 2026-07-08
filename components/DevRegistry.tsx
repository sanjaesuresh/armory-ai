'use client';

/**
 * DevRegistry — "For developers" homepage section.
 *
 * Displays top GitHub-sourced registry picks (agents, skills, harnesses) with
 * a 3-way segmented tab control. Tabs use roving tabindex + arrow-key nav
 * matching the HomePipeline pattern so keyboard users can switch groups without
 * tabbing through every row first.
 *
 * Receives fully serializable props from the Landing server component so no
 * DB access happens here.
 */

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { formatStars } from '@/lib/catalog/format-stars';

// ── Types ─────────────────────────────────────────────────────────────────────

export type RegistryKind = 'agent' | 'skill' | 'harness';

export interface DevRegistryRow {
  slug: string;
  name: string;
  tagline: string;
  stars: number | null;
  href: string;
}

export interface DevRegistryGroup {
  kind: RegistryKind;
  label: string;
  count: number;
  rows: DevRegistryRow[];
}

interface DevRegistryProps {
  groups: DevRegistryGroup[];
  total: number;
}

// ── Per-kind config ────────────────────────────────────────────────────────────

const KIND_META: Record<RegistryKind, { icon: string; dot: string }> = {
  // dot colors match the spec: agent→accent-sage, skill→accent-sky, harness→accent-butter
  agent:   { icon: '🤖', dot: 'var(--accent-sage)' },
  skill:   { icon: '⚡', dot: 'var(--accent-sky)' },
  harness: { icon: '🔩', dot: 'var(--accent-butter)' },
};

// ── Star SVG (decorative; aria-hidden at call site) ───────────────────────────

function StarIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="currentColor"
      aria-hidden="true"
    >
      {/* filled star path */}
      <path d="M6 1l1.545 3.09L11 4.635l-2.5 2.41.59 3.41L6 8.88l-3.09 1.575.59-3.41L1 4.635l3.455-.545L6 1z" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DevRegistry({ groups, total }: DevRegistryProps) {
  // default to the first non-empty group
  const firstKind = groups.find((g) => g.rows.length > 0)?.kind ?? groups[0]?.kind ?? 'agent';
  const [activeKind, setActiveKind] = useState<RegistryKind>(firstKind);

  // refs for roving tabindex — one per group, matching the groups array order
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleTabKey = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
      const len = groups.length;
      let target = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        target = (idx + 1) % len;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        target = (idx - 1 + len) % len;
      }
      if (target >= 0) {
        setActiveKind(groups[target].kind);
        tabRefs.current[target]?.focus();
      }
    },
    [groups],
  );

  const activeGroup = groups.find((g) => g.kind === activeKind);

  return (
    <section className="dev-section" aria-labelledby="dev-section-title">
      <div className="wrap">

        {/* ── Two-column header ──────────────────────────────────────────── */}
        <div className="dev-header">

          {/* Left: eyebrow + headline + sub */}
          <div className="dev-header-left">
            <p className="eyebrow dev-eyebrow">For developers</p>
            <h2 id="dev-section-title" className="dev-h2">
              Drop-in tools for Claude Code, {' '}
              <span className="dev-h2-accent">the best of GitHub</span>
              , curated.
            </h2>
            <p className="dev-sub">
              Agents, skills, and harnesses the community actually stars. We
              surface the most popular ones so you can compare and grab them, 
              no trawling GitHub for the good repos.
            </p>
          </div>

          {/* Right: stat row, bottom-aligned */}
          <div className="dev-header-right">
            <div className="dev-stats">
              <div className="dev-stat">
                <span className="dev-stat-num">{total}+</span>
                <span className="dev-stat-lbl">registry tools</span>
              </div>
              <div className="dev-stat">
                <span className="dev-stat-num">3</span>
                <span className="dev-stat-lbl">kinds</span>
              </div>
              <div className="dev-stat">
                <span className="dev-stat-num">GitHub</span>
                <span className="dev-stat-lbl">sourced</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Segmented tab control ─────────────────────────────────────── */}
        <div
          className="dev-tabs"
          role="group"
          aria-label="Registry kind"
        >
          {groups.map((group, idx) => {
            const meta = KIND_META[group.kind];
            const isActive = group.kind === activeKind;
            return (
              <button
                key={group.kind}
                ref={(el) => { tabRefs.current[idx] = el; }}
                className={`dev-tab${isActive ? ' dev-tab--active' : ''}`}
                aria-pressed={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveKind(group.kind)}
                onKeyDown={(e) => handleTabKey(e, idx)}
              >
                {/* emoji icon — decorative, kind is in the label text */}
                <span aria-hidden="true">{meta.icon}</span>
                {group.label}
                <span className="dev-tab-count">{group.count}</span>
              </button>
            );
          })}
        </div>

        {/* ── Row list ──────────────────────────────────────────────────── */}
        <div className="dev-list" aria-label={`Top ${activeGroup?.label ?? ''} picks`}>
          {activeGroup?.rows.map((row) => {
            const dot = KIND_META[activeKind].dot;
            return (
              <Link
                key={row.slug}
                href={row.href}
                className="dev-row"
                data-testid={`dev-row-${row.slug}`}
              >
                {/* accent dot — decorative */}
                <span
                  className="dev-row-dot"
                  style={{ background: dot }}
                  aria-hidden="true"
                />

                {/* name + source pill + tagline */}
                <div className="dev-row-body">
                  <div className="dev-row-name-line">
                    <span className="dev-row-name">{row.name}</span>
                    <span className="dev-row-src">community</span>
                  </div>
                  <p className="dev-row-tagline">{row.tagline}</p>
                </div>

                {/* stars */}
                {row.stars !== null && (
                  <div className="dev-row-stars">
                    {/* star icon is decorative; text gives the number */}
                    <span className="dev-row-star-icon">
                      <StarIcon />
                    </span>
                    <span>{formatStars(row.stars)}</span>
                  </div>
                )}

                {/* view link — visual affordance; the whole row is the link */}
                <span className="dev-row-view" aria-hidden="true">View →</span>
              </Link>
            );
          })}
        </div>

        {/* ── Footer CTAs ───────────────────────────────────────────────── */}
        <div className="dev-footer">
          <div className="dev-footer-ctas">
            <Link href="/developers" className="btn btn-iris">
              Explore the developer registry →
            </Link>
            <Link href="/developers" className="btn btn-outline">
              Post your own
            </Link>
          </div>
          <p className="dev-footer-note">Free to browse and export. No account needed.</p>
        </div>

      </div>
    </section>
  );
}
