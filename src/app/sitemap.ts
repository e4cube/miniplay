import type {MetadataRoute} from 'next';
import {absoluteUrl} from '@/config/site';
import {games, categoryRegistry} from '@/data/games';
import {languageAlternates, localizedPath, type Locale} from '@/i18n/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...new Set([
    '/', '/games', '/categories', '/games/match-3',
    '/games/battle-tanks/editor', '/about', '/contact', '/privacy', '/terms',
    ...games.map(game => `/games/${game.slug}`),
    ...categoryRegistry.map(category => `/category/${category.slug}`),
  ])];
  return paths.flatMap(path => {
    const englishOnly = path.endsWith('/editor');
    const locales: Locale[] = englishOnly ? ['en'] : ['en', 'zh-CN'];
    const languages = Object.fromEntries(Object.entries(
      englishOnly ? {en: path, 'x-default': path} : languageAlternates(path)
    ).map(([key, value]) => [key, absoluteUrl(value)]));
    return locales.map(locale => ({
      url: absoluteUrl(localizedPath(path, locale)),
      // Omit lastModified until real content revision dates are available.
      changeFrequency: path.startsWith('/games/') ? 'monthly' as const : 'weekly' as const,
      priority: path === '/' ? 1 : 0.7,
      alternates: {languages},
    }));
  });
}
