import { isEditorialAdmin, sameOrigin } from '@/lib/editorial/auth';
import { publishArticle, PublishError } from '@/lib/editorial/github';
import { EditorialValidationError, validateEditorialInput } from '@/lib/editorial/validation';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Forbidden origin.' }, { status: 403 });
  if (!await isEditorialAdmin()) return Response.json({ error: 'Administrator login required.' }, { status: 401 });
  if (Number(request.headers.get('content-length') || 0) > 100000)
    return Response.json({ error: 'Article is too large.' }, { status: 413 });
  let input: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 100000) return Response.json({ error: 'Article is too large.' }, { status: 413 });
    input = JSON.parse(raw);
  } catch { return Response.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  try {
    const article = validateEditorialInput(input);
    const result = await publishArticle(article);
    return Response.json(result, { status: result.mode === 'review' ? 202 : 201,
      headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof EditorialValidationError)
      return Response.json({ error: error.message, field: error.field }, { status: 400 });
    if (error instanceof PublishError) {
      const status = error.code === 'ALREADY_EXISTS' || error.code === 'CONFLICT' ? 409 :
        error.code === 'NOT_CONFIGURED' ? 503 : 502;
      return Response.json({ error: error.message, code: error.code }, { status });
    }
    return Response.json({ error: 'Publishing failed. No article was published.' }, { status: 500 });
  }
}
