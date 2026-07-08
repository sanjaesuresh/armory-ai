import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createCatalogRepository } from '@/lib/catalog/repository';
import { isProfessionalItem } from '@/lib/catalog/dashboard';
import SetupCard from '@/components/SetupCard';

interface Props {
  params: Promise<{ role: string }>;
}

// lowercase, spaces→hyphens, strip non-alphanumeric except hyphens — mirrors the index page
function toJobSlug(role: string): string {
  return role.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
}

/* Arrow-left icon — aria-hidden so the link text is the accessible name */
const ArrowLeftIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M19.5 12h-15M10 6.5 4.5 12 10 17.5" />
  </svg>
);

/* Error banner SVG — reused in both the page-level and error-boundary renders */
const WarnIcon = () => (
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
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { role: slug } = await params;
  // reconstruct a display name from the slug without an extra DB call
  const display = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${display} · Armory`,
    description: `AI setups and skills for the ${display} role — customize and export to Claude or ChatGPT.`,
    openGraph: {
      title: `${display} · Armory`,
      description: `AI setups and skills for the ${display} role.`,
      url: `/jobs/${slug}`,
      type: 'website',
    },
  };
}

export default async function JobHubPage({ params }: Props) {
  const { role: slug } = await params;

  const repo = createCatalogRepository();
  let allSetups: Awaited<ReturnType<typeof repo.getSetups>>;
  try {
    allSetups = await repo.getSetups();
  } catch (err) {
    console.error(`[jobs/${slug}] failed to load setups:`, err);
    return (
      <main className="section-tight">
        <div className="wrap">
          <Link href="/jobs" className="back-link">
            <ArrowLeftIcon />
            All jobs
          </Link>
          <div
            className="error-banner"
            role="alert"
            style={{ maxWidth: '540px', marginTop: '20px' }}
          >
            <WarnIcon />
            <div>
              <strong>Couldn&apos;t load this job</strong>
              <p>Please try again in a moment.</p>
              <Link href="/jobs" className="btn btn-outline btn-sm">
                Back to jobs
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const items = allSetups.filter(isProfessionalItem);
  // all setups whose kebab-cased role string matches the URL slug
  const matched = items.filter((item) => toJobSlug(item.role) === slug);

  if (matched.length === 0) {
    notFound();
  }

  const roleName = matched[0].role;
  const industry = matched[0].industry ?? 'General';

  // the "full" role setup is the item whose DB slug equals the role slug
  const mainSetup = matched.find((item) => item.slug === slug) ?? null;
  // granular skills share the same role string but have different slugs
  const skills = matched.filter((item) => item.slug !== slug);

  return (
    <main className="section-tight">
      <div className="wrap">
        <Link href="/jobs" className="back-link">
          <ArrowLeftIcon />
          All jobs
        </Link>

        <header style={{ margin: '20px 0 36px' }}>
          <span className="eyebrow">{industry}</span>
          <h1 style={{ marginBottom: '10px' }}>{roleName}</h1>
          <p
            style={{
              color: 'var(--ink-soft)',
              fontSize: '1.05rem',
              margin: 0,
              maxWidth: '42em',
            }}
          >
            Ready-made AI setups for {roleName}s — customize and export to Claude or ChatGPT.
          </p>
        </header>

        {/* the main "full role" setup gets its own section and narrower card width to stand out */}
        {mainSetup && (
          <section
            aria-labelledby="main-setup-heading"
            style={{ marginBottom: '48px' }}
          >
            <h2
              id="main-setup-heading"
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                margin: '0 0 16px',
                lineHeight: 1,
              }}
            >
              Full role setup
            </h2>
            {/* 2-column cap: single card takes half width, giving it visual weight */}
            <div
              className="setup-grid"
              style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
            >
              <SetupCard setup={mainSetup} />
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section aria-labelledby="skills-heading">
            <h2
              id="skills-heading"
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                margin: '0 0 16px',
                lineHeight: 1,
              }}
            >
              Skills for this job
            </h2>
            <div className="setup-grid">
              {skills.map((setup) => (
                <SetupCard key={setup.id} setup={setup} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
