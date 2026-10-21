import { availability, writeGuard } from '@/lib/ugc/api';
import { failure, jsonBody, rpc } from '@/lib/ugc/http';
import { listPublicGameRequests } from '@/lib/ugc/requests';
import { locale, plainText } from '@/lib/ugc/validation';

export async function GET(request: Request) {
  const unavailable = availability(); if (unavailable) return unavailable;
  const url = new URL(request.url);
  const offset = Math.min(500, Math.max(0, Number(url.searchParams.get('offset') || 0) || 0));
  try {
    return Response.json({ items: await listPublicGameRequests(offset) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return failure('SERVICE_UNAVAILABLE', 'Requests are unavailable.', 502); }
}

export async function POST(request: Request) {
  const guard = await writeGuard(request); if (guard.error) return guard.error;
  const body = await jsonBody(request);
  const title = plainText(body?.title, 3, 80);
  const text = plainText(body?.body, 20, 500);
  const language = locale(body?.locale);
  const category = body?.category == null ? null : plainText(body.category, 1, 40);
  if (!title || !text || !language || (body?.category != null && !category)) return failure('INVALID_INPUT', 'Check the request fields.', 400);
  try {
    const id = await rpc<string | null>('submit_game_request', { p_title: title, p_body: text, p_category: category, p_locale: language }, guard.token!);
    if (!id) return failure('RATE_LIMITED', 'Please wait before posting again.', 429);
    return Response.json({ id, status: 'pending' }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch { return failure('REQUEST_FAILED', 'The request could not be submitted. It may already exist.', 409); }
}
