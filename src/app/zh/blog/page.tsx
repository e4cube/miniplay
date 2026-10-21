import type { Metadata } from 'next';
import EditorialIndex from '@/components/EditorialIndex';
import { absoluteUrl } from '@/config/site';
import { listPublishedPosts } from '@/lib/editorial/posts';

export async function generateMetadata(): Promise<Metadata> {
  const posts = listPublishedPosts('zh-CN');
  return { title: '游戏文章', description: 'GameVado 编辑撰写的游戏体验、资讯和攻略。',
    alternates: { canonical: absoluteUrl('/zh/blog') }, robots: posts.length ? { index: true, follow: true } : { index: false, follow: false } };
}
export default function BlogPage() { return <EditorialIndex locale="zh-CN" posts={listPublishedPosts('zh-CN')} />; }
