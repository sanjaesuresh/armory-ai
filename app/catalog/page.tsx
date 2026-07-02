import Link from 'next/link';
import { createCatalogRepository } from '@/lib/catalog/repository';
import { recommend } from '@/lib/catalog/recommender';
import SetupCard from '@/components/SetupCard';
import EmptyState from '@/components/EmptyState';

interface CatalogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const roleParam = typeof params.role === 'string' ? params.role : undefined;

  const repo = createCatalogRepository();
  let allSetups: Awaited<ReturnType<typeof repo.getSetups>>;
  try {
    allSetups = await repo.getSetups();
  } catch (err) {
    console.error('[catalog] failed to load setups:', err);
    return (
      <main
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          We couldn&apos;t load the setups
        </h2>
        <p style={{ color: '#555', marginBottom: '1.25rem' }}>
          Please try again in a moment.
        </p>
        <Link href="/catalog" style={{ color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
          Try again
        </Link>
      </main>
    );
  }

  const hasRoleFilter = roleParam !== undefined;

  let topPicks = allSetups;
  let remainder: typeof allSetups = [];

  if (hasRoleFilter) {
    const result = recommend(allSetups, { role: roleParam });
    topPicks = result.topPicks;
    remainder = result.remainder;
  }

  return (
    <main
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <p
        data-testid="setup-explainer"
        style={{
          color: '#555',
          fontSize: '0.95rem',
          marginBottom: '2rem',
          padding: '0.75rem 1rem',
          background: '#f5f5f5',
          borderRadius: '6px',
          lineHeight: 1.5,
        }}
      >
        A setup is a ready-made set of instructions you paste into Claude to make it act like a
        specialist — no technical knowledge needed.
      </p>

      {hasRoleFilter ? (
        <>
          {topPicks.length === 0 ? (
            <EmptyState showClearLink />
          ) : (
            <>
              <section data-testid="recommended-section">
                <h2
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    marginTop: 0,
                  }}
                >
                  Recommended for you
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  {topPicks.map((setup) => (
                    <SetupCard key={setup.slug} setup={setup} />
                  ))}
                </div>
              </section>

              {remainder.length > 0 && (
                <section style={{ marginTop: '2rem' }}>
                  <h2
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      marginBottom: '1rem',
                      marginTop: 0,
                      color: '#444',
                    }}
                  >
                    More setups
                  </h2>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: '1rem',
                    }}
                  >
                    {remainder.map((setup) => (
                      <SetupCard key={setup.slug} setup={setup} />
                    ))}
                  </div>
                </section>
              )}

              <div style={{ marginTop: '1.5rem' }}>
                <Link
                  href="/catalog"
                  style={{ color: '#555', fontSize: '0.9rem' }}
                >
                  Show all setups
                </Link>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {allSetups.length === 0 ? (
            <EmptyState />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1rem',
              }}
            >
              {allSetups.map((setup) => (
                <SetupCard key={setup.slug} setup={setup} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
