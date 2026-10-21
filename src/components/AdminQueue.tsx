'use client';
import { useState } from 'react';

type QueueItem = { id: string; title?: string; body?: string; details?: string; reason?: string; status: string; created_at: string; game_slug?: string; target_type?: string; target_id?: string };
export default function AdminQueue({ requests, comments, reports }: { requests: QueueItem[]; comments: QueueItem[]; reports: QueueItem[] }) {
  const [done, setDone] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  async function decide(type: 'request' | 'comment' | 'report', item: QueueItem, status: 'approved' | 'rejected' | 'reviewed' | 'dismissed') {
    const reason = window.prompt(`Reason for ${status} (required, 3–500 characters):`);
    if (!reason || reason.trim().length < 3) return;
    setBusy(item.id); setMessage('');
    try {
      const response = await fetch('/api/admin/ugc/moderate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id: item.id, status, reason }),
      });
      const result = await response.json();
      if (!response.ok) setMessage(result.error?.message || 'Action failed.');
      else { setDone(previous => [...previous, item.id]); setMessage(`${status} recorded.`); }
    } catch { setMessage('Connection failed. No decision was recorded.'); }
    finally { setBusy(null); }
  }
  async function holdReportedItem(item: QueueItem) {
    if ((item.target_type !== 'request' && item.target_type !== 'comment') || !item.target_id) return;
    const reason = window.prompt('Reason for holding the reported content (required):');
    if (!reason || reason.trim().length < 3) return;
    setBusy(item.id); setMessage('');
    try {
      const response = await fetch('/api/admin/ugc/moderate', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'report', id: item.id, status: 'actioned', reason }) });
      if (!response.ok) throw new Error('Content could not be held. It may already be hidden.');
      setDone(previous => [...previous, item.id]); setMessage('Content held and report actioned.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Action failed.'); }
    finally { setBusy(null); }
  }
  function section(title: string, type: 'request' | 'comment' | 'report', items: QueueItem[]) {
    return <section style={{ marginTop: 36 }}><h2>{title} ({items.filter(item => !done.includes(item.id)).length})</h2>
      {items.filter(item => !done.includes(item.id)).length === 0 && <p>No items waiting.</p>}
      {items.filter(item => !done.includes(item.id)).map(item => <article className="card" key={item.id} style={{ padding: 20, marginBottom: 16 }}>
        <h3>{item.title || item.game_slug || `${item.target_type} · ${item.target_id}`}</h3><p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{item.body || `${item.reason}: ${item.details || ''}`}</p>
        <p className="muted">{item.status} · {new Date(item.created_at).toLocaleString()}</p>
        <div className="game-controls" style={{ justifyContent: 'flex-start' }}>
          <button className="btn" disabled={busy === item.id} onClick={() => decide(type, item, type === 'report' ? 'reviewed' : 'approved')}>{type === 'report' ? 'Mark reviewed' : 'Approve'}</button>
          <button className="btn secondary" disabled={busy === item.id} onClick={() => decide(type, item, type === 'report' ? 'dismissed' : 'rejected')}>{type === 'report' ? 'Dismiss' : 'Reject'}</button>
          {type === 'report' && <button className="btn secondary" disabled={busy === item.id} onClick={() => holdReportedItem(item)}>Hold content</button>}
        </div>
      </article>)}
    </section>;
  }
  return <>{message && <p role="status">{message}</p>}{section('Game requests', 'request', requests)}{section('Comments', 'comment', comments)}{section('Reports', 'report', reports)}</>;
}
