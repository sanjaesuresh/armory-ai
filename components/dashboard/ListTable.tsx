import Link from 'next/link';
import type { Setup } from '@/lib/setup/types';
import { detailPathFor } from '@/lib/catalog/dashboard';
import { getCategoryLabel } from '@/lib/catalog/categoryUtils';
import KindBadge from '../KindBadge';

interface ListTableProps {
  items: Setup[];
  variant: 'developers' | 'professionals';
}

/** Author attribution matching the mock: the Armory team for curated, the
 *  truncated author handle for community/AI-drafted items. */
function authorLabel(setup: Setup): string {
  if (setup.source === 'curated') return 'Armory team';
  if (setup.author) {
    const handle = setup.author.length > 12 ? `${setup.author.slice(0, 12)}…` : setup.author;
    return `author ${handle}`;
  }
  return 'Community';
}

/** "Jul 2, 2026"-style short date from an ISO string; empty string when unset. */
function formatUpdated(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * The full catalog / registry as a semantic table. The developers variant adds
 * a Kind column; both link the item name via detailPathFor (setup → /setup,
 * registry kinds → /dev). Category / Author / Updated collapse below 640px
 * (see .reg-hide-sm), keeping the name, kind, and upvotes readable at 390px.
 */
export default function ListTable({ items, variant }: ListTableProps) {
  const isDevelopers = variant === 'developers';
  const noun = isDevelopers ? 'tools' : 'setups';

  return (
    <div className="reg-scroll">
      <table className="reg-table">
        <caption className="sr-only">All {noun}</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            {isDevelopers && <th scope="col">Kind</th>}
            <th scope="col" className="reg-hide-sm">
              Category
            </th>
            <th scope="col" className="reg-hide-sm">
              Author
            </th>
            <th scope="col">Upvotes</th>
            <th scope="col" className="reg-hide-sm">
              Updated
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((setup) => {
            const upvoteLabel = `${setup.upvotes} ${setup.upvotes === 1 ? 'upvote' : 'upvotes'}`;
            return (
              <tr key={setup.slug} data-testid={`row-${setup.slug}`}>
                <td className="reg-name">
                  <Link href={detailPathFor(setup)}>
                    <strong>{setup.name}</strong>
                    <span>{setup.tagline}</span>
                  </Link>
                </td>
                {isDevelopers && (
                  <td>
                    <KindBadge kind={setup.kind} />
                  </td>
                )}
                <td className="reg-hide-sm">{getCategoryLabel(setup.category)}</td>
                <td className="reg-hide-sm">{authorLabel(setup)}</td>
                <td className="reg-num">
                  <span aria-label={upvoteLabel}>▲ {setup.upvotes}</span>
                </td>
                <td className="reg-updated reg-hide-sm">{formatUpdated(setup.updatedAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
