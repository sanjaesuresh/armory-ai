/**
 * ReviewQueue component tests.
 * Environment: jsdom (routed via vitest.config.ts environmentMatchGlobs).
 *
 * Tests the approve / reject controls, note-required gate, and fetch calls.
 * Never instantiates real Supabase clients or network connections.
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ReviewQueue, { type QueueItemData, type GenerationMeta } from './ReviewQueue';
import type { ArtifactFile, Capability } from '@/lib/setup/types';

// ── Module mocks ──────────────────────────────────────────────────────────────

const mockRefresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

const baseItem: QueueItemData = {
  id: 'setup-1',
  name: 'SEO Blog Generator',
  author: 'abc123def456',
  submittedAt: '3 days ago',
  needsAttention: true,
  findings: [
    {
      pass: 'rules',
      code: 'instruction-override',
      message: 'Template contains "ignore future instructions".',
      path: 'instructionTemplate',
    },
  ],
  compiledInstruction: 'You are an SEO blog writer. [placeholder]',
  source: 'community',
  kind: 'setup',
  description: 'A setup for SEO blog writing.',
  capabilities: [],
  artifactFiles: [],
  repoUrl: null,
};

const cleanItem: QueueItemData = {
  id: 'setup-2',
  name: 'Weekly Standup',
  author: 'xyz789',
  submittedAt: '2 days ago',
  needsAttention: false,
  findings: [],
  compiledInstruction: 'Summarize standups.',
  source: 'community',
  kind: 'setup',
  description: 'Summarize standups and action items.',
  capabilities: [],
  artifactFiles: [],
  repoUrl: null,
};

const modelFlagItem: QueueItemData = {
  id: 'setup-3',
  name: 'Suspicious Prompter',
  author: 'badactor1',
  submittedAt: '1 hour ago',
  needsAttention: true,
  findings: [
    {
      pass: 'model',
      code: 'model-flagged',
      message: 'The grader flagged the template as acting against the installer.',
      path: 'instructionTemplate',
    },
  ],
  compiledInstruction: 'You are a helpful assistant.',
  source: 'community',
  kind: 'setup',
  description: 'A suspicious setup.',
  capabilities: [],
  artifactFiles: [],
  repoUrl: null,
};

const aiGenerationMeta: GenerationMeta = {
  brief: {
    kind: 'gap-fill',
    role: 'marketing-manager',
    industry: null,
    goalTags: ['email-campaigns', 'analytics'],
  },
  evals: [
    {
      scenarioId: 'scenario-write-email',
      pass: true,
      outputSnippet: 'Here is a draft email for your campaign…',
    },
  ],
};

const aiGeneratedItem: QueueItemData = {
  id: 'setup-ai-1',
  name: 'Marketing Email Assistant',
  author: null,
  submittedAt: '1 hour ago',
  needsAttention: false,
  findings: [],
  compiledInstruction: 'You are a marketing email writer.',
  source: 'ai-generated',
  generationMeta: aiGenerationMeta,
  kind: 'setup',
  description: 'A marketing email assistant.',
  capabilities: [],
  artifactFiles: [],
  repoUrl: null,
};

const aiVariationMeta: GenerationMeta = {
  brief: {
    kind: 'variation',
    role: 'sales-rep',
    industry: 'saas',
    goalTags: [],
    sourceSlug: 'marketing-email-assistant',
    vary: 'role',
  },
  evals: [],
};

const aiVariationItem: QueueItemData = {
  id: 'setup-ai-2',
  name: 'Sales Email Assistant',
  author: null,
  submittedAt: '2 hours ago',
  needsAttention: false,
  findings: [],
  compiledInstruction: 'You are a sales email writer.',
  source: 'ai-generated',
  generationMeta: aiVariationMeta,
  kind: 'setup',
  description: 'A sales email assistant.',
  capabilities: [],
  artifactFiles: [],
  repoUrl: null,
};

// ── Registry item fixtures ────────────────────────────────────────────────────

const agentCapabilities: Capability[] = [
  { command: '/review', description: 'Review a pull request for issues' },
];

const agentFiles: ArtifactFile[] = [
  { name: 'CLAUDE.md', content: '# Code Review Agent\nReviews pull requests.', isPrimary: true },
];

const agentItem: QueueItemData = {
  id: 'agent-1',
  name: 'Code Review Agent',
  author: 'dev123',
  submittedAt: '1 day ago',
  needsAttention: false,
  findings: [
    {
      pass: 'rules',
      code: 'some-code',
      message: 'Flagged for review.',
      path: 'agent',
    },
  ],
  compiledInstruction: '',
  source: 'community',
  kind: 'agent',
  description: 'An agent that reviews pull requests automatically.',
  capabilities: agentCapabilities,
  artifactFiles: agentFiles,
  repoUrl: 'https://github.com/dev123/code-review-agent',
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ReviewQueue', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fetchSpy: ReturnType<typeof vi.fn> & { mock: any };

  beforeEach(() => {
    vi.clearAllMocks();
    // Replace global fetch with a spy so we never make real network calls.
    fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // ── Empty state ────────────────────────────────────────────────────────────

  it('renders the empty state when no items are provided', () => {
    render(<ReviewQueue items={[]} />);
    expect(screen.getByTestId('review-queue-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('review-detail')).toBeNull();
  });

  // ── Queue list ─────────────────────────────────────────────────────────────

  it('renders a queue item row for each item', () => {
    render(<ReviewQueue items={[baseItem, cleanItem]} />);
    expect(screen.getByTestId('queue-item-setup-1')).toBeInTheDocument();
    expect(screen.getByTestId('queue-item-setup-2')).toBeInTheDocument();
  });

  it('shows the "Needs attention" flag only on flagged items', () => {
    render(<ReviewQueue items={[baseItem, cleanItem]} />);
    // baseItem has needsAttention=true
    expect(screen.getByTestId('queue-item-setup-1').textContent).toContain('Needs attention');
    // cleanItem does not
    expect(screen.getByTestId('queue-item-setup-2').textContent).not.toContain('Needs attention');
  });

  // ── Note-required gate ─────────────────────────────────────────────────────

  it('reject button is disabled when note is empty', () => {
    render(<ReviewQueue items={[baseItem]} />);
    const rejectBtn = screen.getByTestId('btn-reject');
    expect(rejectBtn).toBeDisabled();
  });

  it('reject button becomes enabled when note is non-empty', async () => {
    const user = userEvent.setup();
    render(<ReviewQueue items={[baseItem]} />);
    const rejectBtn = screen.getByTestId('btn-reject');
    const noteArea = screen.getByTestId('mod-note');

    expect(rejectBtn).toBeDisabled();
    await user.type(noteArea, 'Please fix the override attempt.');
    expect(rejectBtn).not.toBeDisabled();
  });

  it('reject button is disabled again if note is cleared', async () => {
    const user = userEvent.setup();
    render(<ReviewQueue items={[baseItem]} />);
    const rejectBtn = screen.getByTestId('btn-reject');
    const noteArea = screen.getByTestId('mod-note');

    await user.type(noteArea, 'Some note');
    expect(rejectBtn).not.toBeDisabled();
    await user.clear(noteArea);
    expect(rejectBtn).toBeDisabled();
  });

  // ── Approve button always enabled ──────────────────────────────────────────

  it('approve button is enabled without a note', () => {
    render(<ReviewQueue items={[baseItem]} />);
    expect(screen.getByTestId('btn-approve')).not.toBeDisabled();
  });

  // ── Approve action ─────────────────────────────────────────────────────────

  it('calls fetch with action=approve and shows success on approve', async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    const user = userEvent.setup();
    render(<ReviewQueue items={[baseItem]} />);

    await user.click(screen.getByTestId('btn-approve'));

    await waitFor(() =>
      expect(screen.getByTestId('action-success')).toBeInTheDocument(),
    );

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/admin/moderate');
    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body.setupId).toBe('setup-1');
    expect(body.action).toBe('approve');
    expect(mockRefresh).toHaveBeenCalledOnce();
  });

  // ── Fix 1: busy reset on success ──────────────────────────────────────────

  it('re-enables the action buttons after a successful approve', async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    const user = userEvent.setup();
    render(<ReviewQueue items={[baseItem]} />);

    await user.click(screen.getByTestId('btn-approve'));

    await waitFor(() =>
      expect(screen.getByTestId('action-success')).toBeInTheDocument(),
    );

    expect(screen.getByTestId('btn-approve')).not.toBeDisabled();
  });

  // ── Reject action ──────────────────────────────────────────────────────────

  it('calls fetch with action=reject and note on reject', async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    const user = userEvent.setup();
    render(<ReviewQueue items={[baseItem]} />);

    await user.type(screen.getByTestId('mod-note'), 'Remove the override attempt.');
    await user.click(screen.getByTestId('btn-reject'));

    await waitFor(() =>
      expect(screen.getByTestId('action-success')).toBeInTheDocument(),
    );

    const body = JSON.parse(
      (fetchSpy.mock.calls[0] as [string, RequestInit])[1].body as string,
    ) as Record<string, unknown>;
    expect(body.action).toBe('reject');
    expect(body.note).toBe('Remove the override attempt.');
  });

  // ── Error handling ─────────────────────────────────────────────────────────

  it('shows an error message when the route returns ok=false', async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: false, error: 'Not authorized.' }), {
        status: 403,
      }),
    );
    const user = userEvent.setup();
    render(<ReviewQueue items={[baseItem]} />);

    await user.click(screen.getByTestId('btn-approve'));

    await waitFor(() =>
      expect(screen.getByTestId('action-error')).toBeInTheDocument(),
    );
    expect(screen.getByTestId('action-error').textContent).toContain('Not authorized.');
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  it('shows a network error message on fetch failure', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('network error'));
    const user = userEvent.setup();
    render(<ReviewQueue items={[baseItem]} />);

    await user.click(screen.getByTestId('btn-approve'));

    await waitFor(() =>
      expect(screen.getByTestId('action-error')).toBeInTheDocument(),
    );
    expect(screen.getByTestId('action-error').textContent).toContain('Network error');
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  // ── Safety findings ────────────────────────────────────────────────────────

  it('renders a clean finding when there are no safety findings', () => {
    render(<ReviewQueue items={[cleanItem]} />);
    expect(screen.getByTestId('finding-clean')).toBeInTheDocument();
  });

  it('renders individual finding rows when findings are present', () => {
    render(<ReviewQueue items={[baseItem]} />);
    expect(screen.getByTestId('finding-0')).toBeInTheDocument();
    expect(screen.getByTestId('finding-0').textContent).toContain(
      'Template contains "ignore future instructions".',
    );
  });

  // ── Fix 2: model-pass findings rendered as flags, not clean ───────────────

  it('renders a model-pass finding with finding-flag class, not finding-ok', () => {
    render(<ReviewQueue items={[modelFlagItem]} />);
    const finding = screen.getByTestId('finding-0');
    expect(finding).toBeInTheDocument();
    expect(finding.className).toContain('finding-flag');
    expect(finding.className).not.toContain('finding-ok');
  });

  it('renders the correct label text for a model-pass finding', () => {
    render(<ReviewQueue items={[modelFlagItem]} />);
    const finding = screen.getByTestId('finding-0');
    expect(finding.textContent).toContain('Model pass — flagged.');
    expect(finding.textContent).not.toContain('Model pass.');
  });

  // ── Detail view on item selection ─────────────────────────────────────────

  it('switches the detail view when a different queue item is selected', async () => {
    const user = userEvent.setup();
    render(<ReviewQueue items={[baseItem, cleanItem]} />);

    // Initially shows the first item.
    expect(screen.getByTestId('review-detail').textContent).toContain('SEO Blog Generator');

    // Click the "Review" button for the second item.
    await user.click(screen.getByTestId('review-btn-setup-2'));

    expect(screen.getByTestId('review-detail').textContent).toContain('Weekly Standup');
    expect(screen.getByTestId('finding-clean')).toBeInTheDocument();
  });

  // ── AI-generated eval report ───────────────────────────────────────────────

  it('shows the AI-generated badge for an ai-generated item', () => {
    render(<ReviewQueue items={[aiGeneratedItem]} />);
    expect(screen.getByTestId('detail-badge-ai')).toBeInTheDocument();
    expect(screen.getByTestId('detail-badge-ai').textContent).toContain('AI-generated');
  });

  it('renders the generation brief for an ai-generated item', () => {
    render(<ReviewQueue items={[aiGeneratedItem]} />);
    const brief = screen.getByTestId('gen-brief');
    expect(brief).toBeInTheDocument();
    expect(brief.textContent).toContain('Gap-fill');
    expect(brief.textContent).toContain('marketing-manager');
    expect(brief.textContent).toContain('email-campaigns');
  });

  it('renders the scenario eval report for an ai-generated item', () => {
    render(<ReviewQueue items={[aiGeneratedItem]} />);
    const eval0 = screen.getByTestId('eval-0');
    expect(eval0).toBeInTheDocument();
    expect(eval0.textContent).toContain('scenario-write-email');
    expect(eval0.textContent).toContain('Pass');
    expect(eval0.textContent).toContain('Here is a draft email for your campaign');
  });

  it('renders variation brief details including sourceSlug and vary', () => {
    render(<ReviewQueue items={[aiVariationItem]} />);
    const brief = screen.getByTestId('gen-brief');
    expect(brief.textContent).toContain('Variation');
    expect(brief.textContent).toContain('sales-rep');
    expect(brief.textContent).toContain('saas');
    expect(brief.textContent).toContain('marketing-email-assistant');
    expect(brief.textContent).toContain('role');
  });

  it('shows no-scenarios message when evals array is empty', () => {
    render(<ReviewQueue items={[aiVariationItem]} />);
    expect(screen.getByTestId('evals-none')).toBeInTheDocument();
  });

  it('does not render the AI badge or eval report for a community item', () => {
    render(<ReviewQueue items={[cleanItem]} />);
    expect(screen.queryByTestId('detail-badge-ai')).toBeNull();
    expect(screen.queryByTestId('gen-brief')).toBeNull();
  });

  // ── Fix 1: malformed generationMeta must not throw ─────────────────────────

  it('renders without crashing when generationMeta is an empty object', () => {
    const itemWithEmptyMeta: QueueItemData = {
      ...aiGeneratedItem,
      id: 'setup-malformed-1',
      generationMeta: {} as unknown as GenerationMeta,
    };
    expect(() => render(<ReviewQueue items={[itemWithEmptyMeta]} />)).not.toThrow();
    expect(screen.queryByTestId('gen-brief')).toBeNull();
  });

  it('renders without crashing when generationMeta has null brief and evals', () => {
    const itemWithNullFields: QueueItemData = {
      ...aiGeneratedItem,
      id: 'setup-malformed-2',
      generationMeta: { brief: null, evals: null } as unknown as GenerationMeta,
    };
    expect(() => render(<ReviewQueue items={[itemWithNullFields]} />)).not.toThrow();
    expect(screen.queryByTestId('gen-brief')).toBeNull();
  });

  // ── Fix 2: honest pass/fail eval styling ──────────────────────────────────

  it('renders a failed eval row with finding-flag class and no finding-ok', () => {
    const failMeta: GenerationMeta = {
      brief: {
        kind: 'gap-fill',
        role: 'analyst',
        industry: null,
        goalTags: [],
      },
      evals: [
        {
          scenarioId: 'scenario-fail-test',
          pass: false,
          outputSnippet: 'Output did not meet criteria.',
        },
      ],
    };
    const itemWithFailEval: QueueItemData = {
      ...aiGeneratedItem,
      id: 'setup-fail-eval',
      generationMeta: failMeta,
    };
    render(<ReviewQueue items={[itemWithFailEval]} />);
    const evalRow = screen.getByTestId('eval-0');
    expect(evalRow.className).toContain('finding-flag');
    expect(evalRow.className).not.toContain('finding-ok');
    expect(evalRow.textContent).toContain('Fail');
  });

  // ── T10: kind-aware queue ─────────────────────────────────────────────────

  it('shows the kind badge in the list row for an agent item', () => {
    render(<ReviewQueue items={[agentItem]} />);
    expect(screen.getByTestId('kind-badge-agent')).toBeInTheDocument();
  });

  it('does not render a kind badge for a setup item', () => {
    render(<ReviewQueue items={[baseItem]} />);
    // KindBadge renders nothing for 'setup', so no kind-badge testid exists.
    expect(screen.queryByTestId('kind-badge-setup')).toBeNull();
  });

  it('renders the registry preview section for a pending agent', () => {
    render(<ReviewQueue items={[agentItem]} />);
    expect(screen.getByTestId('registry-preview')).toBeInTheDocument();
  });

  it('renders the agent description in the registry preview', () => {
    render(<ReviewQueue items={[agentItem]} />);
    const preview = screen.getByTestId('registry-preview');
    expect(preview.textContent).toContain('An agent that reviews pull requests automatically.');
  });

  it('renders the capabilities list in the registry preview when non-empty', () => {
    render(<ReviewQueue items={[agentItem]} />);
    const preview = screen.getByTestId('registry-preview');
    expect(preview.textContent).toContain('What it does');
    expect(preview.textContent).toContain('/review');
    expect(preview.textContent).toContain('Review a pull request for issues');
  });

  it('renders the repo link in the registry preview when repoUrl is set', () => {
    render(<ReviewQueue items={[agentItem]} />);
    const repoLink = screen.getByRole('link', { name: /view on github/i });
    expect(repoLink).toBeInTheDocument();
    expect(repoLink).toHaveAttribute('href', 'https://github.com/dev123/code-review-agent');
  });

  it('renders the ArtifactFileViewer primary file in the registry preview', () => {
    render(<ReviewQueue items={[agentItem]} />);
    // Primary file name should appear in the collapsed viewer.
    expect(screen.getByText('CLAUDE.md')).toBeInTheDocument();
  });

  it('renders safety findings for a registry item exactly as for setups', () => {
    render(<ReviewQueue items={[agentItem]} />);
    expect(screen.getByTestId('finding-0')).toBeInTheDocument();
    expect(screen.getByTestId('finding-0').textContent).toContain('Flagged for review.');
  });

  it('renders compiled-preview for a setup (regression — unchanged)', () => {
    render(<ReviewQueue items={[baseItem]} />);
    const preview = screen.getByTestId('compiled-preview');
    expect(preview).toBeInTheDocument();
    expect(preview.textContent).toContain('You are an SEO blog writer');
  });

  it('does not render registry-preview for a setup (regression)', () => {
    render(<ReviewQueue items={[baseItem]} />);
    expect(screen.queryByTestId('registry-preview')).toBeNull();
  });

  it('hides the capabilities section when the agent has no capabilities', () => {
    const agentNoCapabilities: QueueItemData = {
      ...agentItem,
      id: 'agent-nocap',
      capabilities: [],
    };
    render(<ReviewQueue items={[agentNoCapabilities]} />);
    expect(screen.queryByText('What it does')).toBeNull();
  });

  it('hides the repo link when repoUrl is null', () => {
    const agentNoRepo: QueueItemData = {
      ...agentItem,
      id: 'agent-norepo',
      repoUrl: null,
    };
    render(<ReviewQueue items={[agentNoRepo]} />);
    expect(screen.queryByRole('link', { name: /view on github/i })).toBeNull();
  });
});
