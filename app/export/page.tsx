import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createCatalogRepository } from '@/lib/catalog/repository';
import ExportView from '@/components/ExportView';

interface Props {
  searchParams: Promise<{ setup?: string }>;
}

export default async function ExportPage({ searchParams }: Props) {
  const { setup: setupSlug } = await searchParams;

  const repo = createCatalogRepository();
  let setup;
  try {
    setup = await repo.getSetupBySlug(setupSlug ?? '');
  } catch (err) {
    console.error('[export] failed to load setup:', err);
    return (
      <main>
        <div className="wrap" style={{ paddingTop: '48px', paddingBottom: '72px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            We couldn&apos;t load your export
          </h2>
          <p className="muted" style={{ marginBottom: '1.25rem' }}>
            Please try again in a moment.
          </p>
          <Link href="/catalog" className="btn btn-outline">
            Back to catalog
          </Link>
        </div>
      </main>
    );
  }

  if (!setup) {
    notFound();
  }

  return (
    <main>
      <ExportView setup={setup} />
    </main>
  );
}
