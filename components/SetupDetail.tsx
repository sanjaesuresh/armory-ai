'use client';

import Link from 'next/link';
import { useRef } from 'react';
import type { Setup } from '@/lib/setup/types';
import { getCategoryAccent, getCategoryLabel } from '@/lib/catalog/categoryUtils';
import UpvoteButton from './UpvoteButton';
import ReportSetup from './ReportSetup';
import TakedownControl from './admin/TakedownControl';
import PlugIcon from './icons/PlugIcon';

interface Props {
  setup: Setup;
  /** Authenticated user's ID; null/undefined = signed out. */
  userId?: string | null;
  /** Whether the current user has already upvoted this setup (queried server-side). */
  initialUpvoted?: boolean;
  /** Whether the current user is a moderator (checked server-side, service role). */
  isModerator?: boolean;
}

/* Arrow-left icon — aria-hidden so the link's accessible name is just its text */
const ArrowLeftIcon = () => (
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
    <path d="M19.5 12h-15M10 6.5 4.5 12 10 17.5" />
  </svg>
);

/* Check mark for the "What you'll get" checklist */
const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M2 7.5l3 3 7-8"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* Shield icon for the trust cue */
const ShieldIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3.5 5 6v6c0 4.5 3 7.6 7 8.5 4-.9 7-4 7-8.5V6z" />
    <path d="m9 12 2 2 4-4.5" />
  </svg>
);

/**
 * Renders the instruction template in a mono block with basic syntax highlighting:
 * lines starting with # become comment-colored, {{variable}} tokens become violet.
 * Display is capped at 700 chars to keep the section appropriately compact.
 */
function TemplatePreview({ template }: { template: string }) {
  const display =
    template.length > 700 ? template.slice(0, 700) + '\n…' : template;
  const parts = display.split(/({{[^}]*}})/g);

  return (
    <div
      className="det-code"
      role="region"
      aria-label="Compiled template preview"
    >
      {parts.map((part, i) => {
        if (part.startsWith('{{') && part.endsWith('}}')) {
          return (
            <span key={i} className="det-cv">
              {part}
            </span>
          );
        }
        return part.split('\n').map((line, j) => (
          <span key={`${i}-${j}`}>
            {j > 0 && '\n'}
            {line.trimStart().startsWith('#') ? (
              <span className="det-cc">{line}</span>
            ) : (
              line
            )}
          </span>
        ));
      })}
    </div>
  );
}

export default function SetupDetail({
  setup,
  userId = null,
  initialUpvoted = false,
  isModerator = false,
}: Props) {
  const scenariosRef = useRef<HTMLElement>(null);

  const accent = getCategoryAccent(setup.category);
  const catLabel = getCategoryLabel(setup.category);
  const kindLabel =
    setup.kind.charAt(0).toUpperCase() + setup.kind.slice(1);

  /* Exports-to line matches the old SpecPlateRow logic for test continuity */
  const exportsTo = setup.targets.includes('claude-app')
    ? 'Claude Projects · ChatGPT soon'
    : 'ChatGPT soon';

  const fieldCount = setup.variables.length;
  const kfCount = setup.knowledgeFiles.length;

  /* Checklist items for "What you'll get" */
  const checklistItems: { title: string; subtitle: string }[] = [
    {
      title: 'Custom instructions',
      subtitle: 'Compiled from your answers, editable before you export.',
    },
    ...setup.knowledgeFiles.map((kf) => ({
      title: kf.name,
      subtitle: kf.purpose,
    })),
    {
      title: 'Export bundle for Claude Projects',
      subtitle: 'Copy-paste blocks with a guided walkthrough.',
    },
  ];

  /* Source chip variant */
  const srcChipClass =
    {
      curated: 'det-chip--cur',
      'ai-generated': 'det-chip--ai',
      community: 'det-chip--com',
      github: 'det-chip--ghb',
    }[setup.source] ?? '';

  const srcLabel =
    {
      curated: 'Curated · reviewed',
      'ai-generated': 'AI-generated',
      community: 'Member post',
      github: 'Community pick',
    }[setup.source] ?? setup.source;

  /* data-testid for source badge (community / ai / github only; curated has none) */
  const srcTestId =
    setup.source === 'community'
      ? 'detail-badge-community'
      : setup.source === 'ai-generated'
        ? 'detail-badge-ai'
        : setup.source === 'github'
          ? 'detail-badge-github'
          : undefined;

  return (
    <main>
      <div className="wrap det-wrap">
        {/* Back link */}
        <Link
          href={setup.tier === 'advanced' ? '/developers' : '/professionals'}
          className="back-link"
        >
          <ArrowLeftIcon />
          {setup.tier === 'advanced' ? 'All tools' : 'All setups'}
        </Link>

        {/* Header: dot + category + kind/source chips + name + tagline */}
        <header className="det-head">
          <div className="det-kick">
            <span
              className="det-dot"
              style={{ background: accent }}
              aria-hidden="true"
            />
            <span className="det-cat">{catLabel}</span>
            <span className="det-chip det-chip--kind">{kindLabel}</span>
            <span
              className={`det-chip ${srcChipClass}`}
              data-testid={srcTestId}
            >
              {srcLabel}
            </span>
            {setup.tier === 'advanced' && (
              <span
                className="badge badge-advanced"
                data-testid="detail-badge-advanced"
              >
                <PlugIcon size={11} />
                Advanced
              </span>
            )}
          </div>

          <h1>{setup.name}</h1>
          <p className="det-lede">{setup.tagline || setup.description}</p>
        </header>

        {/* Two-column inspector body */}
        <div className="det-body">
          {/* ── Content column ── */}
          <div>
            {/* What it is */}
            <section className="det-blk det-prose">
              <h2>What it is</h2>
              {setup.tagline && <p>{setup.tagline}</p>}
              <p>{setup.description}</p>
              {setup.tier === 'advanced' && (
                <div
                  className="advanced-expectations"
                  data-testid="advanced-expectations"
                >
                  <p>
                    This setup uses tools you&apos;ll connect yourself — we&apos;ll
                    walk you through it.
                  </p>
                </div>
              )}
            </section>

            {/* What you'll get — checklist */}
            <section className="det-blk">
              <h2>What you&apos;ll get</h2>
              <div className="det-get">
                {checklistItems.map((item) => (
                  <div key={item.title} className="det-g">
                    <CheckIcon />
                    <div className="det-gt">
                      {item.title}
                      <span>{item.subtitle}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Try it on — scenario rows (omitted when empty) */}
            {setup.scenarios.length > 0 && (
              <section
                className="det-blk det-scn"
                ref={scenariosRef}
                id="det-scenarios"
              >
                <h2>Try it on</h2>
                {setup.scenarios.map((scenario) => (
                  <div key={scenario.id} className="det-s">
                    <div className="det-q">
                      {scenario.title}
                      <span className="det-qmono">scenario · built in</span>
                    </div>
                    <div className="det-a">{scenario.expectedBehavior}</div>
                  </div>
                ))}
              </section>
            )}

            {/* Compiled preview (omitted when no template) */}
            {setup.instructionTemplate && (
              <section className="det-blk">
                <h2>Compiled preview</h2>
                <TemplatePreview template={setup.instructionTemplate} />
              </section>
            )}

            {/* Report + moderator takedown */}
            <div style={{ marginTop: '12px' }}>
              <ReportSetup setupId={setup.id} userId={userId} />
            </div>

            {isModerator &&
              (setup.source === 'community' ||
                setup.source === 'ai-generated') &&
              setup.reviewStatus === 'approved' && (
                <div
                  style={{
                    marginTop: '20px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--hairline)',
                  }}
                >
                  <TakedownControl setupId={setup.id} />
                </div>
              )}
          </div>

          {/* ── Sticky sidebar ── */}
          <aside className="det-side">
            {/* Primary actions */}
            <div className="det-actions">
              <Link
                href={`/setup/${setup.slug}/customize`}
                className="btn btn-iris"
              >
                Equip this setup →
              </Link>
              {setup.scenarios.length > 0 && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() =>
                    scenariosRef.current?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    })
                  }
                >
                  Test-drive first
                </button>
              )}
            </div>

            {/* Spec definition list — hairline rows, no boxes */}
            <div
              role="list"
              aria-label="Setup specifications"
              className="det-spec"
            >
              <div role="listitem" className="det-sr">
                <span className="det-sk">Exports to</span>
                <span className="det-sv">{exportsTo}</span>
              </div>
              {fieldCount > 0 && (
                <div role="listitem" className="det-sr">
                  <span className="det-sk">You answer</span>
                  <span className="det-sv">
                    {fieldCount} field{fieldCount === 1 ? '' : 's'}
                  </span>
                </div>
              )}
              {kfCount > 0 && (
                <div role="listitem" className="det-sr">
                  <span className="det-sk">Knowledge files</span>
                  <span className="det-sv">{kfCount}</span>
                </div>
              )}
              <div role="listitem" className="det-sr">
                <span className="det-sk">Setup time</span>
                <span className="det-sv">About 5 minutes</span>
              </div>
            </div>

            {/* Trust cue — curated setups only */}
            {setup.source === 'curated' && (
              <div className="det-trust">
                <ShieldIcon />
                Reviewed by Armory before listing.
              </div>
            )}

            {/* Community author attribution */}
            {setup.source === 'community' && setup.author && (
              <div className="det-trust" data-testid="detail-author">
                by{' '}
                {setup.author.length > 24
                  ? `${setup.author.substring(0, 24)}…`
                  : setup.author}
              </div>
            )}

            {/* Upvote */}
            <div className="det-vote">
              <UpvoteButton
                setupId={setup.id}
                initialCount={setup.upvotes}
                initialUpvoted={initialUpvoted}
                userId={userId}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
