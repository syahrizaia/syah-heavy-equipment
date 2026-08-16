import { MetadataRoute } from 'next';

const BASE_URL = 'https://syahheavyequipment.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: { route: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { route: '', priority: 1.0, changeFrequency: 'daily' },
    { route: '/fleet', priority: 0.9, changeFrequency: 'daily' },
    { route: '/spare-part', priority: 0.9, changeFrequency: 'daily' },
    { route: '/service', priority: 0.8, changeFrequency: 'weekly' },
    { route: '/service/predictive-maintenance', priority: 0.7, changeFrequency: 'weekly' },
    { route: '/service/field-technical-support', priority: 0.7, changeFrequency: 'weekly' },
    { route: '/service/operational-optimization', priority: 0.7, changeFrequency: 'weekly' },
    { route: '/tracking', priority: 0.8, changeFrequency: 'weekly' },
    { route: '/technology', priority: 0.7, changeFrequency: 'weekly' },
    { route: '/project', priority: 0.7, changeFrequency: 'weekly' },
    { route: '/region', priority: 0.6, changeFrequency: 'weekly' },
    { route: '/contact', priority: 0.8, changeFrequency: 'monthly' },
    { route: '/careers', priority: 0.5, changeFrequency: 'monthly' },
    { route: '/help-center', priority: 0.5, changeFrequency: 'monthly' },
    { route: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  ];

  return staticRoutes.map(({ route, priority, changeFrequency }) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}