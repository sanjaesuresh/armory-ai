import Link from 'next/link';
import { createCatalogRepository } from '@/lib/catalog/repository';
import { isDeveloperItem } from '@/lib/catalog/dashboard';
import DashboardView from '@/components/dashboard/DashboardView';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DevelopersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const kind = typeof params.kind === 'string' ? params.kind : undefined;

  const repo = createCatalogRepository();
  let allSetups: Awaited<ReturnType<typeof repo.getSetups>>;
  try {
    allSetups = await repo.getSetups();
  } catch (err) {
    console.error('[developers] failed to load registry:', err);
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
              <strong>We couldn&apos;t load the registry</strong>
              <p>Please try again in a moment.</p>
              <Link href="/developers" className="btn btn-outline btn-sm">
                Try again
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const items = allSetups.filter(isDeveloperItem);

  return (
    <main className="section-tight">
      <div className="wrap">
        <DashboardView items={items} variant="developers" initialKind={kind} />
      </div>
    </main>
  );
}
