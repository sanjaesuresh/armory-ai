import { notFound } from 'next/navigation';
import { createCatalogRepository } from '@/lib/catalog/repository';
import CustomizeView from '@/components/CustomizeView';
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
      <main
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          We couldn&apos;t load this setup
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
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/catalog"
          style={{ fontSize: '0.875rem', color: '#555', textDecoration: 'underline' }}
        >
          ← Back to catalog
        </Link>
      </div>

      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
        {setup.name}
      </h1>
      <p style={{ color: '#555', fontSize: '0.95rem', margin: '0 0 2rem', lineHeight: 1.5 }}>
        {setup.description}
      </p>

      <CustomizeView setup={setup} />
    </main>
  );
}
