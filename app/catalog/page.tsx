import Link from 'next/link';
import { createCatalogRepository } from '@/lib/catalog/repository';
import BrowseSetups from '@/components/BrowseSetups';

interface CatalogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const roleParam =
    typeof params.role === 'string' ? params.role : undefined;
  const catParam =
    typeof params.cat === 'string' ? params.cat : undefined;
  // `undefined` = goals param absent (show chip prompt); `""` = skipped;
  // `"tag1,tag2"` = committed selection.  Never coerce a missing param to "".
  const goalsParam =
    typeof params.goals === 'string' ? params.goals : undefined;

  const repo = createCatalogRepository();
  let allSetups: Awaited<ReturnType<typeof repo.getSetups>>;
  try {
    allSetups = await repo.getSetups();
  } catch (err) {
    console.error('[catalog] failed to load setups:', err);
    return (
      <main className="section-tight">
        <div className="wrap">
          <div
            className="error-banner"
            role="alert"
            style={{ maxWidth: '540px' }}
          >
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
              <Link href="/catalog" className="btn btn-outline btn-sm">
                Try again
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section-tight">
      <div className="wrap">
        <BrowseSetups
          allSetups={allSetups}
          initialRole={roleParam}
          initialCat={catParam}
          initialGoals={goalsParam}
        />
      </div>
    </main>
  );
}
