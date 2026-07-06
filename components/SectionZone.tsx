/**
 * SectionZone — a <section> wrapper that applies the visual zone system.
 *
 * Maps directly to the `.zone` + `.zone-{variant}` CSS classes defined in
 * `app/globals.css`. The `tint` and `className` props let callers layer
 * pastel tint backgrounds (e.g. `tint-butter`) or additional utility classes.
 *
 * Variant reference (see globals.css for pixel-exact rules):
 *   canvas   — transparent (inherits body --surface-canvas)  [default]
 *   raised   — --surface-raised bg + hairline border + shadow-1
 *   tint     — hairline border-top + border-bottom only
 *   elevated — --surface-raised bg + shadow-3 (strong lift)
 */

import type React from 'react';

interface SectionZoneProps {
  variant?: 'canvas' | 'raised' | 'tint' | 'elevated';
  /** Optional pastel tint class, e.g. 'tint-butter'. Applied alongside zone classes. */
  tint?: string;
  /** Additional class names to merge. */
  className?: string;
  children: React.ReactNode;
}

export default function SectionZone({
  variant = 'canvas',
  tint,
  className,
  children,
}: SectionZoneProps) {
  const classes = ['zone', `zone-${variant}`, tint, className]
    .filter(Boolean)
    .join(' ');

  return <section className={classes}>{children}</section>;
}
