import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/products';

// 1. Added 'async' and 'Promise' return type
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 2. Added 'await' here so it waits for the database!
  const products = await getProducts();
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://chillover.in';

  const productUrls = products.map(p => ({
    url: `${baseUrl}/shop/${p.category}/${p.slug}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/shop/men`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/shop/women`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/shop/all`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...productUrls,
  ];
}