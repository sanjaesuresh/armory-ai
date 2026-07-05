'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Setup, SetupKind } from '@/lib/setup/types';
import {
  approvedShelf,
  popularShelf,
  filterList,
  sortList,
  type SortKey,
} from '@/lib/catalog/dashboard';
import SetupCard from '../SetupCard';
import EmptyState from '../EmptyState';
import CategoryChips from '../CategoryChips';
import GoalChips from '../GoalChips';
import ShelfRow from './ShelfRow';
import ListTable from './ListTable';

type Variant = 'developers' | 'professionals';

interface RolePicks {
  items: Setup[];
  whyLabels: Record<string, string[]>;
  fallback?: boolean;
}

interface DashboardViewProps {
  items: Setup[];
  variant: Variant;
  /** Recommender strip (professionals only) — computed server-side from ?role=. */
  rolePicks?: RolePicks;
  /** When present, render the optional goal-selection chips (professionals). */
  goalChips?: { role: string; cat?: string };
  /** Category filter from ?cat= (professionals). */
  initialCat?: string;
  /** Kind filter (developers). */
  initialKind?: string;
}

// ── Per-variant copy (shelf headings + "Post your own" are locked verbatim) ──
const COPY = {
  professionals: {
    eyebrow: 'Setup library',
    heading: 'Professionals',
    intro:
      'Ready-made setups for real roles. Pick one, answer a few plain-English questions, and paste it into your own Claude — no prompt engineering required.',
    ctaLabel: 'Build a setup',
    ctaHref: '/build',
    ctaClass: 'btn btn-outline',
    listHeading: 'All setups',
    searchLabel: 'Search setups',
    searchPlaceholder: 'Search setups — try "email" or "brand"',
    nounOne: 'setup',
    nounMany: 'setups',
  },
  developers: {
    eyebrow: 'Developer registry',
    heading: 'Developers',
    intro:
      'Agents, skills, and harnesses posted by developers — drop-in tools for Claude Code and the Claude app. Browse, upvote, and post your own.',
    ctaLabel: 'Post your own',
    ctaHref: '/build',
    ctaClass: 'btn btn-primary',
    listHeading: 'All tools',
    searchLabel: 'Search the registry',
    searchPlaceholder: 'Search tools — try "review" or "commit"',
    nounOne: 'tool',
    nounMany: 'tools',
  },
} as const;

// Developer kind chips → filterList kind value ('all' = no kind filter).
const KIND_CHIPS: Array<{ label: string; value: 'all' | SetupKind }> = [
  { label: 'All', value: 'all' },
  { label: 'Agents', value: 'agent' },
  { label: 'Skills', value: 'skill' },
  { label: 'Harnesses', value: 'harness' },
  { label: 'Setups', value: 'setup' },
];

// Developer source chips → filterList source value ('all' = no source filter).
type SourceFilterValue = 'all' | 'github' | 'community' | 'curated' | 'ai-generated';
const SOURCE_CHIPS: Array<{ label: string; value: SourceFilterValue }> = [
  { label: 'All', value: 'all' },
  { label: 'Community pick', value: 'github' },
  { label: 'Member post', value: 'community' },
  { label: 'Curated', value: 'curated' },
];

const SORT_OPTIONS: Array<{ label: string; value: SortKey }> = [
  { label: 'Most popular', value: 'popularity' },
  { label: 'Most upvoted', value: 'upvotes' },
  { label: 'Recently updated', value: 'recency' },
];

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

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(
    isDevelopers ? (initialKind ?? 'all') : (initialCat ?? 'All'),
  );
  const [source, setSource] = useState<SourceFilterValue>('all');
  const [sortKey, setSortKey] = useState<SortKey>('popularity');

  // ── Shelves (over the full, unfiltered item set) ───────────────────────────
  const approved = useMemo(() => approvedShelf(items, 6), [items]);
  const popular = useMemo(
    () => popularShelf(items, 6, new Set(approved.map((s) => s.id))),
    [items, approved],
  );

  // ── Category chips (professionals) derived from item categories ────────────
  const categories = useMemo(() => {
    if (isDevelopers) return [];
    const seen = new Set<string>();
    for (const s of items) seen.add(s.category);
    return ['All', ...Array.from(seen)];
  }, [items, isDevelopers]);

  // ── Filtered + sorted list ─────────────────────────────────────────────────
  const list = useMemo(() => {
    const query = search.trim() || undefined;
    const criteria = isDevelopers
      ? {
          query,
          kind: filter === 'all' ? undefined : (filter as SetupKind),
          source: source === 'all' ? undefined : (source as Setup['source']),
        }
      : { query, category: filter === 'All' ? undefined : filter };
    return sortList(filterList(items, criteria), sortKey);
  }, [items, isDevelopers, filter, source, search, sortKey]);

  const countLabel =
    list.length === 1 ? `1 ${copy.nounOne}` : `${list.length} ${copy.nounMany}`;

  function resetFilters() {
    setSearch('');
    setFilter(isDevelopers ? 'all' : 'All');
    if (isDevelopers) setSource('all');
  }

  return (
    <>
      {/* ── Header strip ─────────────────────────────────────────────── */}
      <div className="dash-head">
        <div>
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1>{copy.heading}</h1>
          <p className="muted">{copy.intro}</p>
        </div>
        <Link className={copy.ctaClass} href={copy.ctaHref}>
          <PlusIcon />
          {copy.ctaLabel}
        </Link>
      </div>

      {/* ── Optional goal-selection chips (professionals) ────────────── */}
      {goalChips && <GoalChips role={goalChips.role} cat={goalChips.cat} />}

      {/* ── Recommender strip (professionals, ?role=) ────────────────── */}
      {rolePicks && rolePicks.items.length > 0 && (
        <section
          data-testid={rolePicks.fallback ? 'fallback-section' : 'recommended-section'}
          style={{ marginTop: '8px' }}
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

      {/* ── Armory Approved shelf ────────────────────────────────────── */}
      {approved.length > 0 && (
        <section data-testid="shelf-approved">
          <div className="shelf-head">
            <h2>Armory Approved</h2>
            <span className="shelf-link muted">Reviewed by the Armory team</span>
          </div>
          <ShelfRow
            items={approved}
            ariaLabel={`Armory Approved ${copy.nounMany}`}
            testId="shelf-approved-row"
          />
        </section>
      )}

      {/* ── Most Popular shelf ───────────────────────────────────────── */}
      {popular.length > 0 && (
        <section data-testid="shelf-popular">
          <div className="shelf-head">
            <h2>Most Popular</h2>
            <span className="shelf-link muted">Ranked by upvotes</span>
          </div>
          <ShelfRow
            items={popular}
            ariaLabel={`Most popular ${copy.nounMany}`}
            testId="shelf-popular-row"
          />
        </section>
      )}

      {/* ── Full list ────────────────────────────────────────────────── */}
      <div className="shelf-head" style={{ marginBottom: '8px' }}>
        <h2>{copy.listHeading}</h2>
      </div>

      <div className="registry-controls">
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

        <div className="registry-controls-right">
          <p className="result-count" aria-live="polite" data-testid="result-count">
            {countLabel}
          </p>
          <label className="dash-sort" htmlFor={sortId}>
            <span>Sort by</span>
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

      {isDevelopers ? (
        <>
          <div className="filter-row" role="group" aria-label="Filter by kind">
            {KIND_CHIPS.map((chip) => (
              <button
                key={chip.value}
                type="button"
                className="chip"
                aria-pressed={filter === chip.value}
                onClick={() => setFilter(chip.value)}
              >
                {chip.label}
              </button>
            ))}
          </div>
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
        </>
      ) : (
        <CategoryChips
          categories={categories}
          activeCat={filter}
          onChange={setFilter}
        />
      )}

      {list.length === 0 ? (
        <EmptyState
          onReset={resetFilters}
          message={`No ${copy.nounMany} match these filters`}
        />
      ) : (
        <ListTable items={list} variant={variant} />
      )}
    </>
  );
}

// ── Inline icons (line style, aria-hidden) ────────────────────────────────────

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15.3 15.3 4.7 4.7" />
    </svg>
  );
}
