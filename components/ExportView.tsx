'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useExportSetup } from './useExportSetup';
import ExportWalkthrough, { type StepWithBlocks } from './ExportWalkthrough';
import type { ExportBlock, WalkthroughStep } from '@/lib/export/claudeApp';
import type { Setup } from '@/lib/setup/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type PlanChoice = null | 'pro' | 'free';

interface Props {
  setup: Setup;
}

// ─── Step builders ────────────────────────────────────────────────────────────

/**
 * Takes the Pro-path walkthrough steps (from toClaudeAppExport) and injects
 * the relevant copy blocks into the paste-instructions and upload steps.
 */
function buildProSteps(
  walkthroughSteps: WalkthroughStep[],
  blocks: ExportBlock[],
): StepWithBlocks[] {
  const instructionBlock = blocks.find((b) => b.kind === 'instruction');
  const knowledgeBlocks = blocks.filter((b) => b.kind === 'knowledge');

  return walkthroughSteps.map((step): StepWithBlocks => {
    if (step.imageKey === 'paste-instructions' && instructionBlock) {
      return {
        ...step,
        embeddedBlocks: [{ label: instructionBlock.label, content: instructionBlock.content }],
      };
    }
    if (step.imageKey === 'upload-knowledge-file' && knowledgeBlocks.length > 0) {
      return {
        ...step,
        embeddedBlocks: knowledgeBlocks.map((b) => ({ label: b.label, content: b.content })),
      };
    }
    return step;
  });
}

/**
 * Builds the free-tier walkthrough: paste instruction at the start of a
 * conversation, include knowledge content in the same message, then done.
 * Same Step N of M tracker and "You're set up" success state as the Pro path.
 */
function buildFreeSteps(blocks: ExportBlock[]): StepWithBlocks[] {
  const instructionBlock = blocks.find((b) => b.kind === 'instruction');
  const knowledgeBlocks = blocks.filter((b) => b.kind === 'knowledge');

  const steps: StepWithBlocks[] = [
    {
      stepNumber: 1,
      title: 'Open Claude',
      body: 'Go to claude.ai and start a new conversation.',
      imageKey: 'create-project',
    },
    {
      stepNumber: 2,
      title: 'Paste your instructions',
      body: 'Copy the block below and paste it at the very start of your message to Claude.',
      imageKey: 'paste-instructions',
      embeddedBlocks: instructionBlock
        ? [{ label: instructionBlock.label, content: instructionBlock.content }]
        : [],
    },
  ];

  if (knowledgeBlocks.length > 0) {
    steps.push({
      stepNumber: 3,
      title: 'Include your knowledge files',
      body: 'Paste the content below into the same message, after your instructions.',
      imageKey: 'upload-knowledge-file',
      embeddedBlocks: knowledgeBlocks.map((b) => ({ label: b.label, content: b.content })),
    });
  }

  // Final step — isLast triggers the "You're set up" success heading in ExportWalkthrough
  steps.push({
    stepNumber: steps.length + 1,
    title: "You're set up",
    body: 'Claude will follow your setup for this conversation. Start chatting to get going.',
    imageKey: 'project-ready',
  });

  return steps;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ExportView({ setup }: Props) {
  const phase = useExportSetup(setup);
  const [planChoice, setPlanChoice] = useState<PlanChoice>(null);

  // ── Shared styles ──────────────────────────────────────────────────────────

  const containerStyle: React.CSSProperties = {
    fontFamily: 'system-ui, sans-serif',
    color: '#1a1a1a',
  };

  // ── Loading / compiling ────────────────────────────────────────────────────

  if (phase.kind === 'loading' || phase.kind === 'compiling') {
    return (
      <div style={containerStyle}>
        <p style={{ color: '#555', fontSize: '0.95rem' }}>
          {phase.kind === 'compiling' ? 'Preparing your export…' : 'Loading…'}
        </p>
      </div>
    );
  }

  // ── Invalid session ────────────────────────────────────────────────────────

  if (phase.kind === 'invalid') {
    return (
      <div style={containerStyle}>
        <p style={{ color: '#555', marginBottom: '1rem' }}>
          We couldn&apos;t find your answers &mdash; start again from your setup.
        </p>
        <Link
          href="/catalog"
          style={{
            color: '#1a1a1a',
            fontWeight: 600,
            textDecoration: 'underline',
          }}
        >
          Go to catalog
        </Link>
      </div>
    );
  }

  // ── API / compile error ────────────────────────────────────────────────────

  if (phase.kind === 'error') {
    return (
      <div style={containerStyle}>
        <p style={{ color: '#b91c1c', marginBottom: '0.75rem' }}>
          Something went wrong: {phase.message}
        </p>
        <Link
          href="/catalog"
          style={{ color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}
        >
          Go to catalog
        </Link>
      </div>
    );
  }

  // ── Over-limit — blocking message, no copy blocks ──────────────────────────

  if (phase.kind === 'overlimit') {
    return (
      <div style={containerStyle}>
        <div
          data-testid="overlimit-message"
          style={{
            padding: '1.25rem 1.5rem',
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '6px',
            marginBottom: '1.25rem',
          }}
        >
          <h2
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#b91c1c',
              margin: '0 0 0.5rem',
            }}
          >
            Your setup exceeds the Claude limit
          </h2>
          <ul style={{ margin: '0', paddingLeft: '1.25rem' }}>
            {phase.errors.map((e, i) => (
              <li
                key={i}
                style={{ fontSize: '0.9rem', color: '#7f1d1d', marginBottom: '0.25rem' }}
              >
                {e.message}
              </li>
            ))}
          </ul>
        </div>
        <Link
          href={`/setup/${phase.slug}`}
          style={{
            display: 'inline-block',
            padding: '0.6rem 1.25rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            background: '#1a1a1a',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '6px',
          }}
        >
          Edit your setup
        </Link>
      </div>
    );
  }

  // ── Happy path ─────────────────────────────────────────────────────────────

  const { slug, exportData, blocks } = phase;
  const proSteps = buildProSteps(exportData.walkthrough, blocks);
  const freeSteps = buildFreeSteps(blocks);

  return (
    <div style={containerStyle}>
      {/* Trust cue — always shown first, before anything else */}
      <p
        data-testid="trust-cue"
        style={{
          fontSize: '0.85rem',
          color: '#555',
          margin: '0 0 1.5rem',
          padding: '0.5rem 0.75rem',
          background: '#f5f5f5',
          borderLeft: '3px solid #1a1a1a',
          borderRadius: '0 4px 4px 0',
        }}
      >
        Curated setups are reviewed by the Armory team.
      </p>

      {/* Plan picker */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          border: '1px solid #e5e5e5',
          borderRadius: '6px',
          marginBottom: '1.5rem',
        }}
      >
        <p
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#1a1a1a',
            margin: '0 0 0.75rem',
          }}
        >
          Do you have Claude Pro?
        </p>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#555',
            margin: '0 0 1rem',
            lineHeight: 1.5,
          }}
        >
          Claude Pro unlocks Projects, which let you save your setup permanently.
          If you&apos;re on the free tier, you can still paste the instructions into any
          conversation.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setPlanChoice('pro')}
            aria-pressed={planChoice === 'pro'}
            style={{
              padding: '0.6rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              background: planChoice === 'pro' ? '#1a1a1a' : '#fff',
              color: planChoice === 'pro' ? '#fff' : '#1a1a1a',
              border: '1px solid #1a1a1a',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setPlanChoice('free')}
            aria-pressed={planChoice === 'free'}
            style={{
              padding: '0.6rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              background: planChoice === 'free' ? '#1a1a1a' : '#fff',
              color: planChoice === 'free' ? '#fff' : '#1a1a1a',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            No
          </button>
        </div>
      </div>

      {/* Pro path: Claude Projects walkthrough with embedded copy blocks */}
      {planChoice === 'pro' && (
        <div style={{ marginBottom: '2rem' }}>
          <h2
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1a1a1a',
              margin: '0 0 1rem',
            }}
          >
            How to set up Claude Projects
          </h2>
          <ExportWalkthrough steps={proSteps} slug={slug} />
        </div>
      )}

      {/* Free path: conversation walkthrough with embedded copy blocks */}
      {planChoice === 'free' && (
        <div style={{ marginBottom: '2rem' }}>
          <h2
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1a1a1a',
              margin: '0 0 1rem',
            }}
          >
            How to use with the free plan
          </h2>
          <ExportWalkthrough steps={freeSteps} slug={slug} />
        </div>
      )}

      {/* Return link */}
      <p style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.5rem' }}>
        Want to change something?{' '}
        <Link
          href={`/setup/${slug}`}
          style={{ color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}
        >
          Edit your setup
        </Link>
      </p>
    </div>
  );
}
