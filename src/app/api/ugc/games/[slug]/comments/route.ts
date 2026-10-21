import { gameBySlug } from '@/data/games';
import { availability, writeGuard } from '@/lib/ugc/api';
import { failure, jsonBody, rpc, supabaseRequest } from '@/lib/ugc/http';
import { locale, plainText } from '@/lib/ugc/validation';

type Ctx = { params: Promise<{ slug: string }> };
export async function GET(request: Request, context: Ctx) {
  const unavailable = availability(); if (unavailable) return unavailable;
  const { slug } = await context.params;
  if (!gameBySlug(slug)) return failure('NOT_FOUND', 'Game not found.', 404);
  const url = new URL(request.url);
  const language = locale(url.searchParams.get('locale') || 'en');
  if (!language) return failure('INVALID_INPUT', 'Invalid language.', 400);
  const offset = Math.min(500, Math.max(0, Number(url.searchParams.get('offset') || 0) || 0));
  try {
    const response = await supabaseRequest(`/rest/v1/game_comments?select=id,body,locale,published_at&game_slug=eq.${encodeURIComponent(slug)}&locale=eq.${encodeURIComponent(language)}&status=eq.approved&deleted_at=is.null&order=published_at.desc&limit=10&offset=${offset}`);
    if (!response.ok) throw new Error('READ_FAILED');
    return Response.json({ items: await response.json() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return failure('SERVICE_UNAVAILABLE', 'Comments are unavailable.', 502); }
}

export async function POST(request: Request, context: Ctx) {
  const guard = await writeGuard(request); if (guard.error) return guard.error;
  const { slug } = await context.params;
  if (!gameBySlug(slug)) return failure('NOT_FOUND', 'Game not found.', 404);
  const body = await jsonBody(request);
  const text = plainText(body?.body, 10, 1000);
  const language = locale(body?.locale);
  if (!text || !language) return failure('INVALID_INPUT', 'Check the comment fields.', 400);
  try {
    const id = await rpc<string | null>('submit_game_comment', { p_game_slug: slug, p_body: text, p_locale: language }, guard.token!);
    if (!id) return failure('RATE_LIMITED', 'Please wait before posting again.', 429);
    return Response.json({ id, status: 'pending' }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch { return failure('COMMENT_FAILED', 'The comment could not be submitted.', 409); }
}
