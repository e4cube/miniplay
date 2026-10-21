import type { Metadata } from 'next';
import EditorialIndex from '@/components/EditorialIndex';
import { absoluteUrl } from '@/config/site';
import { listPublishedPosts } from '@/lib/editorial/posts';

export async function generateMetadata(): Promise<Metadata> {
  const posts = listPublishedPosts('en');
  return { title: 'Game Journal', description: 'Game experiences, news and guides from GameVado.',
    alternates: { canonical: absoluteUrl('/blog') }, robots: posts.length ? { index: true, follow: true } : { index: false, follow: false } };
}
export default function BlogPage() { return <EditorialIndex locale="en" posts={listPublishedPosts('en')} />; }
