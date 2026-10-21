import type { Metadata } from 'next';
import AdminLogin from '@/components/AdminLogin';
import AdminQueue from '@/components/AdminQueue';
import { requireModerator } from '@/lib/ugc/auth';
import { ugcConfig } from '@/lib/ugc/config';
import { supabaseRequest } from '@/lib/ugc/http';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'UGC moderation', robots: { index: false, follow: false } };

type QueueItem = { id: string; title?: string; body?: string; details?: string; reason?: string; status: string; created_at: string; game_slug?: string; target_type?: string; target_id?: string };
async function readQueue(table: 'game_requests' | 'game_comments' | 'reports', token: string): Promise<QueueItem[]> {
  const fields = table === 'game_requests' ? 'id,title,body,status,created_at'
    : table === 'game_comments' ? 'id,game_slug,body,status,created_at'
      : 'id,target_type,target_id,reason,details,status,created_at';
  const status = table === 'reports' ? 'eq.open' : 'in.(pending,held)';
  const response = await supabaseRequest(`/rest/v1/${table}?select=${fields}&status=${status}&order=created_at.asc&limit=50`,
    { method: 'GET' }, token);
  if (!response.ok) throw new Error('QUEUE_UNAVAILABLE');
  return response.json() as Promise<QueueItem[]>;
}

export default async function ModerationPage() {
  if (!ugcConfig()) return <main className="container" style={{ paddingTop: 40 }}><h1>UGC moderation</h1><p>Supabase is not configured.</p></main>;
  const moderator = await requireModerator();
  if (!moderator) return <main className="container" style={{ paddingTop: 40 }}><AdminLogin /></main>;
  let queue: [QueueItem[], QueueItem[], QueueItem[]] | null = null;
  try {
    queue = await Promise.all([
      readQueue('game_requests', moderator.token), readQueue('game_comments', moderator.token), readQueue('reports', moderator.token),
    ]);
  } catch { /* Fail closed: no queue contents rendered on read errors. */ }
  if (!queue) {
    return <main className="container" style={{ paddingTop: 40 }}><h1>UGC moderation</h1><p role="alert">The review queue is unavailable. No decisions were made.</p></main>;
  }
  const [requests, comments, reports] = queue;
  return <main className="container" style={{ paddingTop: 40 }}><h1>UGC moderation</h1>
    <p className="muted">Only pending or held items appear here. Decisions are recorded in the audit log.</p>
    <AdminQueue requests={requests} comments={comments} reports={reports} />
  </main>;
}
