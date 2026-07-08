/**
 * ListTable — the "All setups / tools" dense typographic index.
 *
 * Visual treatment: category dot · name link · one-line clause · quiet
 * right-aligned mono meta (kind · Nf · ▲upvotes · source).
 * Hairline row separators, hover highlight. Not a table — plain div rows.
 *
 * Test-contract:
 *   - data-testid="row-{slug}" on each row div (mirrors the old <tr> testid).
 *   - Each row contains exactly one <a> (the name link), so
 *     within(row).getByRole('link') resolves without ambiguity.
 *   - Source label strings match vitest assertions exactly:
 *       source='ai-generated' → "AI"
 *       source='community'    → "Member post"
 */

import Link from 'next/link';
import type { Setup } from '@/lib/setup/types';
import { detailPathFor } from '@/lib/catalog/dashboard';
import { getCategoryAccent, getCategoryLabel } from '@/lib/catalog/categoryUtils';

interface ListTableProps {
  items: Setup[];
  variant: 'developers' | 'professionals';
}

// ── Source label ────────────────────────────────────────────────────────────

function sourceLabel(source: Setup['source']): { text: string; cls: string } {
  switch (source) {
    case 'curated':      return { text: 'reviewed',       cls: 'idx-src-cur' };
    case 'ai-generated': return { text: 'AI',             cls: 'idx-src-ai'  };
    case 'community':    return { text: 'Member post',    cls: 'idx-src-com' };
    case 'github':       return { text: 'community pick', cls: 'idx-src-com' };
    default:             return { text: '',               cls: ''             };
  }
}

// ── Kind label ──────────────────────────────────────────────────────────────

function kindLabel(kind: Setup['kind']): string {
  const MAP: Record<string, string> = {
    setup: 'Setup', agent: 'Agent', skill: 'Skill', harness: 'Harness',
  };
  return MAP[kind] ?? kind;
}

// ── Main export ─────────────────────────────────────────────────────────────

export default function ListTable({ items, variant }: ListTableProps) {
  const showKind = variant === 'developers';
  const noun = showKind ? 'tools' : 'setups';

  return (
    <div className="idx-table" role="list" aria-label={`All ${noun}`}>
      {items.map((setup) => {
        const dot = getCategoryAccent(setup.category);
        const catLabel = getCategoryLabel(setup.category);
        const href = detailPathFor(setup);
        const { text: src, cls: srcCls } = sourceLabel(setup.source);
        const fieldCount = setup.variables?.length ?? 0;
        const upvoteLabel = `${setup.upvotes} ${setup.upvotes === 1 ? 'upvote' : 'upvotes'}`;

        return (
          <div
            key={setup.slug}
            className="idx-row"
            data-testid={`row-${setup.slug}`}
            role="listitem"
          >
            {/* Category dot */}
            <span
              className="idx-dot"
              style={{ background: dot }}
              aria-label={catLabel}
              title={catLabel}
            />

            {/* Name — the only link in the row (required by test contract) */}
            <Link href={href} className="idx-name-link">
              {setup.name}
            </Link>

            {/* Tagline / one-line clause */}
            <span className="idx-clause">{setup.tagline}</span>

            {/* Quiet right-aligned meta */}
            <span className="idx-rt">
              <span className="idx-kd">
                {showKind ? kindLabel(setup.kind) : 'Setup'}
                {fieldCount > 0 ? ` · ${fieldCount}f` : ''}
              </span>
              <span className="idx-up" aria-label={upvoteLabel}>
                <span className="idx-up-arrow" aria-hidden="true">▲</span>
                {setup.upvotes}
              </span>
              {src && (
                <span className={`idx-src ${srcCls}`}>
                  {src}
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
