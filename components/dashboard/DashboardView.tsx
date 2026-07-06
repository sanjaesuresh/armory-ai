'use client';

import { useId, useMemo, useState } from 'react';
import type React from 'react';
import Link from 'next/link';
import type { Setup, SetupKind, Category } from '@/lib/setup/types';
import {
  approvedShelf,
  popularShelf,
  filterList,
  sortList,
  type SortKey,
} from '@/lib/catalog/dashboard';
import { CATEGORY_BROWSE_ORDER } from '@/lib/catalog/categoryUtils';
import SetupCard from '../SetupCard';
import EmptyState from '../EmptyState';
import CategoryChips from '../CategoryChips';
import GoalChips from '../GoalChips';
import ShelfRow from './ShelfRow';
import ListTable from './ListTable';
import CategoryCard from '../CategoryCard';

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

// ── Per-variant copy ──────────────────────────────────────────────────────────
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
    browseEyebrow: 'Browse by category',
    browseH2: 'Find your setup',
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
    browseEyebrow: 'Browse by kind',
    browseH2: 'Find the right tool',
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

// ── Kind metadata for the developer browse zone ───────────────────────────────
// Tint + accent per brief: agent→sage, skill→sky, harness→butter, setup→lilac.
const KIND_META: Array<{
  kind: SetupKind;
  label: string;
  icon: string;
  tint: string;
  accent: string;
  blurb: string;
}> = [
  {
    kind: 'agent',
    label: 'Agents',
    icon: '🤖',
    tint: 'tint-sage',
    accent: 'var(--accent-sage)',
    blurb: 'Autonomous task runners for Claude Code',
  },
  {
    kind: 'skill',
    label: 'Skills',
    icon: '⚡',
    tint: 'tint-sky',
    accent: 'var(--accent-sky)',
    blurb: 'Drop-in skills for the Claude app',
  },
  {
    kind: 'harness',
    label: 'Harnesses',
    icon: '🧪',
    tint: 'tint-butter',
    accent: 'var(--accent-butter)',
    blurb: 'Test frameworks and evaluation wrappers',
  },
  {
    kind: 'setup',
    label: 'Setups',
    icon: '📋',
    tint: 'tint-lilac',
    accent: 'var(--accent-lilac)',
    blurb: 'Prompt and config bundles',
  },
];

/** Smooth-scrolls to the full-list section, respecting prefers-reduced-motion. */
function scrollToList() {
  if (typeof window === 'undefined') return;
  const el = document.getElementById('full-list');
  if (!el) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}

/**
 * Kind card — same `.category-card` markup as CategoryCard but typed for
 * SetupKind values. Keyboard-operable native button with aria-pressed state.
 * Accent edge driven by --cat-accent CSS var (same pattern as CategoryCard).
 */
function KindCard({
  label,
  icon,
  tint,
  accent,
  blurb,
  count,
  active,
  onClick,
}: {
  kind: SetupKind;
  label: string;
  icon: string;
  tint: string;
  accent: string;
  blurb: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  const countLabel = `${count} ${count === 1 ? 'tool' : 'tools'}`;
  return (
    <button
      type="button"
      className={`category-card${active ? ' is-active' : ''}`}
      style={{ '--cat-accent': accent } as React.CSSProperties}
      onClick={onClick}
      aria-pressed={active}
    >
      {/* Icon chip: tint background + kind emoji */}
      <span className={`cat-chip ${tint}`} aria-hidden="true">
        {icon}
      </span>
      <strong>{label}</strong>
      <span className="cat-count">{countLabel}</span>
      <p className="cat-blurb">{blurb}</p>
    </button>
  );
}

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

  // ── Browse zone — category counts (professionals) ──────────────────────────
  const categoryCounts = useMemo<Record<string, number>>(() => {
    if (isDevelopers) return {};
    const counts: Record<string, number> = {};
    for (const s of items) {
      counts[s.category] = (counts[s.category] ?? 0) + 1;
    }
    return counts;
  }, [items, isDevelopers]);

  // Categories present in items, ordered by CATEGORY_BROWSE_ORDER
  const browseCategories = useMemo<Category[]>(
    () =>
      isDevelopers
        ? []
        : CATEGORY_BROWSE_ORDER.filter((cat) => (categoryCounts[cat] ?? 0) > 0),
    [isDevelopers, categoryCounts],
  );

  // ── Browse zone — kind counts (developers) ─────────────────────────────────
  const kindCounts = useMemo<Record<string, number>>(() => {
    if (!isDevelopers) return {};
    const counts: Record<string, number> = {};
    for (const s of items) {
      counts[s.kind] = (counts[s.kind] ?? 0) + 1;
    }
    return counts;
  }, [items, isDevelopers]);

  // Kinds present in items, in KIND_META display order
  const browseKinds = useMemo(
    () => KIND_META.filter((k) => (kindCounts[k.kind] ?? 0) > 0),
    [kindCounts],
  );

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

  function handleBrowseClick(value: string) {
    setFilter(value);
    scrollToList();
  }

  const showBrowseZone =
    (!isDevelopers && browseCategories.length > 0) ||
    (isDevelopers && browseKinds.length > 0);

  return (
    <>
      {/* ── Header strip (raised zone) ──────────────────────────────── */}
      <div className="dash-raised-zone">
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
      </div>

      {/* ── Optional goal-selection chips (professionals) ─────────────── */}
      {goalChips && <GoalChips role={goalChips.role} cat={goalChips.cat} />}

      {/* ── Recommender strip (tinted zone) ──────────────────────────── */}
      {rolePicks && rolePicks.items.length > 0 && (
        <section
          data-testid={rolePicks.fallback ? 'fallback-section' : 'recommended-section'}
          className="dash-tint-zone dash-zone"
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

      {/* ── Browse by category / kind (raised zone) ───────────────────── */}
      {showBrowseZone && (
        <div className="dash-raised-zone dash-zone">
          <div className="section-head">
            <span className="eyebrow">{copy.browseEyebrow}</span>
            <h2>{copy.browseH2}</h2>
          </div>
          <div className="category-grid">
            {isDevelopers
              ? browseKinds.map((k) => (
                  <KindCard
                    key={k.kind}
                    kind={k.kind}
                    label={k.label}
                    icon={k.icon}
                    tint={k.tint}
                    accent={k.accent}
                    blurb={k.blurb}
                    count={kindCounts[k.kind] ?? 0}
                    active={filter === k.kind}
                    onClick={() => handleBrowseClick(k.kind)}
                  />
                ))
              : browseCategories.map((cat) => (
                  <CategoryCard
                    key={cat}
                    category={cat}
                    count={categoryCounts[cat] ?? 0}
                    active={filter === cat}
                    onClick={() => handleBrowseClick(cat)}
                  />
                ))}
          </div>
        </div>
      )}

      {/* ── Armory Approved shelf (tinted zone) ───────────────────────── */}
      {approved.length > 0 && (
        <section data-testid="shelf-approved" className="dash-tint-zone dash-zone">
          <div className="shelf-head">
            <h2>Armory Approved</h2>
            <span className="shelf-link muted">Reviewed by the Armory team</span>
          </div>
          <ShelfRow
            items={approved}
            ariaLabel={`Armory Approved ${copy.nounMany}`}
            testId="shelf-approved-row"
            variant="compact"
          />
        </section>
      )}

      {/* ── Most Popular shelf (raised zone) ──────────────────────────── */}
      {popular.length > 0 && (
        <section data-testid="shelf-popular" className="dash-raised-zone dash-zone">
          <div className="shelf-head">
            <h2>Most Popular</h2>
            <span className="shelf-link muted">Ranked by upvotes</span>
          </div>
          <ShelfRow
            items={popular}
            ariaLabel={`Most popular ${copy.nounMany}`}
            testId="shelf-popular-row"
            variant="compact"
            ranked
          />
        </section>
      )}

      {/* ── Full list (canvas) ────────────────────────────────────────── */}
      <section id="full-list" className="dash-zone">
        <div className="section-head">
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
      </section>
    </>
  );
}

// ── Inline icons (line style, aria-hidden) ────────────────────────────────────

function PlusIcon() {
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
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function SearchIcon() {
  return (
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
  );
}
