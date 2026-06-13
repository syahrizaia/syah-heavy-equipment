import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://syahheavyequipment.vercel.app';

  // Daftar rute statis situs Anda
  const staticRoutes = [
    '',
    '/layanan',
    '/tracking',
    '/contact',
    '/region/bekasi',
    '/region/balikpapan',
    '/region/morowali',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  return sitemapEntries;
}