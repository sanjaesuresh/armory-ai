/**
 * FunctionChips — function filter chip row for the Developers dashboard.
 *
 * Derives available chips from the full item set via computeFunctionChips().
 * Renders only chips with ≥1 matching item. Clicking a chip narrows the list
 * to items whose tags intersect that chip's tag set; clicking again deselects.
 * Uses the same .chip class as the source-filter row for visual consistency.
 */

import { useMemo } from 'react';
import type { Setup } from '@/lib/setup/types';
import { computeFunctionChips } from '@/lib/catalog/functions';

interface FunctionChipsProps {
  /** Full unfiltered item set (so chip counts reflect the whole catalog). */
  items: Setup[];
  /** Currently active chip label, or null if none is selected. */
  activeChip: string | null;
  /** Called with the label to activate, or null to deselect. */
  onSelect: (label: string | null) => void;
}

export default function FunctionChips({
  items,
  activeChip,
  onSelect,
}: FunctionChipsProps) {
  const chips = useMemo(() => computeFunctionChips(items), [items]);

  if (chips.length === 0) return null;

  return (
    <div className="filter-row fn-chips" role="group" aria-label="Filter by function">
      {chips.map((chip) => {
        const isActive = activeChip === chip.label;
        return (
          <button
            key={chip.label}
            type="button"
            className="chip fn-chip"
            aria-pressed={isActive}
            onClick={() => onSelect(isActive ? null : chip.label)}
          >
            {chip.label}
            <span className="fn-chip-count" aria-hidden="true">
              {chip.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
