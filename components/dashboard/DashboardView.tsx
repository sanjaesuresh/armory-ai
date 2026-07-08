'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Setup, SetupKind, Category } from '@/lib/setup/types';
import {
  approvedShelf,
  popularShelf,
  filterList,
  sortList,
  type SortKey,
} from '@/lib/catalog/dashboard';
import { getChipTags } from '@/lib/catalog/functions';
import {
  CATEGORY_BROWSE_ORDER,
  getCategoryAccent,
  getCategoryLabel,
} from '@/lib/catalog/categoryUtils';
import EmptyState from '../EmptyState';
import GoalChips from '../GoalChips';
import ListTable from './ListTable';
import SetupCard from '../SetupCard';
import ApprovedHero from './ApprovedHero';
import PopularShelf from './PopularShelf';
import CategoryCards from './CategoryCards';
import KindCards from './KindCards';
import FunctionChips from './FunctionChips';

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
    searchPlaceholder: 'Search setups, try "email" or "brand"',
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
    searchPlaceholder: 'Search tools, try "review" or "commit"',
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

// ── Source filter chips (developers + professionals, below search) ───────────

type SourceFilterValue = 'all' | 'github' | 'community' | 'curated' | 'ai-generated';
const SOURCE_CHIPS: Array<{ label: string; value: SourceFilterValue }> = [
  { label: 'All',          value: 'all' },
  { label: 'Community',    value: 'github' },
  { label: 'Member post',  value: 'community' },
  { label: 'Curated',      value: 'curated' },
  { label: 'AI',           value: 'ai-generated' },
];

const SORT_OPTIONS: Array<{ label: string; value: SortKey }> = [
  { label: 'Most popular',     value: 'popularity' },
  { label: 'Most upvoted',     value: 'upvotes' },
  { label: 'Recently updated', value: 'recency' },
];

// tracks the same 720px breakpoint the CSS uses to swap the rail for a sheet,
// so sort/source/function controls can render inline on desktop but move into
// the drawer on mobile as a single DOM instance (no duplicate groups/ids).
// SSR-safe: false on the server + first client render, then corrected on mount.
function useIsMobile(query = '(max-width: 720px)'): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    // guard: jsdom (and any non-browser env) has no matchMedia — stay desktop
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(query);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return isMobile;
}

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
  const railId = useId();

  // mobile filter drawer: the facet rail collapses behind a "Filters" button
  // below 720px so results get the full screen. drawerOpen only ever flips true
  // on mobile (the trigger is display:none on desktop), so the dialog/scrim
  // semantics never apply to the desktop sidebar.
  const [drawerOpen, setDrawerOpen] = useState(false);
  const filtersBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const isMobile = useIsMobile();

  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState(
    isDevelopers ? (initialKind ?? 'all') : (initialCat ?? 'All'),
  );
  const [source, setSource]   = useState<SourceFilterValue>('all');
  const [sortKey, setSortKey] = useState<SortKey>('popularity');
  const [fnFilter, setFnFilter] = useState<string | null>(null);
  // industry is professionals-only; null means "all industries"
  const [indFilter, setIndFilter] = useState<string | null>(null);

  // ── Featured shelves (over the full, unfiltered set) ─────────────────────

  const approved = useMemo(() => approvedShelf(items, 1), [items]);

  // Cap at 7: hero can come from popular[0] when approved is empty,
  // leaving up to 6 items for the PopularShelf.
  const popular = useMemo(
    () => popularShelf(items, 7, new Set(approved.map((s) => s.id))),
    [items, approved],
  );

  // Hero: prefer approved[0]; fall back to popular[0].
  const heroFromApproved = approved[0] != null;
  const heroSetup = approved[0] ?? popular[0] ?? null;

  // Popular shelf items: exclude the hero if it came from popular.
  const popularItems = heroFromApproved ? popular : popular.slice(1);

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

  // ── Industry facet (professionals) ─────────────────────────────────────
  // derived from actual item data; only non-null industries are surfaced
  const industries = useMemo<Array<{ name: string; count: number }>>(() => {
    if (isDevelopers) return [];
    const counts: Record<string, number> = {};
    for (const s of items) {
      if (s.industry) counts[s.industry] = (counts[s.industry] ?? 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, isDevelopers]);

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
      : {
          query,
          category: filter === 'All' ? undefined : filter,
          // source filter applies to professionals too when a chip is active
          source: source === 'all' ? undefined : (source as Setup['source']),
        };

    let base = filterList(items, criteria);

    // Function-chip filter (developers only)
    if (isDevelopers && fnFilter) {
      const tags = getChipTags(fnFilter);
      base = base.filter((s) => s.tags.some((t) => tags.has(t)));
    }

    // industry filter AND-ed with category (professionals only)
    if (!isDevelopers && indFilter) {
      base = base.filter((s) => s.industry === indFilter);
    }

    return sortList(base, sortKey);
  }, [items, isDevelopers, filter, source, search, sortKey, fnFilter, indFilter]);

  const countLabel =
    list.length === 1
      ? `1 ${copy.nounOne}`
      : `${list.length} ${copy.nounMany}`;

  // any active filter/search collapses the editorial + card shelves so the
  // filtered list surfaces immediately instead of hiding below the fold
  const hasActiveFilter = isDevelopers
    ? filter !== 'all' || source !== 'all' || fnFilter !== null || search.trim() !== ''
    : filter !== 'All' || source !== 'all' || indFilter !== null || search.trim() !== '';

  function resetFilters() {
    setSearch('');
    setFilter(isDevelopers ? 'all' : 'All');
    setSource('all');
    setIndFilter(null);
    if (isDevelopers) {
      setFnFilter(null);
    }
  }

  const totalCount = items.length;

  // count of active facet filters, shown as a badge on the mobile Filters button
  // (search is a separate control and is deliberately excluded)
  const activeFilterCount =
    (isDevelopers
      ? (filter !== 'all' ? 1 : 0) + (fnFilter ? 1 : 0)
      : (filter !== 'All' ? 1 : 0) + (indFilter ? 1 : 0)) +
    (source !== 'all' ? 1 : 0);

  // drawer plumbing: lock body scroll, move focus in, trap Tab, close on Escape,
  // and return focus to the trigger on close. keyed on drawerOpen so it only
  // engages while the sheet is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const drawer = drawerRef.current;
    const trigger = filtersBtnRef.current;
    document.body.style.overflow = 'hidden';
    // focus the first focusable control inside the sheet
    const focusables = () =>
      drawer
        ? Array.from(
            drawer.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            ),
          ).filter((el) => !el.hasAttribute('disabled'))
        : [];
    focusables()[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setDrawerOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const els = focusables();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      trigger?.focus();
    };
  }, [drawerOpen]);

  // if the viewport grows back to desktop while the sheet is open, close it so
  // the controls return to their inline positions cleanly
  useEffect(() => {
    if (!isMobile) setDrawerOpen(false);
  }, [isMobile]);

  // filter controls that live inline on desktop but move into the drawer on
  // mobile — rendered in exactly one place per breakpoint (single DOM instance)
  const sortControl = (
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
  );

  const sourceChips = (
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
  );

  const functionChips = isDevelopers ? (
    <FunctionChips items={items} activeChip={fnFilter} onSelect={setFnFilter} />
  ) : null;

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
              ? "Nothing tailored yet, here's what's popular"
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

        {/* scrim behind the mobile filter sheet (only rendered when open) */}
        {drawerOpen && (
          <div className="browse-scrim" onClick={closeDrawer} aria-hidden="true" />
        )}

        {/* ── Left rail (facet filters; a bottom sheet below 720px) ──────── */}
        <aside
          id={railId}
          ref={drawerRef}
          className={`browse-rail${drawerOpen ? ' is-open' : ''}`}
          aria-label="Browse filters"
          role={drawerOpen ? 'dialog' : undefined}
          aria-modal={drawerOpen ? true : undefined}
        >
          {/* drawer header — visible only on mobile, inside the sheet */}
          <div className="browse-rail-drawerhead">
            <span>Filters</span>
            <button
              type="button"
              className="browse-rail-done"
              onClick={closeDrawer}
            >
              Done
            </button>
          </div>

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

              {/* industry rail — only when items actually carry industry values */}
              {industries.length > 0 && (
                <>
                  <div className="browse-rail-sep" />
                  <p className="browse-rail-label">Industry</p>
                  <div role="group" aria-label="Filter by industry">
                    {industries.map(({ name, count }) => (
                      <button
                        key={name}
                        type="button"
                        className="rail-filter-item"
                        aria-pressed={indFilter === name}
                        aria-label={name}
                        onClick={() => setIndFilter(indFilter === name ? null : name)}
                      >
                        <span
                          className="rail-filter-dot"
                          style={{ background: 'var(--ink-soft)' }}
                          aria-hidden="true"
                        />
                        <span aria-hidden="true">{name}</span>
                        <span className="rail-filter-n" aria-hidden="true">{count}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* Sort + function + source move into the sheet on mobile so the
              inline controls don't clutter the results column */}
          {isMobile && (
            <>
              <div className="browse-rail-sep" />
              <p className="browse-rail-label">Sort</p>
              <div className="drawer-sort">{sortControl}</div>
              {functionChips && (
                <>
                  <div className="browse-rail-sep" />
                  <p className="browse-rail-label">Function</p>
                  {functionChips}
                </>
              )}
              <div className="browse-rail-sep" />
              <p className="browse-rail-label">Source</p>
              {sourceChips}
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

          {/* ── "Most equipped this week" editorial zone ────────────────── */}
          {!hasActiveFilter && (heroSetup || popularItems.length > 0) && (
            <>
              <div className="featured-leadhead">
                <h2>Most equipped this week</h2>
                <span className="feat-meta-note">what people are actually equipping</span>
              </div>

              {/* Approved hero card */}
              {heroSetup && (
                <div data-testid="shelf-approved">
                  <ApprovedHero
                    setup={heroSetup}
                    variant={variant}
                    isApproved={heroFromApproved}
                  />
                </div>
              )}

              {/* Popular ranked shelf */}
              {popularItems.length > 0 && (
                <div data-testid="shelf-popular">
                  <PopularShelf items={popularItems} variant={variant} />
                </div>
              )}
            </>
          )}

          {/* ── Category cards (professionals) ──────────────────────────── */}
          {!isDevelopers && !hasActiveFilter && browseCategories.length > 0 && (
            <CategoryCards
              categories={browseCategories}
              counts={categoryCounts}
              activeFilter={filter}
              onSelect={setFilter}
            />
          )}

          {/* ── Kind cards (developers) ─────────────────────────────────── */}
          {isDevelopers && !hasActiveFilter && (
            <KindCards
              counts={kindCounts}
              activeFilter={filter}
              onSelect={setFilter}
            />
          )}

          {/* ── Index: search + sort + filter + rows ───────────────────── */}
          <section id="full-list" className="idx-section">

            <div className="idx-head">
              <h2>{copy.listHeading}</h2>
              <span className="idx-count">{countLabel}</span>
              {!isMobile && <div className="idx-sort">{sortControl}</div>}
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

              {/* mobile-only trigger for the facet drawer (CSS-hidden on desktop) */}
              <button
                type="button"
                className="filters-toggle"
                ref={filtersBtnRef}
                aria-haspopup="dialog"
                aria-expanded={drawerOpen}
                aria-controls={railId}
                onClick={() => setDrawerOpen(true)}
              >
                <FilterIcon />
                Filters
                {activeFilterCount > 0 && (
                  <span className="filters-toggle-badge" aria-hidden="true">
                    {activeFilterCount}
                  </span>
                )}
                {activeFilterCount > 0 && (
                  <span className="sr-only">, {activeFilterCount} active</span>
                )}
              </button>

              <p
                className="result-count"
                aria-live="polite"
                data-testid="result-count"
              >
                {countLabel}
              </p>
            </div>

            {/* Function + source chips render inline on desktop; on mobile they
                live in the filter drawer instead (see the aside above) */}
            {!isMobile && functionChips}
            {!isMobile && sourceChips}

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

function FilterIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 5h18M6 12h12M10 19h4" />
    </svg>
  );
}
