import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Blokir bot dari halaman internal dashboard/API/private agar tidak terindeks
      disallow: ['/dashboard/', '/api/', '/fleet-management/', '/spare-part-management/', '/site-project/', '/rental-management/', '/account/', '/sign-in/', '/sign-up/'],
    },
    sitemap: 'https://syahheavyequipment.vercel.app/sitemap.xml',
  };
}