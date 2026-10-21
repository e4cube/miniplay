import Link from 'next/link';
import type { EditorialPost } from '@/lib/editorial/posts';

export default function EditorialIndex({ locale, posts }: { locale: 'en' | 'zh-CN'; posts: EditorialPost[] | null }) {
  const zh = locale === 'zh-CN';
  const base = zh ? '/zh/blog' : '/blog';
  return <main className="container" style={{ padding: 'clamp(28px,5vw,64px) 0 80px' }}>
    <h1 style={{ fontSize: 'clamp(2rem,6vw,3.5rem)', marginBottom: 8 }}>{zh ? '游戏文章' : 'Game Journal'}</h1>
    <p className="muted">{zh ? '由 GameVado 编辑撰写的游戏体验、资讯和攻略。' : 'Game experiences, news and guides written by GameVado editors.'}</p>
    {posts === null ? <p role="alert">{zh ? '文章暂时无法加载。' : 'Articles are temporarily unavailable.'}</p>
      : posts.length === 0 ? <p>{zh ? '暂无已发布文章。' : 'No published articles yet.'}</p>
        : <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 16, maxWidth: 850 }}>
          {posts.map(post => <li className="card" style={{ padding: 22 }} key={post.id}>
            <span className="eyebrow">{post.kind.toUpperCase()}</span>
            <h2 style={{ margin: '10px 0', overflowWrap: 'anywhere' }}><Link href={`${base}/${post.slug}`}>{post.title}</Link></h2>
            <p style={{ lineHeight: 1.6 }}>{post.excerpt}</p>
            <Link href={`${base}/${post.slug}`} style={{ color: 'var(--brand)', fontWeight: 700 }}>{zh ? '阅读文章 →' : 'Read article →'}</Link>
          </li>)}
        </ul>}
  </main>;
}
