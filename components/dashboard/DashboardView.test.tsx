/**
 * DashboardView tests.
 * Environment: jsdom (dom project). Deterministic — fabricated setups, no
 * Supabase and no router (rolePicks / goalChips props are omitted so the
 * recommender strip and GoalChips row never render).
 */

import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DashboardView from './DashboardView';
import type { Setup, SetupKind } from '@/lib/setup/types';

function makeSetup(over: Partial<Setup>): Setup {
  return {
    kind: 'setup',
    id: over.slug ?? over.id ?? 'x',
    slug: over.slug ?? 'x',
    name: 'X Setup',
    tagline: 'A tagline.',
    description: 'A description.',
    role: 'Marketing Manager',
    industry: null,
    tags: [],
    category: 'marketing',
    source: 'curated',
    author: null,
    version: '1.0.0',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2020-01-01T00:00:00Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',
    instructionTemplate: 'You are a helper.',
    variables: [],
    knowledgeFiles: [],
    scenarios: [],
    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
    ...over,
  };
}

describe('DashboardView — shelves', () => {
  it('renders the "Armory Approved" and "Most Popular" shelf headings, with only featured items on the first shelf and no repeats across both', () => {
    const items = [
      makeSetup({ slug: 'alpha', name: 'Alpha', featured: 1 }),
      makeSetup({ slug: 'bravo', name: 'Bravo', featured: 2 }),
      makeSetup({ slug: 'charlie', name: 'Charlie', featured: null, upvotes: 8 }),
      makeSetup({ slug: 'delta', name: 'Delta', featured: null, upvotes: 4 }),
    ];
    render(<DashboardView items={items} variant="professionals" />);

    // Both shelf headings present.
    expect(screen.getByRole('heading', { name: 'Armory Approved' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Most Popular' })).toBeInTheDocument();

    const approved = screen.getByTestId('shelf-approved');
    const popular = screen.getByTestId('shelf-popular');

    // Only featured items on the Approved shelf.
    expect(within(approved).getByTestId('setup-card-alpha')).toBeInTheDocument();
    expect(within(approved).getByTestId('setup-card-bravo')).toBeInTheDocument();
    expect(within(approved).queryByTestId('setup-card-charlie')).toBeNull();

    // Popular carries the non-featured items and never repeats an Approved item.
    expect(within(popular).getByTestId('setup-card-charlie')).toBeInTheDocument();
    expect(within(popular).queryByTestId('setup-card-alpha')).toBeNull();
  });
});

describe('DashboardView — list search & filters', () => {
  it('typing a query filters the list rows', () => {
    const items = [
      makeSetup({ slug: 'alpha', name: 'Alpha' }),
      makeSetup({ slug: 'bravo', name: 'Bravo' }),
    ];
    render(<DashboardView items={items} variant="professionals" />);

    expect(screen.getByTestId('row-alpha')).toBeInTheDocument();
    expect(screen.getByTestId('row-bravo')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Search setups'), {
      target: { value: 'Alpha' },
    });

    expect(screen.getByTestId('row-alpha')).toBeInTheDocument();
    expect(screen.queryByTestId('row-bravo')).toBeNull();
  });

  it('developers variant shows a kind filter; filtering to Skills hides agent rows', () => {
    const items = [
      makeSetup({ slug: 'reviewer', name: 'Reviewer', kind: 'agent' }),
      makeSetup({ slug: 'committer', name: 'Committer', kind: 'skill' }),
    ];
    render(<DashboardView items={items} variant="developers" />);

    // The kind filter group exists (professionals uses a category group instead).
    expect(screen.getByRole('group', { name: 'Filter by kind' })).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Filter by category' })).toBeNull();

    expect(screen.getByTestId('row-reviewer')).toBeInTheDocument();
    expect(screen.getByTestId('row-committer')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Skills' }));

    expect(screen.queryByTestId('row-reviewer')).toBeNull();
    expect(screen.getByTestId('row-committer')).toBeInTheDocument();
  });

  it('professionals variant shows category chips instead of the kind filter', () => {
    const items = [makeSetup({ slug: 'alpha', name: 'Alpha' })];
    render(<DashboardView items={items} variant="professionals" />);

    expect(
      screen.getByRole('group', { name: 'Filter by category' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Filter by kind' })).toBeNull();
  });

  it('an empty filter result renders the shared empty-state component', () => {
    const items = [makeSetup({ slug: 'alpha', name: 'Alpha' })];
    render(<DashboardView items={items} variant="professionals" />);

    fireEvent.change(screen.getByLabelText('Search setups'), {
      target: { value: 'no-such-thing-xyz' },
    });

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.queryByTestId('row-alpha')).toBeNull();
  });
});

describe('DashboardView — row links via detailPathFor', () => {
  it('links a core setup row to /setup/[slug] and an agent row to /dev/[slug]', () => {
    const items: Setup[] = [
      makeSetup({ slug: 'adv-setup', name: 'Advanced Setup', kind: 'setup' as SetupKind, tier: 'advanced' }),
      makeSetup({ slug: 'my-agent', name: 'My Agent', kind: 'agent' as SetupKind }),
    ];
    render(<DashboardView items={items} variant="developers" />);

    const setupRow = screen.getByTestId('row-adv-setup');
    expect(within(setupRow).getByRole('link')).toHaveAttribute(
      'href',
      '/setup/adv-setup',
    );

    const agentRow = screen.getByTestId('row-my-agent');
    expect(within(agentRow).getByRole('link')).toHaveAttribute(
      'href',
      '/dev/my-agent',
    );
  });
});
