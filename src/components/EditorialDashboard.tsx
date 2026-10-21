'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { EditorialPost } from '@/lib/editorial/posts';
import { EditorialValidationError, validateEditorialInput } from '@/lib/editorial/validation';

type Form = { title: string; slug: string; excerpt: string; body: string; locale: 'en' | 'zh-CN';
  kind: 'news' | 'review' | 'guide'; publishedAt: string; videoUrl: string };
type Result = { mode: 'published' | 'review'; url: string; pullRequestUrl?: string };

export default function EditorialDashboard({ posts }: { posts: EditorialPost[] }) {
  const router = useRouter();
  const [form, setForm] = useState<Form>({ title: '', slug: '', excerpt: '', body: '', locale: 'en',
    kind: 'news', publishedAt: new Date().toISOString().slice(0, 10), videoUrl: '' });
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const update = (key: keyof Form, value: string) => setForm(current => ({ ...current, [key]: value }));
  const validate = () => validateEditorialInput({ ...form, updatedAt: form.publishedAt,
    videoUrl: form.videoUrl.trim() || null });

  async function publish() {
    setError(''); setResult(null);
    let article;
    try { article = validate(); }
    catch (cause) {
      setError(cause instanceof EditorialValidationError ? cause.message : 'Please check the article fields.');
      return;
    }
    setBusy(true);
    try {
      const response = await fetch('/api/admin/editorial/publish', { method: 'POST',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(article) });
      const data = await response.json();
      if (!response.ok) { setError(data.error || 'Publishing failed.'); return; }
      setResult(data as Result);
    } catch { setError('Could not contact the publishing server. No article was published.'); }
    finally { setBusy(false); }
  }

  async function logout() {
    await fetch('/api/editorial/auth/logout', { method: 'POST' });
    router.refresh();
  }

  return <main className="container" style={{ padding: '40px 0 80px', maxWidth: 960 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
      <h1>Editorial admin</h1><button type="button" onClick={logout}>Sign out</button>
    </div>
    <p>Publish an original article. GitHub writes the article and listing in one commit; deployment can take a few minutes.</p>
    <form onSubmit={event => { event.preventDefault(); void publish(); }} style={{ display: 'grid', gap: 16, maxWidth: 760 }}>
      <label>Title <input required minLength={12} maxLength={140} value={form.title} onChange={e => update('title', e.target.value)} style={{ display: 'block', width: '100%' }} /></label>
      <label>URL slug <input required maxLength={90} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={e => update('slug', e.target.value)} style={{ display: 'block', width: '100%' }} /></label>
      <label>Summary <textarea required minLength={40} maxLength={320} rows={3} value={form.excerpt} onChange={e => update('excerpt', e.target.value)} style={{ display: 'block', width: '100%' }} /></label>
      <label>Body (plain text; separate paragraphs with blank lines) <textarea required minLength={400} maxLength={50000} rows={15} value={form.body} onChange={e => update('body', e.target.value)} style={{ display: 'block', width: '100%' }} /></label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
        <label>Language <select value={form.locale} onChange={e => update('locale', e.target.value)}><option value="en">English</option><option value="zh-CN">中文</option></select></label>
        <label>Type <select value={form.kind} onChange={e => update('kind', e.target.value)}><option value="news">News</option><option value="review">Review</option><option value="guide">Guide</option></select></label>
        <label>Publish date <input required type="date" value={form.publishedAt} onChange={e => update('publishedAt', e.target.value)} /></label>
      </div>
      <label>Video URL (optional) <input type="url" value={form.videoUrl} onChange={e => update('videoUrl', e.target.value)} placeholder="https://youtu.be/…" style={{ display: 'block', width: '100%' }} /></label>
      <div style={{ display: 'flex', gap: 12 }}><button type="button" onClick={() => setPreview(value => !value)}>{preview ? 'Hide preview' : 'Preview'}</button>
        <button type="submit" disabled={busy}>{busy ? 'Publishing…' : 'Publish article'}</button></div>
      {error && <p role="alert" style={{ color: '#b42318' }}>{error}</p>}
      {result && <p role="status">{result.mode === 'published' ? 'Commit created; deployment is pending. ' : 'Main branch is protected; review required. '}
        {result.mode === 'published' ? <a href={result.url}>Article link</a> :
          result.pullRequestUrl ? <a href={result.pullRequestUrl} target="_blank" rel="noopener noreferrer">Review pull request</a> : null}</p>}
    </form>
    {preview && <section aria-label="Article preview" style={{ borderTop: '1px solid #ddd', marginTop: 32, paddingTop: 24, maxWidth: 760 }}>
      <p>{form.locale === 'zh-CN' ? '中文' : 'English'} · {form.kind.toUpperCase()} · {form.publishedAt}</p>
      <h2>{form.title || 'Untitled article'}</h2><p>{form.excerpt}</p>
      {form.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index} style={{ whiteSpace: 'pre-wrap' }}>{paragraph.trim()}</p>)}
      {form.videoUrl && <p>Video: {form.videoUrl}</p>}
    </section>}
    <section style={{ marginTop: 48 }}><h2>Published articles</h2>
      {posts.length === 0 ? <p>No deployed articles yet.</p> : <ul>{posts.map(post => <li key={post.id}>
        <Link href={`${post.locale === 'zh-CN' ? '/zh' : ''}/blog/${post.slug}`}>{post.title}</Link>
        {' · '}{post.locale}{' · '}{post.published_at.slice(0, 10)}
      </li>)}</ul>}
    </section>
  </main>;
}
