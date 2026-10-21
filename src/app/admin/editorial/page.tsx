import type { Metadata } from 'next';
import Link from 'next/link';
import EditorialDashboard from '@/components/EditorialDashboard';
import { isEditorialAdmin } from '@/lib/editorial/auth';
import { listPublishedPosts } from '@/lib/editorial/posts';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Editorial admin', robots: { index: false, follow: false } };

export default async function EditorialAdminPage({ searchParams }: {
  searchParams: Promise<{ auth_error?: string }>;
}) {
  const admin = await isEditorialAdmin();
  const error = (await searchParams).auth_error;
  if (!admin) return <main className="container" style={{ maxWidth: 640, padding: '64px 0' }}>
    <h1>Editorial admin</h1>
    <p>Only the configured GameVado administrator can publish articles.</p>
    {error && <p role="alert">Sign-in was not completed. Check your GitHub account and try again.</p>}
    <Link className="btn" href="/api/editorial/auth/login">Sign in with GitHub</Link>
  </main>;
  const posts = [...listPublishedPosts('en'), ...listPublishedPosts('zh-CN')]
    .sort((a, b) => b.published_at.localeCompare(a.published_at));
  return <EditorialDashboard posts={posts} />;
}
