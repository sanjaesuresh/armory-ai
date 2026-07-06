/**
 * SectionHead — section heading with optional eyebrow and inline action.
 *
 * Without `action`:  renders `.section-head` (heading + optional eyebrow, no flex).
 * With `action`:     renders `.section-head-row` (flex row, heading left / action right).
 *
 * Both variants produce the 28px bottom margin defined in globals.css.
 * The `h2` inside follows the `clamp(1.45rem, 2.6vw, 2rem)` type scale from
 * `.section-head h2` in globals.css.
 */

import type React from 'react';

interface SectionHeadProps {
  /** Small all-caps label above the title (e.g. "Popular this month"). */
  eyebrow?: string;
  /** Main section heading — rendered as an <h2>. */
  title: string;
  /** Optional CTA or link node placed on the right (only in the row layout). */
  action?: React.ReactNode;
}

export default function SectionHead({ eyebrow, title, action }: SectionHeadProps) {
  const headingContent = (
    <>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
    </>
  );

  if (action) {
    // section-head-row: flex row with heading on left, action on right
    return (
      <div className="section-head-row">
        <div>{headingContent}</div>
        {action}
      </div>
    );
  }

  return <div className="section-head">{headingContent}</div>;
}
