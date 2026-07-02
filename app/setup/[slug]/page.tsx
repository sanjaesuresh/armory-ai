import { notFound } from 'next/navigation';
import { createCatalogRepository } from '@/lib/catalog/repository';
import SetupDetail from '@/components/SetupDetail';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SetupPage({ params }: Props) {
  const { slug } = await params;

  const repo = createCatalogRepository();
  let setup;
  try {
    setup = await repo.getSetupBySlug(slug);
  } catch (err) {
    console.error('[setup] failed to load setup:', err);
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
              <strong>We couldn&apos;t load this setup</strong>
              <p>Please try again in a moment.</p>
              <Link href="/catalog" className="btn btn-outline btn-sm">
                Back to catalog
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!setup) {
    notFound();
  }

  return <SetupDetail setup={setup} />;
}
