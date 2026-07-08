import Link from 'next/link';
import { createCatalogRepository } from '@/lib/catalog/repository';
import { isProfessionalItem } from '@/lib/catalog/dashboard';
import { recommend } from '@/lib/catalog/recommender';
import DashboardView from '@/components/dashboard/DashboardView';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProfessionalsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const role = typeof params.role === 'string' ? params.role : undefined;
  const cat = typeof params.cat === 'string' ? params.cat : undefined;
  // `undefined` = goals param absent (show chip prompt); `""` = skipped;
  // `"tag1,tag2"` = committed selection. Never coerce a missing param to "".
  const goals = typeof params.goals === 'string' ? params.goals : undefined;

  const repo = createCatalogRepository();
  let allSetups: Awaited<ReturnType<typeof repo.getSetups>>;
  try {
    allSetups = await repo.getSetups();
  } catch (err) {
    console.error('[professionals] failed to load setups:', err);
    return (
      <main className="section-tight">
        <div className="wrap">
          <div className="error-banner" role="alert" style={{ maxWidth: '540px' }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 4 2.8 19.5h18.4z" />
              <path d="M12 10v4.5M12 17.2v.1" />
            </svg>
            <div>
              <strong>We couldn&apos;t load the setups</strong>
              <p>Please try again in a moment.</p>
              <Link href="/professionals" className="btn btn-outline btn-sm">
                Try again
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const items = allSetups.filter(isProfessionalItem);

  // Recommender strip: only when a role is chosen. Goal tags refine the picks.
  let rolePicks;
  if (role) {
    const goalTagIds = goals ? goals.split(',').filter(Boolean) : [];
    const { topPicks, whyLabels, fallback } = recommend(items, { role, goalTagIds });
    rolePicks = { items: topPicks, whyLabels, fallback };
  }

  // Goal-chip prompt shows only when a role is present and goals is still absent.
  const goalChips = role && goals === undefined ? { role, cat } : undefined;

  return (
    <main className="section-tight">
      <div className="wrap">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <Link href="/jobs" className="small muted" style={{ fontWeight: 600 }}>
            Browse by job →
          </Link>
        </div>
        <DashboardView
          items={items}
          variant="professionals"
          rolePicks={rolePicks}
          goalChips={goalChips}
          initialCat={cat}
        />
      </div>
    </main>
  );
}
