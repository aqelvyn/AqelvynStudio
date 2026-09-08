import type { MetadataRoute } from 'next';
import { SITE_URL, listAll, urlFor } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const promptPages: MetadataRoute.Sitemap = listAll().map((e) => ({
    url: urlFor(e),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/prompts`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    ...promptPages,
  ];
}
