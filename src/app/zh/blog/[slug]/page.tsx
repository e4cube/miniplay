import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EditorialArticle from '@/components/EditorialArticle';
import { absoluteUrl } from '@/config/site';
import { getPublishedPost, listPublishedPosts } from '@/lib/editorial/posts';

export const dynamicParams = false;
export function generateStaticParams() { return listPublishedPosts('zh-CN').map(post => ({ slug: post.slug })); }
type Props = { params: Promise<{ slug: string }> };
function load(slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 90) return null;
  return getPublishedPost('zh-CN', slug);
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await load((await params).slug);
  if (!post) return { robots: { index: false, follow: false } };
  return { title: post.title, description: post.excerpt, alternates: { canonical: absoluteUrl(`/zh/blog/${post.slug}`) },
    openGraph: { title: post.title, description: post.excerpt, type: 'article', publishedTime: post.published_at || undefined, locale: 'zh_CN' },
    robots: { index: true, follow: true } };
}
export default async function BlogPostPage({ params }: Props) {
  const post = await load((await params).slug);
  if (!post) notFound();
  return <EditorialArticle post={post} />;
}
