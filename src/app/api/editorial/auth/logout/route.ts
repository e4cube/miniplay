import { clearEditorialSession, sameOrigin } from '@/lib/editorial/auth';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Forbidden origin.' }, { status: 403 });
  await clearEditorialSession();
  return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
