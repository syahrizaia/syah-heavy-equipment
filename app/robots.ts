import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Blokir bot dari halaman internal dashboard atau API agar tidak merusak skor SEO
      disallow: ['/dashboard/', '/api/'], 
    },
    sitemap: 'https://syahheavyequipment.vercel.app/sitemap.xml',
  };
}