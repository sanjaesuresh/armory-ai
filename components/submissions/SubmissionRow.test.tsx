/**
 * SubmissionRow tests (T10).
 * Environment: jsdom (dom project — components/**\/*.test.tsx).
 *
 * SubmissionRow is extracted from MySubmissionsPage's rows.map(...) so that
 * the badge and link behaviour can be asserted against real rendered DOM.
 * Tests here genuinely fail if <KindBadge> is removed from SubmissionRow
 * or if the "Continue building" href is changed.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SubmissionRow from './SubmissionRow';

// next/link needs a mock in jsdom — no Next.js routing context available.
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock SubmissionActions — it has its own tests; here we only need it to render.
vi.mock('./SubmissionActions', () => ({
  default: ({ id, reviewStatus }: { id: string; reviewStatus: string }) => (
    <div data-testid={`mock-actions-${id}`} data-review-status={reviewStatus} />
  ),
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

const UPDATED_AT = '2026-06-01T00:00:00Z';

const setupDraft = {
  id: 'setup-draft-1',
  name: 'My Marketing Setup',
  kind: 'setup' as const,
  reviewStatus: 'draft' as const,
  reviewNote: null,
  upvotes: 0,
  updatedAt: UPDATED_AT,
  slug: 'my-marketing-setup',
};

const skillDraft = {
  id: 'skill-draft-1',
  name: 'My Code Skill',
  kind: 'skill' as const,
  reviewStatus: 'draft' as const,
  reviewNote: null,
  upvotes: 0,
  updatedAt: UPDATED_AT,
  slug: 'my-code-skill',
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('SubmissionRow', () => {
  // ── Kind badge — genuinely fails if KindBadge is removed ──────────────────

  it('renders no kind badge for a setup draft', () => {
    render(<SubmissionRow {...setupDraft} />);
    // KindBadge returns null for 'setup' — no kind-badge testid is present.
    expect(screen.queryByTestId(/^kind-badge-/)).toBeNull();
  });

  it('renders a Skill badge for a skill draft', () => {
    render(<SubmissionRow {...skillDraft} />);
    expect(screen.getByTestId('kind-badge-skill')).toBeInTheDocument();
    expect(screen.getByTestId('kind-badge-skill').textContent).toBe('Skill');
  });

  it('renders an Agent badge for an agent draft', () => {
    render(<SubmissionRow {...setupDraft} id="agent-1" kind="agent" />);
    expect(screen.getByTestId('kind-badge-agent')).toBeInTheDocument();
  });

  // ── Build link — genuinely fails if href changes ───────────────────────────

  it('renders a "Continue building" link to /build/<id> for a setup draft', () => {
    render(<SubmissionRow {...setupDraft} />);
    const link = screen.getByRole('link', { name: /continue building/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/build/setup-draft-1');
  });

  it('renders a "Continue building" link to /build/<id> for a skill draft', () => {
    render(<SubmissionRow {...skillDraft} />);
    const link = screen.getByRole('link', { name: /continue building/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/build/skill-draft-1');
  });

  // ── Row identity ───────────────────────────────────────────────────────────

  it('includes the item id in the row data-testid', () => {
    render(<SubmissionRow {...setupDraft} />);
    expect(screen.getByTestId('submission-row-setup-draft-1')).toBeInTheDocument();
  });

  // ── Approved row ───────────────────────────────────────────────────────────

  it('renders a "View public page" link pointing to /setup/<slug>', () => {
    render(<SubmissionRow {...setupDraft} reviewStatus="approved" upvotes={5} />);
    const link = screen.getByRole('link', { name: /view public page/i });
    expect(link).toHaveAttribute('href', '/setup/my-marketing-setup');
  });

  // ── Pending / rejected rows ────────────────────────────────────────────────

  it('renders SubmissionActions for a pending item', () => {
    render(<SubmissionRow {...setupDraft} reviewStatus="pending" />);
    expect(screen.getByTestId('mock-actions-setup-draft-1')).toBeInTheDocument();
  });

  it('renders the moderator note for a rejected item', () => {
    render(
      <SubmissionRow
        {...setupDraft}
        reviewStatus="rejected"
        reviewNote="Template violates guidelines."
      />,
    );
    expect(screen.getByText(/Moderator note:/)).toBeInTheDocument();
    expect(screen.getByText(/Template violates guidelines\./)).toBeInTheDocument();
  });

  it('does not render a moderator note section when reviewNote is null', () => {
    render(<SubmissionRow {...setupDraft} reviewStatus="rejected" reviewNote={null} />);
    expect(screen.queryByText(/Moderator note:/)).toBeNull();
  });
});
