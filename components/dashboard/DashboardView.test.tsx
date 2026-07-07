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

describe('DashboardView — featured lead', () => {
  it('renders the featured lead heading, with the top-featured item as hero and non-featured items as runners', () => {
    // Phase 3 design change: the old "Armory Approved" / "Most Popular" named shelves
    // are replaced by a single "Most equipped this week" editorial section.
    //   shelf-approved  → wraps the #1 featured item (the hero card)
    //   shelf-popular   → wraps the top-2 non-featured items (the runners)
    // Only the single top-featured item (alpha, featured=1) appears as the hero;
    // bravo (featured=2) is not surfaced — the editorial lead is singular.
    const items = [
      makeSetup({ slug: 'alpha', name: 'Alpha', featured: 1 }),
      makeSetup({ slug: 'bravo', name: 'Bravo', featured: 2 }),
      makeSetup({ slug: 'charlie', name: 'Charlie', featured: null, upvotes: 8 }),
      makeSetup({ slug: 'delta', name: 'Delta', featured: null, upvotes: 4 }),
    ];
    render(<DashboardView items={items} variant="professionals" />);

    // The featured lead section heading.
    expect(screen.getByRole('heading', { name: 'Most equipped this week' })).toBeInTheDocument();

    const approved = screen.getByTestId('shelf-approved');
    const popular = screen.getByTestId('shelf-popular');

    // Hero slot: only the #1 featured item (alpha).
    expect(within(approved).getByTestId('setup-card-alpha')).toBeInTheDocument();
    expect(within(approved).queryByTestId('setup-card-charlie')).toBeNull();

    // Runners: top-2 non-featured items (charlie > delta by upvotes); alpha is excluded.
    expect(within(popular).getByTestId('setup-card-charlie')).toBeInTheDocument();
    expect(within(popular).queryByTestId('setup-card-alpha')).toBeNull();
  });
});

describe('DashboardView — featured lead (empty-approved fallback)', () => {
  it('promotes popular[0] to hero when no items have a featured rank', () => {
    // Phase 3 fix: when approvedShelf returns [] (no featured items), FeaturedLead
    // uses popular[0] as the hero so shelf-approved always renders when there is data.
    const items = [
      makeSetup({ slug: 'echo', name: 'Echo', featured: null, upvotes: 10 }),
      makeSetup({ slug: 'foxtrot', name: 'Foxtrot', featured: null, upvotes: 5 }),
      makeSetup({ slug: 'golf', name: 'Golf', featured: null, upvotes: 2 }),
    ];
    render(<DashboardView items={items} variant="professionals" />);

    // shelf-approved must be present (popular fallback hero)
    const approved = screen.getByTestId('shelf-approved');
    // Echo has the most upvotes → popularShelf ranks it first → becomes hero
    expect(within(approved).getByTestId('setup-card-echo')).toBeInTheDocument();

    // shelf-popular has runners (foxtrot and golf, skipping echo)
    const popular = screen.getByTestId('shelf-popular');
    expect(within(popular).getByTestId('setup-card-foxtrot')).toBeInTheDocument();
    // Echo must NOT appear in runners (it is the hero)
    expect(within(popular).queryByTestId('setup-card-echo')).toBeNull();
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

describe('DashboardView — list author attribution', () => {
  it('labels an ai-generated setup "AI-generated" in the Author column, never "Member post"', () => {
    const items = [
      makeSetup({ slug: 'gen', name: 'Generated', source: 'ai-generated', author: null }),
      makeSetup({ slug: 'member', name: 'Member', source: 'community', author: null }),
    ];
    render(<DashboardView items={items} variant="professionals" />);

    const genRow = screen.getByTestId('row-gen');
    expect(within(genRow).getByText('AI-generated')).toBeInTheDocument();
    expect(within(genRow).queryByText('Member post')).toBeNull();

    // Author-less community rows keep the existing "Member post" label.
    const memberRow = screen.getByTestId('row-member');
    expect(within(memberRow).getByText('Member post')).toBeInTheDocument();
  });
});
