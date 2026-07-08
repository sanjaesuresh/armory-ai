/**
 * DevRegistry component tests.
 * Environment: jsdom (dom project — matches components/**\/*.test.tsx pattern).
 *
 * Tests: tab rendering with counts, tab switching, row hrefs.
 * No module mocks needed — DevRegistry has no external async deps.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import DevRegistry from './DevRegistry';
import type { DevRegistryGroup } from './DevRegistry';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const agentGroup: DevRegistryGroup = {
  kind: 'agent',
  label: 'Agents',
  count: 12,
  rows: [
    {
      slug: 'claude-code-agent',
      name: 'Claude Code Agent',
      tagline: 'Full-stack coding agent for Claude Code',
      stars: 4200,
      href: '/developers/claude-code-agent',
    },
    {
      slug: 'repo-pilot',
      name: 'Repo Pilot',
      tagline: 'Navigate large codebases with ease',
      stars: 1100,
      href: '/developers/repo-pilot',
    },
  ],
};

const skillGroup: DevRegistryGroup = {
  kind: 'skill',
  label: 'Skills',
  count: 8,
  rows: [
    {
      slug: 'test-driven-dev',
      name: 'Test Driven Dev',
      tagline: 'Red-green-refactor discipline for Claude Code',
      stars: 820,
      href: '/developers/test-driven-dev',
    },
  ],
};

const groups = [agentGroup, skillGroup];

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('DevRegistry', () => {
  it('renders a tab for each group with its count', () => {
    render(<DevRegistry groups={groups} total={20} />);

    // Both tabs should be present with counts
    expect(screen.getByRole('button', { name: /Agents/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Skills/i })).toBeInTheDocument();

    // Counts appear in the tab text
    const agentTab = screen.getByRole('button', { name: /Agents/i });
    expect(agentTab).toHaveTextContent('12');
    const skillTab = screen.getByRole('button', { name: /Skills/i });
    expect(skillTab).toHaveTextContent('8');
  });

  it('shows agent rows by default (first group active)', () => {
    render(<DevRegistry groups={groups} total={20} />);

    // agent rows are visible
    expect(screen.getByText('Claude Code Agent')).toBeInTheDocument();
    expect(screen.getByText('Repo Pilot')).toBeInTheDocument();

    // skill rows are NOT visible
    expect(screen.queryByText('Test Driven Dev')).toBeNull();
  });

  it('clicking the Skills tab shows skill rows and hides agent rows', async () => {
    const user = userEvent.setup();
    render(<DevRegistry groups={groups} total={20} />);

    const skillTab = screen.getByRole('button', { name: /Skills/i });
    await user.click(skillTab);

    // skill row now visible
    expect(screen.getByText('Test Driven Dev')).toBeInTheDocument();

    // agent rows are gone
    expect(screen.queryByText('Claude Code Agent')).toBeNull();
    expect(screen.queryByText('Repo Pilot')).toBeNull();
  });

  it('rows link to their expected href', () => {
    render(<DevRegistry groups={groups} total={20} />);

    // find by test id so we get the <a> tag itself
    const link = screen.getByTestId('dev-row-claude-code-agent');
    expect(link).toHaveAttribute('href', '/developers/claude-code-agent');
  });

  it('active tab has aria-pressed=true; inactive tabs have aria-pressed=false', () => {
    render(<DevRegistry groups={groups} total={20} />);

    const agentTab = screen.getByRole('button', { name: /Agents/i });
    const skillTab = screen.getByRole('button', { name: /Skills/i });

    expect(agentTab).toHaveAttribute('aria-pressed', 'true');
    expect(skillTab).toHaveAttribute('aria-pressed', 'false');
  });

  it('switching tab updates aria-pressed correctly', async () => {
    const user = userEvent.setup();
    render(<DevRegistry groups={groups} total={20} />);

    await user.click(screen.getByRole('button', { name: /Skills/i }));

    expect(screen.getByRole('button', { name: /Skills/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /Agents/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders the total count in the stats row', () => {
    render(<DevRegistry groups={groups} total={20} />);
    // stat reads "20+ registry tools"
    expect(screen.getByText('20+')).toBeInTheDocument();
  });

  it('formats star counts correctly (e.g. 4200 → "4.2k")', () => {
    render(<DevRegistry groups={groups} total={20} />);
    // 4200 stars → "4.2k"
    expect(screen.getByText('4.2k')).toBeInTheDocument();
  });

  it('renders CTA links to /developers', () => {
    render(<DevRegistry groups={groups} total={20} />);
    const links = screen.getAllByRole('link', { name: /Explore the developer registry/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links[0]).toHaveAttribute('href', '/developers');
  });
});
