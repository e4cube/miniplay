import 'server-only';
import { editorialSources } from '../../../content/posts';
import { validateEditorialInput } from './validation';

export type EditorialPost = {
  id: string; slug: string; locale: 'en' | 'zh-CN'; kind: 'review' | 'news' | 'guide';
  title: string; excerpt: string; body: string; video_url: string | null;
  status: 'published'; published_at: string; updated_at: string;
};

function parsePost(source: unknown): EditorialPost {
  const data = validateEditorialInput(source);
  return { id: `${data.locale}:${data.slug}`, slug: data.slug, locale: data.locale, kind: data.kind,
    title: data.title, excerpt: data.excerpt, body: data.body, video_url: data.videoUrl,
    status: 'published', published_at: `${data.publishedAt}T00:00:00Z`, updated_at: `${data.updatedAt}T00:00:00Z` };
}

const posts = editorialSources.map(parsePost);
if (new Set(posts.map(post => post.id)).size !== posts.length) throw new Error('Duplicate editorial locale and slug');

export function listPublishedPosts(locale: 'en' | 'zh-CN'): EditorialPost[] {
  return posts.filter(post => post.locale === locale).sort((a, b) => b.published_at.localeCompare(a.published_at));
}

export function getPublishedPost(locale: 'en' | 'zh-CN', slug: string): EditorialPost | null {
  return posts.find(post => post.locale === locale && post.slug === slug) ?? null;
}
