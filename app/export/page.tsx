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
      <main
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          We couldn&apos;t load your export
        </h2>
        <p style={{ color: '#555', marginBottom: '1.25rem' }}>
          Please try again in a moment.
        </p>
        <Link href="/catalog" style={{ color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
          Back to catalog
        </Link>
      </main>
    );
  }

  if (!setup) {
    notFound();
  }

  return (
    <main
      style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href={`/setup/${setup.slug}`}
          style={{ fontSize: '0.875rem', color: '#555', textDecoration: 'underline' }}
        >
          ← Back
        </Link>
      </div>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1.5rem' }}>
        Your export
      </h1>

      <ExportView setup={setup} />
    </main>
  );
}
