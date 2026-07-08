'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { recordExportEvent } from '@/lib/analytics/exportEvents';
import type { ReactNode } from 'react';
import Link from 'next/link';
import WalkRail, { type RailStep } from './WalkRail';
import WalkPanel, { type PanelStep } from './WalkPanel';
import { marketingManagerSetup } from '@/data/curated/marketing-manager';
import type { Setup, ExportTarget } from '@/lib/setup/types';
import type { ChatGptBranch } from '@/lib/export/chatGpt';
import { targetLabel } from '@/lib/export/targets';

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
          <strong style={{ color: 'var(--ink)' }}>New Project</strong>, that's the button
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
          Give it a name you'll recognise, we suggest{' '}
          <strong style={{ color: 'var(--ink)' }}>
            {brandName}, Marketing Manager
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
          <strong style={{ color: 'var(--ink)' }}>{starterFileName}</strong>, and your own
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
        Start any conversation inside the Project, Claude now works as your {brandName} marketing
        manager. Try a campaign brief or a piece of copy and see the difference.
      </>
    ) as ReactNode,
    imageKey: 'project-ready',
  });

  return steps;
}

/** Claude Code walkthrough steps, matching the toClaudeCodeExport adapter. */
function buildClaudeCodeSteps(
  hasKnowledgeFiles: boolean,
  starterFileName: string,
): PanelStep[] {
  const steps: PanelStep[] = [
    {
      label: 'Open your project in Claude Code',
      heading: 'Open your project in Claude Code',
      body: (
        <>
          In your terminal, navigate to the project directory. Run{' '}
          <strong style={{ color: 'var(--ink)' }}>claude</strong> to start Claude Code.
          Haven&apos;t installed it yet?{' '}
          <a
            href="https://docs.anthropic.com/en/docs/claude-code/quickstart"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--ink)' }}
          >
            Install Claude Code first
          </a>
          .
        </>
      ) as ReactNode,
      imageKey: 'claude-code-open-project',
    },
    {
      label: 'Paste into CLAUDE.md',
      heading: 'Paste into CLAUDE.md',
      body: (
        <>
          In your project root, open or create{' '}
          <strong style={{ color: 'var(--ink)' }}>CLAUDE.md</strong> (the project memory file).
          Copy the{' '}
          <strong style={{ color: 'var(--ink)' }}>Project memory (CLAUDE.md)</strong> block from
          your export page and paste it in, then save. Claude Code reads this file automatically
          before every conversation in this project.
        </>
      ) as ReactNode,
      imageKey: 'claude-code-paste-memory',
    },
  ];

  if (hasKnowledgeFiles) {
    steps.push({
      label: 'Add knowledge files',
      heading: 'Add knowledge files',
      body: (
        <>
          Create <strong style={{ color: 'var(--ink)' }}>{starterFileName}</strong>, and any
          other knowledge files from your export page, in your project directory at the paths
          shown. You can reference them in conversations when you need Claude to use them.
        </>
      ) as ReactNode,
      imageKey: 'claude-code-add-file',
    });
  }

  steps.push({
    label: "You're set up",
    heading: "You're set up",
    body: (
      <>
        Start a new conversation inside Claude Code. Claude will pick up the instructions in{' '}
        <strong style={{ color: 'var(--ink)' }}>CLAUDE.md</strong> automatically, no extra
        command needed. Try something relevant to your setup and see the difference.
      </>
    ) as ReactNode,
    imageKey: 'claude-code-confirm-setup',
  });

  return steps;
}

/** ChatGPT walkthrough steps, matching the toChatGptExport adapter. */
function buildChatGptSteps(
  brandName: string,
  branch: ChatGptBranch,
  hasKnowledgeFiles: boolean,
  starterFileName: string,
): PanelStep[] {
  if (branch === 'no-builder') {
    return [
      {
        label: 'Open Custom Instructions',
        heading: 'Open Custom Instructions',
        body: (
          <>
            In ChatGPT, click your name and choose{' '}
            <strong style={{ color: 'var(--ink)' }}>Customize ChatGPT</strong> to open the Custom
            Instructions panel.
          </>
        ) as ReactNode,
        imageKey: 'chatgpt-open-settings',
      },
      {
        label: 'Paste the instructions',
        heading: 'Paste the instructions',
        body: (
          <>
            Paste the <strong style={{ color: 'var(--ink)' }}>Custom instructions</strong> block
            from your export page into{' '}
            <strong style={{ color: 'var(--ink)' }}>How would you like ChatGPT to respond?</strong>{' '}
            and save. Any knowledge is included inline in that block.
          </>
        ) as ReactNode,
        imageKey: 'chatgpt-custom-instructions',
      },
      {
        label: "You're set up",
        heading: "You're set up",
        body: (
          <>
            Start a new chat, ChatGPT now works as your {brandName} marketing manager across all
            of your conversations.
          </>
        ) as ReactNode,
        imageKey: 'chatgpt-ci-ready',
      },
    ];
  }

  // 'custom-gpt'
  const steps: PanelStep[] = [
    {
      label: 'Start a new GPT',
      heading: 'Start a new GPT',
      body: (
        <>
          Open ChatGPT, click your name, then{' '}
          <strong style={{ color: 'var(--ink)' }}>My GPTs</strong> →{' '}
          <strong style={{ color: 'var(--ink)' }}>Create a GPT</strong>. Switch to the{' '}
          <strong style={{ color: 'var(--ink)' }}>Configure</strong> tab.
        </>
      ) as ReactNode,
      imageKey: 'chatgpt-create-gpt',
    },
    {
      label: 'Name your GPT',
      heading: 'Name your GPT',
      body: (
        <>
          Give it a name you&apos;ll recognise, we suggest{' '}
          <strong style={{ color: 'var(--ink)' }}>{brandName}, Marketing Manager</strong>. Add a
          short description if you like.
        </>
      ) as ReactNode,
      imageKey: 'chatgpt-name-gpt',
    },
    {
      label: 'Paste the instructions',
      heading: 'Paste the instructions',
      body: (
        <>
          In the <strong style={{ color: 'var(--ink)' }}>Instructions</strong> box on the Configure
          tab, paste the <strong style={{ color: 'var(--ink)' }}>Instructions</strong> block from
          your export page.
        </>
      ) as ReactNode,
      imageKey: 'chatgpt-paste-instructions',
    },
  ];

  if (hasKnowledgeFiles) {
    steps.push({
      label: 'Upload knowledge files',
      heading: 'Upload knowledge files',
      body: (
        <>
          Under <strong style={{ color: 'var(--ink)' }}>Knowledge</strong>, click{' '}
          <strong style={{ color: 'var(--ink)' }}>Upload files</strong> and add{' '}
          <strong style={{ color: 'var(--ink)' }}>{starterFileName}</strong>, and your own voice
          guide if you attached one.
        </>
      ) as ReactNode,
      imageKey: 'chatgpt-upload-knowledge',
    });
  }

  steps.push({
    label: 'Your GPT is ready',
    heading: 'Your GPT is ready',
    body: (
      <>
        Click <strong style={{ color: 'var(--ink)' }}>Create</strong>, then start a chat with your
        new GPT, ChatGPT now works as your {brandName} marketing manager.
      </>
    ) as ReactNode,
    imageKey: 'chatgpt-gpt-ready',
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
  const [target, setTarget] = useState<ExportTarget>('claude-app');
  const [chatGptBranch, setChatGptBranch] = useState<ChatGptBranch>('custom-gpt');
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
      target?: unknown;
      chatGptBranch?: unknown;
    };
    try {
      parsed = JSON.parse(raw) as typeof parsed;
    } catch {
      setLoadState('missing');
      return;
    }

    const {
      slug: parsedSlug,
      answers = {},
      planChoice: parsedPlanChoice,
      target: parsedTarget,
      chatGptBranch: parsedBranch,
    } = parsed;

    // Capture plan choice for the done-event analytics.
    if (parsedPlanChoice === 'pro' || parsedPlanChoice === 'free') {
      planChoiceRef.current = parsedPlanChoice;
    }

    // Capture the export target + ChatGPT builder branch (default claude-app).
    if (parsedTarget === 'chatgpt') {
      setTarget('chatgpt');
      if (parsedBranch === 'no-builder' || parsedBranch === 'custom-gpt') {
        setChatGptBranch(parsedBranch);
      }
    } else if (parsedTarget === 'claude-code') {
      setTarget('claude-code');
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
    if (target === 'chatgpt') {
      return buildChatGptSteps(brandName, chatGptBranch, hasKnowledgeFiles, starterFileName);
    }
    if (target === 'claude-code') {
      return buildClaudeCodeSteps(hasKnowledgeFiles, starterFileName);
    }
    return buildSteps(brandName, hasKnowledgeFiles, starterFileName);
  }, [loadState, brandName, hasKnowledgeFiles, starterFileName, target, chatGptBranch]);

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
        target,
        // plan branch only applies to the Claude Projects path; ChatGPT and
        // Claude Code have no plan-choice concept in the analytics enum.
        branch: target === 'claude-app' ? planChoiceRef.current : null,
      });
    }
  }, [currentIndex, loadState, slug, steps.length, target]);

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
            <Link href="/professionals" className="btn btn-primary">
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
              Install in {targetLabel(target)}, step by step
            </h1>
            <p className="muted" style={{ margin: 0 }}>
              {stepWord} short steps, about two minutes. Keep the export page handy, you'll paste
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
          {target === 'chatgpt' ? (
            <ul className="understand-list" style={{ maxWidth: '46em' }}>
              <li>
                Can&apos;t find &quot;Create a GPT&quot;? Custom GPTs need a paid ChatGPT plan, head
                back to the <Link href="/export">export page</Link> and choose{' '}
                <strong>Use Custom Instructions</strong> instead.
              </li>
              <li>
                No knowledge upload? Skip that step, your setup still works with just the
                instructions.
              </li>
              <li>
                Answers feel generic? Double-check the instructions pasted completely into the
                Configure tab (or Custom Instructions).
              </li>
              <li>
                Want different answers?{' '}
                <Link href={`/setup/${slug}/customize`}>Edit your setup</Link> and export again, it
                takes a minute.
              </li>
            </ul>
          ) : target === 'claude-code' ? (
            <ul className="understand-list" style={{ maxWidth: '46em' }}>
              <li>
                Can&apos;t find a CLAUDE.md? Create the file yourself, any plain-text editor works.
                Place it in the root of the project directory where you run{' '}
                <strong>claude</strong>.
              </li>
              <li>
                Claude ignoring the instructions? Make sure CLAUDE.md is saved in the project root
                (the same directory where you started Claude Code), not in a subdirectory.
              </li>
              <li>
                Knowledge files not being used? You need to mention the file in conversation, 
                Claude Code doesn&apos;t read arbitrary files automatically, only CLAUDE.md.
              </li>
              <li>
                Want different answers?{' '}
                <Link href={`/setup/${slug}/customize`}>Edit your setup</Link> and export again, it
                takes a minute.
              </li>
            </ul>
          ) : (
            <ul className="understand-list" style={{ maxWidth: '46em' }}>
              <li>
                Can't find Projects in the sidebar? You're probably on the free plan, head back to
                the <Link href="/export">export page</Link> and use the free-plan path instead.
              </li>
              <li>
                No "Add to knowledge" button? Skip the upload step, your setup still works with just
                the custom instructions.
              </li>
              <li>
                Claude's answers feel generic? Double-check the instructions pasted completely, the
                block ends with rule 4, "flag it and confirm before proceeding."
              </li>
              <li>
                Want different answers?{' '}
                <Link href={`/setup/${slug}/customize`}>Edit your setup</Link> and export again, it
                takes a minute.
              </li>
            </ul>
          )}
        </section>

      </div>
    </main>
  );
}
