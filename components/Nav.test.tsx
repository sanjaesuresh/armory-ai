/**
 * Nav component tests.
 * Environment: jsdom (routed via vitest.config.ts dom project).
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Nav from './Nav';

// next/link renders a plain <a> in jsdom
describe('Nav', () => {
  it('renders the brand logo link to /', () => {
    render(<Nav />);
    const brand = screen.getByRole('link', { name: /Armory/i });
    expect(brand).toHaveAttribute('href', '/');
  });

  it('renders "Browse setups" link to /catalog', () => {
    render(<Nav />);
    const link = screen.getByRole('link', { name: 'Browse setups' });
    expect(link).toHaveAttribute('href', '/catalog');
  });

  it('renders "How it works" link to /#how', () => {
    render(<Nav />);
    const link = screen.getByRole('link', { name: 'How it works' });
    expect(link).toHaveAttribute('href', '/#how');
  });

  it('renders "Get started" CTA link(s) to /start', () => {
    render(<Nav />);
    // Two links: the desktop nav-cta and the mobile-only nav-mobile-cta inside the dropdown.
    // Both must point to /start.
    const links = screen.getAllByRole('link', { name: 'Get started' });
    expect(links.length).toBeGreaterThanOrEqual(1);
    links.forEach((link) => expect(link).toHaveAttribute('href', '/start'));
  });

  it('burger button starts with aria-expanded=false', () => {
    render(<Nav />);
    const burger = screen.getByRole('button', { name: /open menu/i });
    expect(burger).toHaveAttribute('aria-expanded', 'false');
  });

  it('burger toggles aria-expanded to true on click', () => {
    render(<Nav />);
    const burger = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(burger);
    expect(burger).toHaveAttribute('aria-expanded', 'true');
  });

  it('burger toggles aria-expanded back to false on second click', () => {
    render(<Nav />);
    const burger = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(burger);
    fireEvent.click(burger);
    expect(burger).toHaveAttribute('aria-expanded', 'false');
  });

  it('pressing Escape closes the menu and aria-expanded returns to false', () => {
    render(<Nav />);
    const burger = screen.getByRole('button', { name: /open menu/i });

    // Open it
    fireEvent.click(burger);
    expect(burger).toHaveAttribute('aria-expanded', 'true');

    // Close via Escape
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(burger).toHaveAttribute('aria-expanded', 'false');
  });

  it('burger has aria-controls pointing to the nav links element', () => {
    render(<Nav />);
    const burger = screen.getByRole('button', { name: /open menu/i });
    expect(burger).toHaveAttribute('aria-controls', 'navLinks');
    expect(document.getElementById('navLinks')).not.toBeNull();
  });

  it('clicking burger open adds "open" class to the nav element', () => {
    render(<Nav />);
    const burger = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(burger);
    // header has className="nav open" when open
    expect(document.querySelector('.nav')).toHaveClass('open');
  });

  it('pressing Escape removes "open" class from the nav element', () => {
    render(<Nav />);
    const burger = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(burger);
    expect(document.querySelector('.nav')).toHaveClass('open');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.querySelector('.nav')).not.toHaveClass('open');
  });
});
