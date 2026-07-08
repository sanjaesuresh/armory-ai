/**
 * Landing — redesigned homepage (Phase 10 refresh).
 *
 * Layout:
 *   1. Hero: plain-language pitch + two CTAs + stats | briefcase brand visual
 *   2. HomePipeline: interactive 4-stage compiler demo (client component)
 *   3. Role-jump nav (#roles) — 7 role links, preserved for e2e tests
 *   4. "How it works" — 4-step explainer with StepIcon glyphs
 *   5. Category strip — browse by category chips
 *   6. "Popular this week" — featured row + compact index
 *
 * Data: async Server Component; fetches all approved setups, sorts by upvotes.
 * Graceful fallback when DB unavailable (hero + pipeline + how-it-works still render).
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
import { isDeveloperItem, detailPathFor } from '@/lib/catalog/dashboard';
import { isRegistryKind } from '@/lib/setup/types';
import type { Setup } from '@/lib/setup/types';
import HomePipeline from '@/components/HomePipeline';
import HeroBriefcase from '@/components/HeroBriefcase';
import StepIcon from '@/components/icons/StepIcon';
import DevRegistry, { type DevRegistryGroup } from '@/components/DevRegistry';

// ── Role → category accent dot ───────────────────────────────────────────────
const ROLE_DOT: Record<string, string> = {
  'marketing-manager':    'var(--accent-butter)',
  'small-business-owner': 'var(--accent-sage)',
  'customer-support':     'var(--accent-sky)',
  'recruiter':            'var(--accent-lilac)',
  'sales-rep':            'var(--accent-mint)',
  'operations':           'var(--accent-sage)',
  'founder-generalist':   'var(--accent-butter)',
};

// ── How it works steps ────────────────────────────────────────────────────────

const HOW_STEPS: {
  icon: 'browse' | 'customize' | 'test-drive' | 'export';
  title: string;
  body: string;
}[] = [
  {
    icon: 'browse',
    title: 'Pick a setup',
    body: 'Browse setups built for real roles. See exactly what each one generates before you commit.',
  },
  {
    icon: 'customize',
    title: 'Answer plain-English questions',
    body: 'Your brand name, your channels, your tone. A short form, not a configuration panel.',
  },
  {
    icon: 'test-drive',
    title: 'Test-drive it',
    body: 'Run a realistic scenario and see what changes before you trust it.',
  },
  {
    icon: 'export',
    title: 'Export to Claude',
    body: 'Copy the finished setup into your own Claude with a step-by-step walkthrough. You own it.',
  },
];

// ── Source label ──────────────────────────────────────────────────────────────

function sourceLabel(source: Setup['source']): string {
  switch (source) {
    case 'curated':      return 'reviewed';
    case 'ai-generated': return 'AI-gen';
    case 'community':    return 'community';
    case 'github':       return 'community';
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

// ── Featured flat row ─────────────────────────────────────────────────────────

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

// ── Index row ─────────────────────────────────────────────────────────────────

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

// ── Landing ───────────────────────────────────────────────────────────────────

export default async function Landing() {
  let setups: Setup[] = [];
  let total = 0;
  let setupCount = 0;
  // devGroups is populated below; empty array means section is omitted
  let devGroups: DevRegistryGroup[] = [];
  let devTotal = 0;

  try {
    const repo = createCatalogRepository();
    const all = await repo.getSetups();
    total = all.length;
    const professionalSetups = all.filter((s) => s.kind === 'setup');
    setupCount = professionalSetups.length;
    setups = [...professionalSetups].sort((a, b) => b.upvotes - a.upvotes);

    // build the developer registry groups: registry-kind + github source only
    const devItems = all.filter(
      (s) => isDeveloperItem(s) && isRegistryKind(s.kind) && s.source === 'github',
    );
    devTotal = devItems.length;

    // for each registry kind, sort by stars desc and take top 4
    const kindLabels: Record<string, string> = {
      agent: 'Agents',
      skill: 'Skills',
      harness: 'Harnesses',
    };
    for (const kind of ['agent', 'skill', 'harness'] as const) {
      const group = devItems.filter((s) => s.kind === kind);
      if (group.length === 0) continue;
      const sorted = [...group].sort((a, b) => (b.githubStars ?? 0) - (a.githubStars ?? 0));
      devGroups.push({
        kind,
        label: kindLabels[kind],
        count: group.length,
        // serializable rows — no Setup object crosses the server→client boundary
        rows: sorted.slice(0, 4).map((s) => ({
          slug: s.slug,
          name: s.name,
          tagline: s.tagline,
          stars: s.githubStars ?? null,
          href: detailPathFor(s),
        })),
      });
    }
  } catch {
    // DB unavailable — popular + developer sections omitted
  }

  // derive categories that have at least one professional setup; fall back to the
  // full browse order when the db is unavailable (setups stays empty in catch)
  const populatedCatSet = new Set(setups.map((s) => s.category));
  const stripCats =
    setups.length > 0
      ? CATEGORY_BROWSE_ORDER.filter((c) => populatedCatSet.has(c))
      : CATEGORY_BROWSE_ORDER;
  const categoryCount = stripCats.length;

  const featuredSetup = setups[0] ?? null;
  const indexSetups   = setups.slice(1, 7);
  const hasCatalog    = setups.length > 0;

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
                <span><b>{total}</b> skills + agents</span>
              )}
              <span><b>{categoryCount}</b> categories</span>
              <span><b>Curated</b> + community</span>
              <span>no account to export</span>
            </p>
          </div>

          {/* Right: briefcase brand visual — interactive animated component */}
          <div className="land-hero-visual">
            <HeroBriefcase />
          </div>

        </div>
      </header>

      {/* ── Interactive pipeline centerpiece ──────────────────────────────── */}
      <HomePipeline />

      {/* ── Role jump nav — id="roles" preserved for e2e tests ────────────── */}
      {/* Each of the 7 ROLES is an <a href="/professionals?role=<id>"> link   */}
      <nav className="land-roles-strip" id="roles" aria-label="Jump to your role">
        <div className="wrap">
          <div className="land-roles-strip-inner">
            <span className="land-roles-strip-head" aria-hidden="true">
              Jump to your role
            </span>
            <div className="land-chips">
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
          </div>
        </div>
      </nav>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="land-how" aria-labelledby="how-title">
        <div className="wrap">
          <p className="eyebrow">How it works</p>
          <h2 id="how-title" className="land-how-title">Useful in the first ten minutes</h2>
          <p className="land-how-sub">
            A setup is a ready-made set of instructions you paste into Claude to
            make it act like a specialist, no technical knowledge needed.
          </p>
          <div className="land-steps">
            {HOW_STEPS.map((step, i) => (
              <div key={step.icon} className="land-step">
                <div className="land-step-icon-wrap" aria-hidden="true">
                  <StepIcon name={step.icon} size={20} />
                </div>
                <div className="land-step-num" aria-hidden="true">{i + 1}</div>
                <h3 className="land-step-title">{step.title}</h3>
                <p className="land-step-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Developer registry section — only when github items are available ── */}
      {devGroups.length > 0 && (
        <DevRegistry groups={devGroups} total={devTotal} />
      )}

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
            {stripCats.map((cat) => (
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

            {featuredSetup && <FeaturedRow setup={featuredSetup} />}

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
