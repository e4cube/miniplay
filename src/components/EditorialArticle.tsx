import Link from 'next/link';
import { absoluteUrl, site } from '@/config/site';
import type { EditorialPost } from '@/lib/editorial/posts';
import { parseVideoLink } from '@/lib/editorial/video';
import styles from './EditorialArticle.module.css';

export default function EditorialArticle({ post }: { post: EditorialPost }) {
  const zh = post.locale === 'zh-CN';
  const base = zh ? '/zh/blog' : '/blog';
  const url = absoluteUrl(`${base}/${post.slug}`);
  const schema = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title,
    description: post.excerpt, inLanguage: post.locale, datePublished: post.published_at,
    dateModified: post.updated_at, mainEntityOfPage: url,
    author: { '@type': 'Organization', name: site.name },
    publisher: { '@type': 'Organization', name: site.name, url: absoluteUrl('/') } };
  const video = post.video_url ? parseVideoLink(post.video_url) : null;
  return <article className={`container ${styles.article}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <Link className={styles.back} href={base}>← {zh ? '所有文章' : 'All articles'}</Link>
    <header>
      <span className={styles.kind}>{post.kind.toUpperCase()}</span>
      <h1>{post.title}</h1>
      <p className={styles.excerpt}>{post.excerpt}</p>
      {post.published_at && <time dateTime={post.published_at}>{new Intl.DateTimeFormat(post.locale, { dateStyle: 'long' }).format(new Date(post.published_at))}</time>}
    </header>
    {video && <aside className={styles.video}>
      {video.embedUrl ? <iframe src={video.embedUrl} title={`${video.platform}: ${post.title}`}
        loading="lazy" referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        : <a href={video.url} target="_blank" rel="noopener noreferrer">{zh ? '在' : 'Watch on'} {video.platform} ↗</a>}
    </aside>}
    <div className={styles.body}>{post.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph.trim()}</p>)}</div>
  </article>;
}
