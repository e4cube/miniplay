import { parseVideoLink } from './video';

export type EditorialInput = {
  slug: string; locale: 'en' | 'zh-CN'; kind: 'news' | 'review' | 'guide';
  title: string; excerpt: string; body: string; videoUrl: string | null;
  publishedAt: string; updatedAt: string;
};

export class EditorialValidationError extends Error {
  constructor(public readonly field: string, message: string) { super(message); }
}

function validDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

export function validateEditorialInput(source: unknown): EditorialInput {
  if (!source || typeof source !== 'object' || Array.isArray(source))
    throw new EditorialValidationError('article', 'Article fields are required.');
  const data = source as Record<string, unknown>;
  if (typeof data.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug) || data.slug.length > 90)
    throw new EditorialValidationError('slug', 'Use 1–90 lowercase letters, numbers and hyphens for the slug.');
  if (data.locale !== 'en' && data.locale !== 'zh-CN')
    throw new EditorialValidationError('locale', 'Choose English or Chinese.');
  if (data.kind !== 'news' && data.kind !== 'review' && data.kind !== 'guide')
    throw new EditorialValidationError('kind', 'Choose news, review or guide.');
  if (typeof data.title !== 'string' || data.title.trim().length < 12 || data.title.length > 140)
    throw new EditorialValidationError('title', 'Title must be 12–140 characters.');
  if (typeof data.excerpt !== 'string' || data.excerpt.trim().length < 40 || data.excerpt.length > 320)
    throw new EditorialValidationError('excerpt', 'Summary must be 40–320 characters.');
  if (typeof data.body !== 'string' || data.body.trim().length < 400 || data.body.length > 50000)
    throw new EditorialValidationError('body', 'Body must be 400–50,000 characters.');
  if ([data.title, data.excerpt, data.body].some(value => /<[^>]*>/.test(value as string)))
    throw new EditorialValidationError('body', 'HTML is not allowed; use plain text and blank lines.');
  if (!validDate(data.publishedAt) || !validDate(data.updatedAt) || data.updatedAt < data.publishedAt)
    throw new EditorialValidationError('publishedAt', 'Use valid YYYY-MM-DD dates; updated date cannot be earlier.');
  const video = data.videoUrl == null || data.videoUrl === '' ? null : parseVideoLink(data.videoUrl);
  if (data.videoUrl && !video) throw new EditorialValidationError('videoUrl', 'Use an approved HTTPS YouTube, Bilibili, X or TikTok video URL.');
  return { slug: data.slug, locale: data.locale, kind: data.kind, title: data.title.trim(),
    excerpt: data.excerpt.trim(), body: data.body.trim(), videoUrl: video?.url ?? null,
    publishedAt: data.publishedAt, updatedAt: data.updatedAt };
}
