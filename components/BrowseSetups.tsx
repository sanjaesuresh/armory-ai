'use client';

import { useState, useMemo, useId } from 'react';
import Link from 'next/link';
import type { Setup } from '@/lib/setup/types';
import { recommend } from '@/lib/catalog/recommender';
import SetupCard from './SetupCard';
import EmptyState from './EmptyState';
import CategoryChips from './CategoryChips';

interface BrowseSetupsProps {
  allSetups: Setup[];
  initialRole?: string;
  initialCat?: string;
}

export default function BrowseSetups({
  allSetups,
  initialRole,
  initialCat,
}: BrowseSetupsProps) {
  const searchId = useId();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState(initialCat ?? 'All');

  // Derive unique categories from the fetched setups (preserving insertion order).
  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const s of allSetups) {
      seen.add(s.category);
    }
    return ['All', ...Array.from(seen)];
  }, [allSetups]);

  // Run recommender once when a role is supplied.
  const { topPicks, remainder } = useMemo(() => {
    if (!initialRole) return { topPicks: [] as Setup[], remainder: allSetups };
    return recommend(allSetups, { role: initialRole });
  }, [allSetups, initialRole]);

  /** Returns true when a setup should be visible given current search + chip. */
  function matchesFilter(s: Setup): boolean {
    const catOK = activeCat === 'All' || s.category === activeCat;
    const q = search.toLowerCase().trim();
    const qOK =
      !q ||
      [s.name, s.tagline, s.description, ...s.tags]
        .join(' ')
        .toLowerCase()
        .includes(q);
    return catOK && qOK;
  }

  function resetFilters() {
    setSearch('');
    setActiveCat('All');
  }

  // ── When role= is present and topPicks is empty, show role-empty state ──────
  // Only take this early exit when the user hasn't applied any filter yet.
  // Once they click a chip or type a search, activeCat or search will be non-default,
  // so we fall through to the main render path which filters over allSetups (via remainder).
  if (initialRole && topPicks.length === 0 && activeCat === 'All' && !search.trim()) {
    return (
      <>
        <BrowseHead searchId={searchId} search={search} onSearch={setSearch} />
        <CategoryChips
          categories={categories}
          activeCat={activeCat}
          onChange={setActiveCat}
        />
        <EmptyState
          message="No setups for this role yet — more are on the way."
          clearHref="/catalog"
        />
      </>
    );
  }

  // ── Derive filtered lists ────────────────────────────────────────────────────
  const filteredTop = initialRole ? topPicks.filter(matchesFilter) : [];
  const filteredRest = initialRole
    ? remainder.filter(matchesFilter)
    : allSetups.filter(matchesFilter);

  const totalCount = filteredTop.length + filteredRest.length;

  // ── Build count label ────────────────────────────────────────────────────────
  const countLabel = totalCount === 1 ? '1 setup' : `${totalCount} setups`;

  return (
    <>
      <BrowseHead searchId={searchId} search={search} onSearch={setSearch} />

      <CategoryChips
        categories={categories}
        activeCat={activeCat}
        onChange={setActiveCat}
      />

      <p
        className="result-count"
        aria-live="polite"
        data-testid="result-count"
      >
        {countLabel}
      </p>

      {totalCount === 0 ? (
        <EmptyState onReset={resetFilters} />
      ) : (
        <>
          {/* Recommended section — only when role= is present and topPicks non-empty */}
          {initialRole && filteredTop.length > 0 && (
            <section
              data-testid="recommended-section"
              style={{ marginBottom: '32px' }}
            >
              <h2
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  marginBottom: '16px',
                  marginTop: 0,
                }}
              >
                Recommended for you
              </h2>
              <div className="setup-grid">
                {filteredTop.map((setup) => (
                  <SetupCard key={setup.slug} setup={setup} />
                ))}
              </div>
            </section>
          )}

          {/* Rest of setups */}
          {filteredRest.length > 0 && (
            <section
              aria-label={
                initialRole && filteredTop.length > 0
                  ? 'More setups'
                  : undefined
              }
            >
              {initialRole && filteredTop.length > 0 && (
                <h2
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    marginBottom: '16px',
                    marginTop: 0,
                    color: 'var(--ink-soft)',
                  }}
                >
                  More setups
                </h2>
              )}
              <div className="setup-grid">
                {filteredRest.map((setup) => (
                  <SetupCard key={setup.slug} setup={setup} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <div className="center" style={{ marginTop: '44px' }}>
        <p
          className="muted small"
          style={{ marginBottom: '10px' }}
        >
          Don&apos;t see your role? More curated setups ship every month.
        </p>
        <Link className="btn btn-outline btn-sm" href="/#how">
          See how setups work first
        </Link>
      </div>
    </>
  );
}

// ── Browse head sub-component ─────────────────────────────────────────────────

interface BrowseHeadProps {
  searchId: string;
  search: string;
  onSearch: (val: string) => void;
}

function BrowseHead({ searchId, search, onSearch }: BrowseHeadProps) {
  return (
    <div className="browse-head">
      <div>
        <span className="eyebrow">Setup library</span>
        <h1
          style={{
            fontSize: 'clamp(1.8rem,3.4vw,2.4rem)',
            margin: '0 0 6px',
          }}
        >
          Browse all setups
        </h1>
        <p
          className="muted"
          data-testid="setup-explainer"
          style={{ margin: 0, maxWidth: '36em' }}
        >
          A setup is a ready-made set of instructions you paste into Claude to
          make it act like a specialist — no technical knowledge needed.
        </p>
      </div>

      <label className="search-bar" htmlFor={searchId}>
        {/* magnifier icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="10.5" cy="10.5" r="6" />
          <path d="m15.3 15.3 4.7 4.7" />
        </svg>
        <input
          id={searchId}
          type="search"
          placeholder='Search setups — try "email" or "brand"'
          aria-label="Search setups"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </label>
    </div>
  );
}
