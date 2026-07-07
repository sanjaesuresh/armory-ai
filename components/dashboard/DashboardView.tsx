'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Setup, SetupKind, Category } from '@/lib/setup/types';
import {
  approvedShelf,
  popularShelf,
  filterList,
  sortList,
  type SortKey,
} from '@/lib/catalog/dashboard';
import {
  CATEGORY_BROWSE_ORDER,
  getCategoryAccent,
  getCategoryLabel,
} from '@/lib/catalog/categoryUtils';
import SetupCard from '../SetupCard';
import EmptyState from '../EmptyState';
import GoalChips from '../GoalChips';
import ListTable from './ListTable';
import FeaturedLead from './FeaturedLead';

type Variant = 'developers' | 'professionals';

interface RolePicks {
  items: Setup[];
  whyLabels: Record<string, string[]>;
  fallback?: boolean;
}

interface DashboardViewProps {
  items: Setup[];
  variant: Variant;
  rolePicks?: RolePicks;
  goalChips?: { role: string; cat?: string };
  initialCat?: string;
  initialKind?: string;
}

// ── Per-variant copy ─────────────────────────────────────────────────────────

const COPY = {
  professionals: {
    heading: 'Professionals',
    ctaLabel: 'Build a setup',
    ctaHref: '/build',
    ctaClass: 'btn btn-outline btn-sm',
    listHeading: 'All setups',
    searchLabel: 'Search setups',
    searchPlaceholder: 'Search setups — try "email" or "brand"',
    nounOne: 'setup',
    nounMany: 'setups',
  },
  developers: {
    heading: 'Developers',
    ctaLabel: 'Post your own',
    ctaHref: '/build',
    ctaClass: 'btn btn-iris btn-sm',
    listHeading: 'All tools',
    searchLabel: 'Search the registry',
    searchPlaceholder: 'Search tools — try "review" or "commit"',
    nounOne: 'tool',
    nounMany: 'tools',
  },
} as const;

// ── Kind rail items (developers) ─────────────────────────────────────────────

const KIND_RAIL: Array<{ label: string; value: 'all' | SetupKind; dot: string }> = [
  { label: 'All kinds',  value: 'all',     dot: 'var(--ink-soft)' },
  { label: 'Agents',     value: 'agent',   dot: 'var(--accent-sage)' },
  { label: 'Skills',     value: 'skill',   dot: 'var(--accent-sky)' },
  { label: 'Harnesses',  value: 'harness', dot: 'var(--accent-butter)' },
  { label: 'Setups',     value: 'setup',   dot: 'var(--accent-lilac)' },
];

// ── Source filter chips (developers, below search) ───────────────────────────

type SourceFilterValue = 'all' | 'github' | 'community' | 'curated' | 'ai-generated';
const SOURCE_CHIPS: Array<{ label: string; value: SourceFilterValue }> = [
  { label: 'All',           value: 'all' },
  { label: 'Community pick', value: 'github' },
  { label: 'Member post',   value: 'community' },
  { label: 'Curated',       value: 'curated' },
];

const SORT_OPTIONS: Array<{ label: string; value: SortKey }> = [
  { label: 'Most popular',     value: 'popularity' },
  { label: 'Most upvoted',     value: 'upvotes' },
  { label: 'Recently updated', value: 'recency' },
];

// ── DashboardView ─────────────────────────────────────────────────────────────

export default function DashboardView({
  items,
  variant,
  rolePicks,
  goalChips,
  initialCat,
  initialKind,
}: DashboardViewProps) {
  const copy = COPY[variant];
  const isDevelopers = variant === 'developers';
  const searchId = useId();
  const sortId = useId();

  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState(
    isDevelopers ? (initialKind ?? 'all') : (initialCat ?? 'All'),
  );
  const [source, setSource]   = useState<SourceFilterValue>('all');
  const [sortKey, setSortKey] = useState<SortKey>('popularity');

  // ── Featured shelves (over the full, unfiltered set) ─────────────────────

  const approved = useMemo(() => approvedShelf(items, 1), [items]);
  // Cap at 3 so FeaturedLead always has enough items: when approved is empty,
  // popular[0] becomes the hero and popular[1..2] are the two runners.
  const popular  = useMemo(
    () => popularShelf(items, 3, new Set(approved.map((s) => s.id))),
    [items, approved],
  );

  // ── Category counts (professionals) ─────────────────────────────────────

  const categoryCounts = useMemo<Record<string, number>>(() => {
    if (isDevelopers) return {};
    const counts: Record<string, number> = {};
    for (const s of items) counts[s.category] = (counts[s.category] ?? 0) + 1;
    return counts;
  }, [items, isDevelopers]);

  const browseCategories = useMemo<Category[]>(
    () => isDevelopers
      ? []
      : CATEGORY_BROWSE_ORDER.filter((cat) => (categoryCounts[cat] ?? 0) > 0),
    [isDevelopers, categoryCounts],
  );

  // ── Kind counts (developers) ─────────────────────────────────────────────

  const kindCounts = useMemo<Record<string, number>>(() => {
    if (!isDevelopers) return {};
    const counts: Record<string, number> = {};
    for (const s of items) counts[s.kind] = (counts[s.kind] ?? 0) + 1;
    return counts;
  }, [items, isDevelopers]);

  // ── Filtered + sorted list ──────────────────────────────────────────────

  const list = useMemo(() => {
    const query = search.trim() || undefined;
    const criteria = isDevelopers
      ? {
          query,
          kind:   filter === 'all' ? undefined : (filter as SetupKind),
          source: source === 'all' ? undefined : (source as Setup['source']),
        }
      : { query, category: filter === 'All' ? undefined : filter };
    return sortList(filterList(items, criteria), sortKey);
  }, [items, isDevelopers, filter, source, search, sortKey]);

  const countLabel =
    list.length === 1
      ? `1 ${copy.nounOne}`
      : `${list.length} ${copy.nounMany}`;

  function resetFilters() {
    setSearch('');
    setFilter(isDevelopers ? 'all' : 'All');
    if (isDevelopers) setSource('all');
  }

  const totalCount = items.length;

  return (
    <>
      {/* ── Optional goal-selection chips (above the shell) ─────────────── */}
      {goalChips && <GoalChips role={goalChips.role} cat={goalChips.cat} />}

      {/* ── Recommender strip (full-width, above the shell) ─────────────── */}
      {rolePicks && rolePicks.items.length > 0 && (
        <section
          data-testid={rolePicks.fallback ? 'fallback-section' : 'recommended-section'}
          className="dash-zone"
        >
          <h2 data-testid="recommended-heading" className="dash-strip-heading">
            {rolePicks.fallback
              ? "Nothing tailored yet — here's what's popular"
              : 'Recommended for you'}
          </h2>
          <div className="setup-grid">
            {rolePicks.items.map((setup) => (
              <SetupCard
                key={setup.slug}
                setup={setup}
                whyLabels={rolePicks.whyLabels[setup.id]}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Browse shell: left rail + main content ─────────────────────── */}
      <div className="browse-shell">

        {/* ── Left rail ─────────────────────────────────────────────────── */}
        <aside className="browse-rail" aria-label="Browse filters">

          {/* Kind filter — developers only */}
          {isDevelopers && (
            <>
              <p className="browse-rail-label">Kind</p>
              {/* role="group" keeps test contract: getByRole('group', { name: 'Filter by kind' }) */}
              <div role="group" aria-label="Filter by kind">
                {KIND_RAIL.map((item) => {
                  const count = item.value === 'all'
                    ? totalCount
                    : (kindCounts[item.value] ?? 0);
                  return (
                    <button
                      key={item.value}
                      type="button"
                      className="rail-filter-item"
                      aria-pressed={filter === item.value}
                      aria-label={item.label}
                      onClick={() => setFilter(item.value)}
                    >
                      <span
                        className="rail-filter-dot"
                        style={{ background: item.dot }}
                        aria-hidden="true"
                      />
                      <span aria-hidden="true">{item.label}</span>
                      <span className="rail-filter-n" aria-hidden="true">{count}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Category filter — professionals only */}
          {!isDevelopers && (
            <>
              <p className="browse-rail-label">Category</p>
              {/* role="group" keeps test contract: getByRole('group', { name: 'Filter by category' }) */}
              <div role="group" aria-label="Filter by category">
                {/* "All" entry */}
                <button
                  type="button"
                  className="rail-filter-item"
                  aria-pressed={filter === 'All'}
                  aria-label="All"
                  onClick={() => setFilter('All')}
                >
                  <span
                    className="rail-filter-dot"
                    style={{ background: 'var(--ink-soft)' }}
                    aria-hidden="true"
                  />
                  <span aria-hidden="true">All</span>
                  <span className="rail-filter-n" aria-hidden="true">{totalCount}</span>
                </button>

                {browseCategories.map((cat) => {
                  const label = getCategoryLabel(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      className="rail-filter-item"
                      aria-pressed={filter === cat}
                      aria-label={label}
                      onClick={() => setFilter(cat)}
                    >
                      <span
                        className="rail-filter-dot"
                        style={{ background: getCategoryAccent(cat) }}
                        aria-hidden="true"
                      />
                      <span aria-hidden="true">{label}</span>
                      <span className="rail-filter-n" aria-hidden="true">{categoryCounts[cat] ?? 0}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </aside>

        {/* ── Main content ──────────────────────────────────────────────── */}
        <div className="browse-main">

          {/* Compact page header with h1 (required by e2e: heading level 1) */}
          <div className="browse-page-head">
            <h1>{copy.heading}</h1>
            <Link className={copy.ctaClass} href={copy.ctaHref}>
              <PlusIcon />
              {copy.ctaLabel}
            </Link>
          </div>

          {/* Featured lead (replaces the old shelves) */}
          {(approved.length > 0 || popular.length > 0) && (
            <FeaturedLead approved={approved} popular={popular} />
          )}

          {/* ── Index: search + sort + filter + rows ───────────────────── */}
          <section id="full-list" className="idx-section">

            <div className="idx-head">
              <h2>{copy.listHeading}</h2>
              <span className="idx-count">{countLabel}</span>
              <div className="idx-sort">
                <label className="dash-sort" htmlFor={sortId}>
                  <span>Sort</span>
                  <select
                    id={sortId}
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value as SortKey)}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {/* Search + live count row */}
            <div className="idx-controls">
              <label className="search-bar" htmlFor={searchId}>
                <SearchIcon />
                <input
                  id={searchId}
                  type="search"
                  placeholder={copy.searchPlaceholder}
                  aria-label={copy.searchLabel}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <p
                className="result-count"
                aria-live="polite"
                data-testid="result-count"
              >
                {countLabel}
              </p>
            </div>

            {/* Source filter (developers only — below search) */}
            {isDevelopers && (
              <div className="filter-row" role="group" aria-label="Filter by source">
                {SOURCE_CHIPS.map((chip) => (
                  <button
                    key={chip.value}
                    type="button"
                    className="chip"
                    aria-pressed={source === chip.value}
                    onClick={() => setSource(chip.value)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            )}

            {list.length === 0 ? (
              <EmptyState
                onReset={resetFilters}
                message={`No ${copy.nounMany} match these filters`}
              />
            ) : (
              <ListTable items={list} variant={variant} />
            )}
          </section>
        </div>
      </div>
    </>
  );
}

// ── Inline icons ─────────────────────────────────────────────────────────────

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
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
  );
}
