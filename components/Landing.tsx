/**
 * Landing — Phase 5 skills-first editorial layout.
 *
 * Layout:
 *   1. Compact hero: eyebrow + headline + sub + CTAs + stats | role-jump panel (#roles)
 *   2. Category strip: filled-soft chips (dot + label), no outline
 *   3. "Popular this week": one featured flat row + dense index (~6 rows) + browse-all
 *
 * Data: async Server Component; fetches all approved setups, sorts by upvotes for
 * "popular this week". Graceful fallback when DB unavailable (hero + strip still render).
 *
 * §10 compliance: dots not spines, elevation not outlines, no identical card grid.
 */

import Link from 'next/link';
import { ROLES } from '@/lib/catalog/roles';
import { createCatalogRepository } from '@/lib/catalog/repository';
import {
  getCategoryAccent,
  getCategoryLabel,
  CATEGORY_BROWSE_ORDER,
} from '@/lib/catalog/categoryUtils';
import { detailPathFor } from '@/lib/catalog/dashboard';
import type { Setup } from '@/lib/setup/types';

// ── Role → category accent dot ───────────────────────────────────────────────
// Maps each ROLES entry to its primary category accent color.
const ROLE_DOT: Record<string, string> = {
  'marketing-manager':    'var(--accent-butter)',
  'small-business-owner': 'var(--accent-sage)',
  'customer-support':     'var(--accent-sky)',
  'recruiter':            'var(--accent-lilac)',
  'sales-rep':            'var(--accent-mint)',
  'operations':           'var(--accent-sage)',
  'founder-generalist':   'var(--accent-butter)',
};

// ── Source label ─────────────────────────────────────────────────────────────

function sourceLabel(source: Setup['source']): string {
  switch (source) {
    case 'curated':      return 'reviewed';
    case 'ai-generated': return 'AI-gen';
    case 'community':    return 'community';
    case 'github':       return 'community pick';
    default:             return '';
  }
}

function srcClass(source: Setup['source']): string {
  switch (source) {
    case 'curated':      return 'idx-src-cur';
    case 'ai-generated': return 'idx-src-ai';
    case 'community':
    case 'github':       return 'idx-src-com';
    default:             return '';
  }
}

// ── Featured flat row (largest treatment — the single highlighted entry) ─────

function FeaturedRow({ setup }: { setup: Setup }) {
  const dot = getCategoryAccent(setup.category);
  const fieldCount = setup.variables.length;
  const src = sourceLabel(setup.source);
  const href = detailPathFor(setup);

  return (
    <Link
      href={href}
      className="land-feat-row"
      data-testid={`setup-card-${setup.slug}`}
    >
      <span className="land-feat-dot" style={{ background: dot }} aria-hidden="true" />
      <div>
        <div className="land-feat-name">{setup.name}</div>
        <div className="land-feat-why">{setup.tagline}</div>
      </div>
      <div className="land-feat-right">
        <span className="land-feat-stat">
          {fieldCount > 0 && (
            <><b>{fieldCount}</b> fields<br /></>
          )}
          {setup.upvotes > 0 && (
            <><b>▲{setup.upvotes}</b>{' · '}</>
          )}
          {src}
        </span>
        {/* Visual badge — aria-hidden because the parent Link is the interactive element */}
        <span className="land-feat-equip" aria-hidden="true">Equip →</span>
      </div>
    </Link>
  );
}

// ── Index row (compact, reuses browse .idx-* classes) ────────────────────────

function IndexRow({ setup }: { setup: Setup }) {
  const dot = getCategoryAccent(setup.category);
  const src = sourceLabel(setup.source);
  const sc = srcClass(setup.source);
  const fieldCount = setup.variables.length;
  const kindMap: Record<string, string> = {
    setup: 'Setup', agent: 'Agent', skill: 'Skill', harness: 'Harness',
  };
  const kd = kindMap[setup.kind] ?? 'Setup';
  const href = detailPathFor(setup);

  return (
    <div
      className="idx-row"
      role="listitem"
      data-testid={`row-${setup.slug}`}
    >
      <span className="idx-dot" style={{ background: dot }} aria-hidden="true" />
      <Link href={href} className="idx-name-link">
        {setup.name}
      </Link>
      <span className="idx-clause">{setup.tagline}</span>
      <span className="idx-rt">
        <span className="idx-kd">
          {kd}{fieldCount > 0 ? ` · ${fieldCount}f` : ''}
        </span>
        {setup.upvotes > 0 && (
          <span className="idx-up">▲{setup.upvotes}</span>
        )}
        {src && (
          <span className={`idx-src ${sc}`}>{src}</span>
        )}
      </span>
    </div>
  );
}

// ── Landing ──────────────────────────────────────────────────────────────────

export default async function Landing() {
  // Fetch + sort by popularity (upvotes) for "Popular this week".
  // Graceful fallback: if DB unavailable, setups stays empty and the popular
  // section is silently omitted (hero + category strip still render).
  let setups: Setup[] = [];
  let total = 0;          // whole catalog count (for stats line)
  let setupCount = 0;     // kind='setup' count (for popular section browse link)

  try {
    const repo = createCatalogRepository();
    const all = await repo.getSetups();
    total = all.length;
    // Landing targets professionals: filter to kind='setup' (excludes registry
    // agents/skills/harnesses which live in the /developers tab). Sort
    // descending by upvotes for "most equipped this week".
    const professionalSetups = all.filter((s) => s.kind === 'setup');
    setupCount = professionalSetups.length;
    setups = [...professionalSetups].sort((a, b) => b.upvotes - a.upvotes);
  } catch {
    // DB unavailable — popular section omitted
  }

  const featuredSetup = setups[0] ?? null;
  const indexSetups = setups.slice(1, 7);
  const hasCatalog = setups.length > 0;

  return (
    <main>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <header className="land-hero">
        <div className="wrap land-hero-grid">

          {/* Left: headline + CTAs + stats */}
          <div>
            <p className="eyebrow">Ready-made AI setups</p>
            <h1>The arsenal for your AI.</h1>
            <p className="land-sub">
              Pick a proven setup for your role, tune it with a few plain-language
              answers, and export a config you paste straight into Claude or ChatGPT.
              You bring the model. We hand you the loadout.
            </p>
            <div className="land-ctas">
              <Link href="/professionals" className="btn btn-iris">
                Browse the arsenal →
              </Link>
              <Link href="/start" className="btn btn-outline">
                Find my setup
              </Link>
            </div>
            <p className="land-stats">
              {total > 0 && (
                <span><b>{total}</b> setups</span>
              )}
              <span><b>8</b> categories</span>
              <span><b>Curated</b> + community</span>
              <span>no account to export</span>
            </p>
          </div>

          {/* Right: role jump panel — id="roles" for landing.spec.ts */}
          <aside className="land-roles" id="roles" aria-label="Jump to your role">
            <h4 className="land-roles-head">Jump to your role</h4>
            <div className="land-rgrid">
              {ROLES.map((role) => (
                <Link
                  key={role.id}
                  href={`/professionals?role=${role.id}`}
                  className="land-rchip"
                >
                  <span
                    className="land-rdot"
                    style={{ background: ROLE_DOT[role.id] ?? 'var(--accent-sand)' }}
                    aria-hidden="true"
                  />
                  {role.label}
                </Link>
              ))}
            </div>
          </aside>

        </div>
      </header>

      {/* ── Category strip ────────────────────────────────────────────────── */}
      <nav className="land-catstrip" aria-label="Browse by category">
        <div className="wrap">
          <div className="land-chips">
            <Link href="/professionals" className="land-chip">
              <span
                className="land-chipdot"
                style={{ background: 'var(--ink-soft)' }}
                aria-hidden="true"
              />
              All{total > 0 ? ` ${total}` : ''}
            </Link>
            {CATEGORY_BROWSE_ORDER.slice(0, 8).map((cat) => (
              <Link
                key={cat}
                href={`/professionals?category=${cat}`}
                className="land-chip"
              >
                <span
                  className="land-chipdot"
                  style={{ background: getCategoryAccent(cat) }}
                  aria-hidden="true"
                />
                {getCategoryLabel(cat)}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Popular this week ──────────────────────────────────────────────── */}
      {hasCatalog && (
        <section className="land-popular" aria-label="Popular this week">
          <div className="wrap">

            <div className="land-sechead">
              <h2>Popular this week</h2>
              <span className="land-metanote">most-equipped setups right now</span>
              <Link href="/professionals" className="land-browse-link">
                Browse all {setupCount} →
              </Link>
            </div>

            {/* One featured flat row */}
            {featuredSetup && <FeaturedRow setup={featuredSetup} />}

            {/* Compact index — reuses browse .idx-* classes for visual consistency */}
            {indexSetups.length > 0 && (
              <div
                className="idx-table"
                role="list"
                aria-label="Popular setups"
              >
                {indexSetups.map((setup) => (
                  <IndexRow key={setup.slug} setup={setup} />
                ))}
              </div>
            )}

            <Link href="/professionals" className="land-browse-all">
              Browse all setups →
            </Link>

          </div>
        </section>
      )}

    </main>
  );
}
