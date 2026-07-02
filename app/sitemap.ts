import type { MetadataRoute } from 'next';
import { ROLES } from '@/lib/catalog/roles';
import { createCatalogRepository } from '@/lib/catalog/repository';
import { SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const repo = createCatalogRepository();
  let slugs: Array<{ slug: string; updatedAt: string }> = [];

  try {
    const setups = await repo.getSetups();
    slugs = setups.map((s) => ({ slug: s.slug, updatedAt: s.updatedAt }));
  } catch {
    // DB unreachable at build time — skip setup detail URLs.
  }

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/catalog`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  const roleUrls: MetadataRoute.Sitemap = ROLES.map((r) => ({
    url: `${SITE_URL}/for/${r.id}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const setupUrls: MetadataRoute.Sitemap = slugs.map((s) => ({
    url: `${SITE_URL}/setup/${s.slug}`,
    lastModified: new Date(s.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticUrls, ...roleUrls, ...setupUrls];
}
