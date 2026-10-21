import 'server-only';
import { editorialSources } from '../../../content/posts';
import { parseVideoLink } from './video';

export type EditorialPost = {
  id: string; slug: string; locale: 'en' | 'zh-CN'; kind: 'review' | 'news' | 'guide';
  title: string; excerpt: string; body: string; video_url: string | null;
  status: 'published'; published_at: string; updated_at: string;
};

function date(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

function parsePost(source: unknown): EditorialPost {
  if (!source || typeof source !== 'object') throw new Error('Invalid editorial source');
  const data = source as Record<string, unknown>;
  if (typeof data.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug) || data.slug.length > 90)
    throw new Error('Invalid article slug');
  if (data.locale !== 'en' && data.locale !== 'zh-CN') throw new Error(`Invalid locale: ${data.slug}`);
  if (data.kind !== 'review' && data.kind !== 'news' && data.kind !== 'guide') throw new Error(`Invalid kind: ${data.slug}`);
  if (typeof data.title !== 'string' || data.title.trim().length < 12 || data.title.length > 140)
    throw new Error(`Invalid title: ${data.slug}`);
  if (typeof data.excerpt !== 'string' || data.excerpt.trim().length < 40 || data.excerpt.length > 320)
    throw new Error(`Invalid excerpt: ${data.slug}`);
  if (typeof data.body !== 'string' || data.body.trim().length < 400 || data.body.length > 50000)
    throw new Error(`Invalid body: ${data.slug}`);
  if ([data.title, data.excerpt, data.body].some(value => /<[^>]*>/.test(value as string)))
    throw new Error(`HTML is not allowed: ${data.slug}`);
  if (!date(data.publishedAt) || !date(data.updatedAt) || data.updatedAt < data.publishedAt)
    throw new Error(`Invalid dates: ${data.slug}`);
  const video = data.videoUrl == null ? null : parseVideoLink(data.videoUrl);
  if (data.videoUrl != null && !video) throw new Error(`Invalid video URL: ${data.slug}`);
  return { id: `${data.locale}:${data.slug}`, slug: data.slug, locale: data.locale, kind: data.kind,
    title: data.title.trim(), excerpt: data.excerpt.trim(), body: data.body.trim(), video_url: video?.url ?? null,
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
