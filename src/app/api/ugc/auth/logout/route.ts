import { clearSession } from '@/lib/ugc/auth';
import { failure, sameOrigin } from '@/lib/ugc/http';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return failure('BAD_ORIGIN', 'Invalid request origin.', 403);
  await clearSession();
  return Response.json({ authenticated: false }, { headers: { 'Cache-Control': 'no-store' } });
}
