import type { MetadataRoute } from 'next';
import { ROLES } from '@/lib/catalog/roles';
import { createCatalogRepository } from '@/lib/catalog/repository';
import { detailPathFor } from '@/lib/catalog/dashboard';
import { SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const repo = createCatalogRepository();
  let items: Array<{ path: string; updatedAt: string }> = [];

  try {
    const setups = await repo.getSetups();
    // Registry kinds are canonical at /dev/<slug>, setups at /setup/<slug>.
    // detailPathFor encodes that mapping (shared with the dashboard list links),
    // so the sitemap emits the canonical URL and never a redirecting one.
    items = setups.map((s) => ({ path: detailPathFor(s), updatedAt: s.updatedAt }));
  } catch {
    // DB unreachable at build time — skip detail URLs.
  }

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/professionals`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/developers`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  const roleUrls: MetadataRoute.Sitemap = ROLES.map((r) => ({
    url: `${SITE_URL}/for/${r.id}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const setupUrls: MetadataRoute.Sitemap = items.map((s) => ({
    url: `${SITE_URL}${s.path}`,
    lastModified: new Date(s.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticUrls, ...roleUrls, ...setupUrls];
}
