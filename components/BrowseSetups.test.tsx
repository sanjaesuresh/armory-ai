/**
 * BrowseSetups recommender-rendering tests (Phase 3 Task 6).
 * Environment: jsdom. Deterministic — fabricated setups, no Supabase.
 * initialGoals="" keeps the GoalChips row (which needs a router) out of render.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BrowseSetups from './BrowseSetups';
import type { Setup } from '@/lib/setup/types';

function makeSetup(over: Partial<Setup>): Setup {
  return {
    id: over.slug ?? 'x',
    slug: 'x',
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
    updatedAt: '2020-01-01T00:00:00Z', // stale → no freshness bump, deterministic
    reviewStatus: 'approved',
    upvotes: 0,
    featured: 1,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',
    instructionTemplate: 'You are a helper.',
    variables: [],
    knowledgeFiles: [],
    scenarios: [],
    ...over,
  };
}

describe('BrowseSetups — recommender rendering', () => {
  it('shows a why-label on a role-matched recommended card', () => {
    const setups = [makeSetup({ slug: 'mm', role: 'Marketing Manager', name: 'Marketing Manager' })];
    render(<BrowseSetups allSetups={setups} initialRole="marketing-manager" initialGoals="" />);

    expect(screen.getByTestId('recommended-section')).toBeTruthy();
    expect(screen.getByTestId('recommended-heading').textContent).toMatch(/Recommended for you/i);
    expect(screen.getByTestId('card-why-label').textContent).toMatch(/Matches your role/i);
  });

  it('shows the honest fallback heading for a niche role with a popular setup', () => {
    // Recruiter has no role/tag match here, so nothing clears the threshold →
    // fallback, and the popular (popularity>0) setup fills the slot.
    const setups = [makeSetup({ slug: 'mm', role: 'Marketing Manager', popularity: 12 })];
    render(<BrowseSetups allSetups={setups} initialRole="recruiter" initialGoals="" />);

    expect(screen.getByTestId('fallback-section')).toBeTruthy();
    expect(screen.getByTestId('recommended-heading').textContent).toMatch(/Nothing tailored yet/i);
    // Fallback cards carry no why-labels (nothing honest to claim).
    expect(screen.queryByTestId('card-why-label')).toBeNull();
  });

  it('shows no recommended section or why-labels on the browse-popular path (no role)', () => {
    const setups = [makeSetup({ slug: 'mm' })];
    render(<BrowseSetups allSetups={setups} />);

    expect(screen.queryByTestId('recommended-section')).toBeNull();
    expect(screen.queryByTestId('fallback-section')).toBeNull();
    expect(screen.queryByTestId('card-why-label')).toBeNull();
  });
});
