import type { MetadataRoute } from 'next';
import { getAllPublishedPageIds } from '@/lib/notion';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://abojc.com';

  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about/criteria`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about/policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 動的ページ（Notion DBから取得）
  try {
    const pages = await getAllPublishedPageIds();

    const paperPages: MetadataRoute.Sitemap = pages
      .filter((p) => !/member/i.test(p.contentType) && !p.contentType.includes('メンバー'))
      .map((p) => ({
        url: `${baseUrl}/papers/${p.id}`,
        lastModified: new Date(p.lastEdited),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));

    const memberPages: MetadataRoute.Sitemap = pages
      .filter((p) => /member/i.test(p.contentType) || p.contentType.includes('メンバー'))
      .map((p) => ({
        url: `${baseUrl}/members/${p.id}`,
        lastModified: new Date(p.lastEdited),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));

    return [...staticPages, ...paperPages, ...memberPages];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return staticPages;
  }
}
