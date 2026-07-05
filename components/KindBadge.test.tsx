/**
 * KindBadge tests.
 * Environment: jsdom (dom project).
 *
 * KindBadge renders nothing for kind='setup' and a labelled pill for each
 * registry kind (agent / skill / harness).
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import KindBadge from './KindBadge';

describe('KindBadge', () => {
  it('renders "Agent" for an agent kind', () => {
    render(<KindBadge kind="agent" />);
    expect(screen.getByText('Agent')).toBeInTheDocument();
  });

  it('renders "Skill" for a skill kind', () => {
    render(<KindBadge kind="skill" />);
    expect(screen.getByText('Skill')).toBeInTheDocument();
  });

  it('renders "Harness" for a harness kind', () => {
    render(<KindBadge kind="harness" />);
    expect(screen.getByText('Harness')).toBeInTheDocument();
  });

  it('renders nothing for a setup kind', () => {
    const { container } = render(<KindBadge kind="setup" />);
    expect(container).toBeEmptyDOMElement();
  });
});
