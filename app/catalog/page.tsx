import { permanentRedirect } from 'next/navigation';

interface CatalogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * The catalog moved to the Professionals dashboard. This route is a permanent
 * (308) server-side redirect that preserves any query parameters (role, cat,
 * goals) so deep links and existing internal links keep working.
 */
export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;

  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') qs.set(key, value);
    else if (Array.isArray(value)) value.forEach((v) => qs.append(key, v));
  }

  const query = qs.toString();
  permanentRedirect(query ? `/professionals?${query}` : '/professionals');
}
