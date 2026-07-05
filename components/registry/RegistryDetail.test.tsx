/**
 * RegistryDetail component tests.
 * Environment: jsdom (vitest.config.ts routes components/**\/*.test.tsx here).
 *
 * Tests: name, KindBadge, source badge, author, description, GitHub link
 * (present/absent), capabilities (shown/hidden), upvote, report, takedown.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import type { Setup } from '@/lib/setup/types';
import RegistryDetail from './RegistryDetail';

// ── Mock child components that hit Supabase or use router ─────────────────────

vi.mock('@/components/UpvoteButton', () => ({
  default: ({ setupId }: { setupId: string }) => (
    <button type="button" data-testid="upvote-button" data-setup-id={setupId}>
      Upvote
    </button>
  ),
}));

vi.mock('@/components/ReportSetup', () => ({
  default: ({ setupId }: { setupId: string }) => (
    <button type="button" data-testid="report-setup" data-setup-id={setupId}>
      Report
    </button>
  ),
}));

vi.mock('@/components/admin/TakedownControl', () => ({
  default: ({ setupId }: { setupId: string }) => (
    <div data-testid="takedown-control" data-setup-id={setupId}>
      TakedownControl
    </div>
  ),
}));

// KindBadge renders a real badge; no need to mock.
// ArtifactFileViewer is rendered with files; mock it so clipboard API isn't needed.
vi.mock('./ArtifactFileViewer', () => ({
  default: ({ files, slug }: { files: unknown[]; slug: string }) => (
    <div data-testid="artifact-file-viewer" data-slug={slug} data-count={files.length} />
  ),
}));

// ── Test fixture ──────────────────────────────────────────────────────────────

function makeSetup(overrides: Partial<Setup> = {}): Setup {
  return {
    kind: 'harness',
    id: 'setup-id-1',
    slug: 'tdd-loop-harness',
    name: 'TDD Loop Harness',
    tagline: 'Enforce TDD end to end.',
    description: 'A Claude Code harness that enforces test-driven development.',
    role: 'developer',
    industry: null,
    tags: ['tdd', 'testing'],
    category: 'engineering',
    source: 'curated',
    author: 'Armory team',
    version: '1.0.0',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-06-30T00:00:00Z',
    reviewStatus: 'approved',
    upvotes: 42,
    featured: null,
    popularity: 0,
    targets: [],
    tier: 'advanced',
    instructionTemplate: '',
    variables: [],
    knowledgeFiles: [],
    scenarios: [],
    artifactFiles: [
      { name: 'CLAUDE.md', content: '# conventions', isPrimary: true },
    ],
    repoUrl: 'https://github.com/armory/tdd-loop-harness',
    capabilities: [
      { command: '/tdd', description: 'Start a red-green-refactor loop' },
      { command: 'hook: PreToolUse', description: 'Block commits while tests are red' },
    ],
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('RegistryDetail', () => {
  it('renders the setup name as a heading', () => {
    render(<RegistryDetail setup={makeSetup()} />);
    expect(screen.getByRole('heading', { name: /TDD Loop Harness/i })).toBeInTheDocument();
  });

  it('renders the KindBadge for the setup kind', () => {
    render(<RegistryDetail setup={makeSetup({ kind: 'harness' })} />);
    expect(screen.getByTestId('kind-badge-harness')).toBeInTheDocument();
  });

  it('renders a curated source badge', () => {
    render(<RegistryDetail setup={makeSetup({ source: 'curated' })} />);
    expect(screen.getByText(/Curated/i)).toBeInTheDocument();
  });

  it('renders a community source badge', () => {
    render(
      <RegistryDetail setup={makeSetup({ source: 'community' })} />,
    );
    expect(screen.getByTestId('detail-badge-community')).toBeInTheDocument();
  });

  it('renders an ai-generated source badge', () => {
    render(
      <RegistryDetail setup={makeSetup({ source: 'ai-generated' })} />,
    );
    expect(screen.getByTestId('detail-badge-ai')).toBeInTheDocument();
  });

  it('renders the author name', () => {
    render(<RegistryDetail setup={makeSetup({ author: 'the Armory team' })} />);
    expect(screen.getByText(/the Armory team/i)).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<RegistryDetail setup={makeSetup()} />);
    expect(
      screen.getByText(/A Claude Code harness that enforces test-driven development\./),
    ).toBeInTheDocument();
  });

  it('renders a GitHub link when repoUrl is present', () => {
    render(
      <RegistryDetail
        setup={makeSetup({ repoUrl: 'https://github.com/armory/tdd-loop-harness' })}
      />,
    );
    const link = screen.getByRole('link', { name: /view on github/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://github.com/armory/tdd-loop-harness');
  });

  it('renders no GitHub link when repoUrl is null', () => {
    render(<RegistryDetail setup={makeSetup({ repoUrl: null })} />);
    expect(screen.queryByRole('link', { name: /view on github/i })).not.toBeInTheDocument();
  });

  it('renders each capability command and description', () => {
    render(<RegistryDetail setup={makeSetup()} />);
    expect(screen.getByText('/tdd')).toBeInTheDocument();
    expect(screen.getByText('Start a red-green-refactor loop')).toBeInTheDocument();
    expect(screen.getByText('hook: PreToolUse')).toBeInTheDocument();
    expect(screen.getByText('Block commits while tests are red')).toBeInTheDocument();
  });

  it('shows the "What it does" heading when capabilities is non-empty', () => {
    render(<RegistryDetail setup={makeSetup()} />);
    expect(screen.getByText(/What it does/i)).toBeInTheDocument();
  });

  it('hides the "What it does" section when capabilities is empty', () => {
    render(<RegistryDetail setup={makeSetup({ capabilities: [] })} />);
    expect(screen.queryByText(/What it does/i)).not.toBeInTheDocument();
  });

  it('renders the upvote button', () => {
    render(<RegistryDetail setup={makeSetup()} />);
    expect(screen.getByTestId('upvote-button')).toBeInTheDocument();
  });

  it('renders the report control', () => {
    render(<RegistryDetail setup={makeSetup()} />);
    expect(screen.getByTestId('report-setup')).toBeInTheDocument();
  });

  it('shows the moderator takedown control when isModerator=true and source=community and approved', () => {
    render(
      <RegistryDetail
        setup={makeSetup({ source: 'community', reviewStatus: 'approved' })}
        isModerator={true}
      />,
    );
    expect(screen.getByTestId('takedown-control')).toBeInTheDocument();
  });

  it('shows the moderator takedown control when isModerator=true and source=ai-generated and approved', () => {
    render(
      <RegistryDetail
        setup={makeSetup({ source: 'ai-generated', reviewStatus: 'approved' })}
        isModerator={true}
      />,
    );
    expect(screen.getByTestId('takedown-control')).toBeInTheDocument();
  });

  it('does NOT show the takedown control when isModerator=false', () => {
    render(
      <RegistryDetail
        setup={makeSetup({ source: 'community', reviewStatus: 'approved' })}
        isModerator={false}
      />,
    );
    expect(screen.queryByTestId('takedown-control')).not.toBeInTheDocument();
  });

  it('does NOT show the takedown control for curated setups even if isModerator=true', () => {
    render(
      <RegistryDetail
        setup={makeSetup({ source: 'curated', reviewStatus: 'approved' })}
        isModerator={true}
      />,
    );
    expect(screen.queryByTestId('takedown-control')).not.toBeInTheDocument();
  });
});
