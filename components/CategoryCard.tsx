/**
 * CategoryCard — a browsable card for a single catalog category.
 *
 * Renders as a <next/link> when `href` is supplied (page navigation) or as a
 * <button> when `onClick` is supplied / no href (filter action). Both variants
 * are fully keyboard-operable: focus-visible ring and appropriate ARIA roles
 * are handled by the CSS and the element's native semantics.
 *
 * The accent edge is driven by the `--cat-accent` CSS custom property set
 * inline, which the `.category-card` CSS picks up via
 * `box-shadow: inset 3px 0 0 var(--cat-accent, transparent)`.
 */

import Link from 'next/link';
import type React from 'react';
import type { Category } from '@/lib/setup/types';
import {
  getCategoryTint,
  getCategoryLabel,
  getCategoryAccent,
  getCategoryBlurb,
} from '@/lib/catalog/categoryUtils';

interface CategoryCardProps {
  category: Category;
  /** Number of setups in this category — rendered faithfully, never fabricated. */
  count: number;
  /** When provided the card renders as a Next.js Link (navigation). */
  href?: string;
  /** When provided (and no href) the card renders as a button. */
  onClick?: () => void;
  /** Marks the card as the currently selected/active category. */
  active?: boolean;
}

export default function CategoryCard({
  category,
  count,
  href,
  onClick,
  active,
}: CategoryCardProps) {
  const tint = getCategoryTint(category);
  const label = getCategoryLabel(category);
  // getCategoryAccent returns e.g. 'var(--accent-butter)' — set as CSS var
  const accent = getCategoryAccent(category);
  const blurb = getCategoryBlurb(category);

  const className = `category-card${active ? ' is-active' : ''}`;
  const countLabel = `${count} ${count === 1 ? 'setup' : 'setups'}`;
  // CSS custom properties require a cast through React.CSSProperties
  const catStyle = { '--cat-accent': accent } as React.CSSProperties;

  const inner = (
    <>
      {/* Category chip: tint background + accent dot (no emoji — §10) */}
      <span className={`cat-chip ${tint}`} aria-hidden="true">
        <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: accent }} />
      </span>
      <strong>{label}</strong>
      <span className="cat-count">{countLabel}</span>
      <p className="cat-blurb">{blurb}</p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        style={catStyle}
        aria-current={active ? 'page' : undefined}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      style={catStyle}
      onClick={onClick}
      aria-pressed={active}
    >
      {inner}
    </button>
  );
}
