'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { recordExportEvent } from '@/lib/analytics/exportEvents';
import type { ReactNode } from 'react';
import Link from 'next/link';
import WalkRail, { type RailStep } from './WalkRail';
import WalkPanel, { type PanelStep } from './WalkPanel';
import { marketingManagerSetup } from '@/data/curated/marketing-manager';
import type { Setup } from '@/lib/setup/types';

// ─── Setup lookup (expand as more curated setups ship) ────────────────────────

const SETUP_MAP: Record<string, Setup> = {
  'marketing-manager': marketingManagerSetup,
};

// ─── Number-word map for step count labels ────────────────────────────────────

const NUM_WORDS: Record<number, string> = {
  1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six',
};

// ─── Step content builder ─────────────────────────────────────────────────────

function buildSteps(
  brandName: string,
  hasKnowledgeFiles: boolean,
  starterFileName: string,
): PanelStep[] {
  const steps: PanelStep[] = [
    {
      label: 'Create a new Project',
      heading: 'Create a new Project',
      body: (
        <>
          Open Claude and look for <strong style={{ color: 'var(--ink)' }}>Projects</strong> in
          the sidebar. Click{' '}
          <strong style={{ color: 'var(--ink)' }}>New Project</strong> — that's the button
          highlighted on the right.
        </>
      ) as ReactNode,
      imageKey: 'create-project',
    },
    {
      label: 'Name your Project',
      heading: 'Name your Project',
      body: (
        <>
          Give it a name you'll recognise — we suggest{' '}
          <strong style={{ color: 'var(--ink)' }}>
            {brandName} — Marketing Manager
          </strong>
          . The name is just for you; it doesn't change how Claude behaves.
        </>
      ) as ReactNode,
      imageKey: 'name-project',
    },
    {
      label: 'Paste custom instructions',
      heading: 'Paste custom instructions',
      body: (
        <>
          In your new Project, open{' '}
          <strong style={{ color: 'var(--ink)' }}>Set custom instructions</strong> and paste the{' '}
          <strong style={{ color: 'var(--ink)' }}>custom-instructions.md</strong> block from your
          export page. This is the heart of your setup.
        </>
      ) as ReactNode,
      imageKey: 'paste-instructions',
    },
  ];

  if (hasKnowledgeFiles) {
    steps.push({
      label: 'Upload knowledge files',
      heading: 'Upload knowledge files',
      body: (
        <>
          Under <strong style={{ color: 'var(--ink)' }}>Project knowledge</strong>, upload{' '}
          <strong style={{ color: 'var(--ink)' }}>{starterFileName}</strong> — and your own
          voice guide if you attached one. Claude reads these before every answer.
        </>
      ) as ReactNode,
      imageKey: 'upload-knowledge-file',
    });
  }

  steps.push({
    label: "You're set up",
    heading: "You're set up",
    body: (
      <>
        Start any conversation inside the Project — Claude now works as your {brandName} marketing
        manager. Try a campaign brief or a piece of copy and see the difference.
      </>
    ) as ReactNode,
    imageKey: 'project-ready',
  });

  return steps;
}

// ─── Load state ───────────────────────────────────────────────────────────────

type LoadState = 'loading' | 'missing' | 'ready';

// ─── Component ────────────────────────────────────────────────────────────────

export default function InstallView() {
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [slug, setSlug] = useState('');
  const [brandName, setBrandName] = useState('');
  const [hasKnowledgeFiles, setHasKnowledgeFiles] = useState(true);
  const [starterFileName, setStarterFileName] = useState('knowledge-file.md');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Heading ref — focus is moved here on step change for assistive tech.
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prevIndexRef = useRef(0);

  // Analytics: track plan choice from sessionStorage and guard done-event to once.
  const planChoiceRef = useRef<'pro' | 'free' | null>(null);
  const doneFiredRef = useRef(false);

  // ── Read sessionStorage on mount ────────────────────────────────────────
  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = sessionStorage.getItem('armory-export-state');
    } catch {
      setLoadState('missing');
      return;
    }

    if (!raw) {
      setLoadState('missing');
      return;
    }

    let parsed: {
      slug?: unknown;
      answers?: Record<string, unknown>;
      attachments?: Record<string, string>;
      planChoice?: unknown;
    };
    try {
      parsed = JSON.parse(raw) as typeof parsed;
    } catch {
      setLoadState('missing');
      return;
    }

    const { slug: parsedSlug, answers = {}, planChoice: parsedPlanChoice } = parsed;

    // Capture plan choice for the done-event analytics.
    if (parsedPlanChoice === 'pro' || parsedPlanChoice === 'free') {
      planChoiceRef.current = parsedPlanChoice;
    }

    if (typeof parsedSlug !== 'string' || !parsedSlug) {
      setLoadState('missing');
      return;
    }

    const brand =
      typeof answers.brandName === 'string' && answers.brandName.trim()
        ? answers.brandName.trim()
        : 'Your brand';

    const setup = SETUP_MAP[parsedSlug];
    const knowledgeFiles = setup ? setup.knowledgeFiles.length > 0 : true;
    const firstFileName = setup?.knowledgeFiles[0]?.name ?? 'knowledge-file.md';

    setSlug(parsedSlug);
    setBrandName(brand);
    setHasKnowledgeFiles(knowledgeFiles);
    setStarterFileName(firstFileName);
    setLoadState('ready');
  }, []);

  // ── Focus heading on step change ─────────────────────────────────────────
  useEffect(() => {
    if (loadState === 'ready' && prevIndexRef.current !== currentIndex) {
      headingRef.current?.focus();
      prevIndexRef.current = currentIndex;
    }
  }, [currentIndex, loadState]);

  // ── Build steps (derived from state, never stored in state) ──────────────
  const steps = useMemo<PanelStep[]>(() => {
    if (loadState !== 'ready') return [];
    return buildSteps(brandName, hasKnowledgeFiles, starterFileName);
  }, [loadState, brandName, hasKnowledgeFiles, starterFileName]);

  const railSteps = useMemo<RailStep[]>(
    () => steps.map((s) => ({ label: s.label })),
    [steps],
  );

  // ── Fire done event on first arrival at the last step ─────────────────────
  useEffect(() => {
    if (loadState !== 'ready') return;
    if (steps.length === 0) return;
    const isLast = currentIndex === steps.length - 1;
    if (isLast && !doneFiredRef.current) {
      doneFiredRef.current = true;
      void recordExportEvent({
        kind: 'done',
        setupSlug: slug,
        target: 'claude-app',
        branch: planChoiceRef.current,
      });
    }
  }, [currentIndex, loadState, slug, steps.length]);

  // ── Navigation callbacks ─────────────────────────────────────────────────
  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [steps.length]);

  const goBack = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goToStep = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loadState === 'loading') {
    return (
      <main className="section-tight">
        <div className="wrap" aria-busy="true">
          <div
            className="skeleton"
            style={{ height: '40px', width: '320px', marginBottom: '12px' }}
          />
          <div
            className="skeleton"
            style={{ height: '20px', width: '480px', marginBottom: '36px' }}
          />
          <div
            className="skeleton"
            style={{ height: '56px', borderRadius: 'var(--r-lg)', marginBottom: '24px' }}
          />
          <div
            className="skeleton"
            style={{ height: '280px', borderRadius: 'var(--r-lg)' }}
          />
        </div>
      </main>
    );
  }

  // ── Missing state ────────────────────────────────────────────────────────
  if (loadState === 'missing') {
    return (
      <main className="section-tight">
        <div className="wrap">
          <div
            className="empty"
            style={{ maxWidth: '480px', margin: '60px auto' }}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="6"
                y="16"
                width="32"
                height="22"
                rx="4"
                stroke="var(--hairline-strong)"
                strokeWidth="2"
              />
              <path
                d="M15 16v-3a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3"
                stroke="var(--hairline-strong)"
                strokeWidth="2"
              />
              <path
                d="M22 26v-4M22 30v.5"
                stroke="var(--muted)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <h3>We couldn't find your setup</h3>
            <p>
              It looks like the session expired or you arrived here directly. Start again from
              the catalog to pick and customise your setup.
            </p>
            <Link href="/catalog" className="btn btn-primary">
              Browse the catalog
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Ready ────────────────────────────────────────────────────────────────
  const currentStep = steps[currentIndex];
  const totalSteps = steps.length;
  const stepWord = NUM_WORDS[totalSteps] ?? String(totalSteps);

  return (
    <main className="section-tight">
      <div className="wrap">

        {/* ── Page header ────────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '8px',
          }}
        >
          <div>
            <Link href="/export" className="back-link">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M9.5 3L5 7.5 9.5 12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to export
            </Link>
            <h1 style={{ fontSize: 'clamp(1.8rem,3.4vw,2.4rem)', marginBottom: '4px' }}>
              Install in Claude, step by step
            </h1>
            <p className="muted" style={{ margin: 0 }}>
              {stepWord} short steps, about two minutes. Keep the export page handy — you'll paste
              from it.
            </p>
          </div>
          <a className="btn btn-outline btn-sm" href="#tips">
            Tips if you get stuck
          </a>
        </div>

        {/* ── Walk rail ──────────────────────────────────────────────────── */}
        <WalkRail
          steps={railSteps}
          currentIndex={currentIndex}
          onStepClick={goToStep}
        />

        {/* ── Step counter (aria-live region) ───────────────────────────── */}
        {/* Visually hidden but announced to screen readers on step change */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="small muted"
          data-testid="step-indicator"
          style={{ marginBottom: '4px' }}
        >
          Step {currentIndex + 1} of {totalSteps}
        </div>

        {/* ── Active panel ───────────────────────────────────────────────── */}
        <WalkPanel
          step={currentStep}
          stepNumber={currentIndex + 1}
          totalSteps={totalSteps}
          isFirst={currentIndex === 0}
          isLast={currentIndex === totalSteps - 1}
          slug={slug}
          headingRef={headingRef}
          onNext={goNext}
          onBack={goBack}
        />

        {/* ── Tips ───────────────────────────────────────────────────────── */}
        <section id="tips" style={{ marginTop: '44px' }}>
          <h2 style={{ fontSize: '1.2rem' }}>Tips if you get stuck</h2>
          <ul className="understand-list" style={{ maxWidth: '46em' }}>
            <li>
              Can't find Projects in the sidebar? You're probably on the free plan — head back to
              the <Link href="/export">export page</Link> and use the free-plan path instead.
            </li>
            <li>
              No "Add to knowledge" button? Skip the upload step — your setup still works with just
              the custom instructions.
            </li>
            <li>
              Claude's answers feel generic? Double-check the instructions pasted completely — the
              block ends with rule 4, "flag it and confirm before proceeding."
            </li>
            <li>
              Want different answers?{' '}
              <Link href={`/setup/${slug}/customize`}>Edit your setup</Link> and export again — it
              takes a minute.
            </li>
          </ul>
        </section>

      </div>
    </main>
  );
}
