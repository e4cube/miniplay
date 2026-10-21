import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/config/site';
import { games, categoryRegistry } from '@/data/games';
import { languageAlternates } from '@/i18n/config';
import { listPublishedPosts } from '@/lib/editorial/posts';

const updated = new Date('2026-09-18');

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', '/games', '/categories', '/games/match-3', '/games/battle-tanks/editor',
    '/about', '/contact', '/privacy', '/terms',
    ...games.map(game => `/games/${game.slug}`), ...categoryRegistry.map(category => `/category/${category.slug}`)];
  const existing = paths.flatMap(path => (path.endsWith('/editor') ? ['en'] : ['en', 'zh-CN']).map(locale => {
    const localPath = locale === 'zh-CN' ? (path === '/' ? '/zh' : `/zh${path}`) : path;
    const languages = Object.fromEntries(Object.entries(languageAlternates(path))
      .map(([key, value]) => [key, absoluteUrl(value)]));
    return { url: absoluteUrl(localPath), lastModified: updated,
      changeFrequency: path.startsWith('/games/') ? 'monthly' as const : 'weekly' as const,
      priority: path === '/' ? 1 : .7, alternates: { languages } };
  }));
  const en = listPublishedPosts('en');
  const zh = listPublishedPosts('zh-CN');
  const editorial: MetadataRoute.Sitemap = [
    ...(en.length ? [{ url: absoluteUrl('/blog'), changeFrequency: 'weekly' as const }] : []),
    ...(zh.length ? [{ url: absoluteUrl('/zh/blog'), changeFrequency: 'weekly' as const }] : []),
    ...en.map(post => ({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: post.updated_at })),
    ...zh.map(post => ({ url: absoluteUrl(`/zh/blog/${post.slug}`), lastModified: post.updated_at })),
  ];
  return [...existing, ...editorial];
}
