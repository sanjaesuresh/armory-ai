import Link from 'next/link';
import type { Metadata } from 'next';
import { createCatalogRepository } from '@/lib/catalog/repository';
import { isProfessionalItem } from '@/lib/catalog/dashboard';

export const metadata: Metadata = {
  title: 'Browse by job · Armory',
  description:
    'AI setups and skills organized by job role — find everything available for your position.',
};

// lowercase, spaces→hyphens, strip non-alphanumeric except hyphens
function toJobSlug(role: string): string {
  return role.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
}

export default async function JobsIndexPage() {
  const repo = createCatalogRepository();
  let allSetups: Awaited<ReturnType<typeof repo.getSetups>>;
  try {
    allSetups = await repo.getSetups();
  } catch (err) {
    console.error('[jobs] failed to load setups:', err);
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
              <strong>Couldn&apos;t load jobs</strong>
              <p>Please try again in a moment.</p>
              <Link href="/jobs" className="btn btn-outline btn-sm">
                Try again
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const items = allSetups.filter(isProfessionalItem);

  // group by industry (null → "General"), then count setups per role
  const industryMap = new Map<string, Map<string, number>>();
  for (const item of items) {
    const industry = item.industry ?? 'General';
    if (!industryMap.has(industry)) industryMap.set(industry, new Map());
    const roleMap = industryMap.get(industry)!;
    roleMap.set(item.role, (roleMap.get(item.role) ?? 0) + 1);
  }

  // alphabetical by industry name; "General" always last
  const groups = [...industryMap.entries()]
    .sort(([a], [b]) => {
      if (a === 'General' && b !== 'General') return 1;
      if (b === 'General' && a !== 'General') return -1;
      return a.localeCompare(b);
    })
    .map(([industry, roleMap]) => ({
      industry,
      // stable slug for the section id
      industryId: industry.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-'),
      roles: [...roleMap.entries()]
        .map(([role, count]) => ({ role, slug: toJobSlug(role), count }))
        .sort((a, b) => a.role.localeCompare(b.role)),
    }));

  if (groups.length === 0) {
    return (
      <main className="section-tight">
        <div className="wrap">
          <header style={{ marginBottom: '32px' }}>
            <span className="eyebrow">Catalog</span>
            <h1>Browse by job</h1>
          </header>
          <div className="empty">
            <p>No jobs available yet — check back soon.</p>
            <Link href="/professionals" className="btn btn-outline btn-sm">
              Browse all setups
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section-tight">
      <div className="wrap">
        <header style={{ marginBottom: '36px' }}>
          <span className="eyebrow">Catalog</span>
          <h1>Browse by job</h1>
          <p
            style={{
              color: 'var(--ink-soft)',
              fontSize: '1.05rem',
              margin: '8px 0 0',
              maxWidth: '44em',
            }}
          >
            AI setups organized by role — find what&apos;s available for your position.
          </p>
        </header>

        {groups.map(({ industry, industryId, roles }) => (
          <section
            key={industry}
            aria-labelledby={`ind-${industryId}`}
            style={{ marginBottom: '44px' }}
          >
            {/* small uppercase label — mirrors .eyebrow but scoped to avoid h2 size defaults */}
            <h2
              id={`ind-${industryId}`}
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                margin: '0 0 14px',
                lineHeight: 1,
              }}
            >
              {industry}
            </h2>

            <div className="role-grid">
              {roles.map(({ role, slug, count }) => (
                <Link key={role} href={`/jobs/${slug}`} className="role-card">
                  <strong>{role}</strong>
                  <span>
                    {count} {count === 1 ? 'setup' : 'setups'}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
