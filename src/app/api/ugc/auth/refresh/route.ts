import { refreshSession } from '@/lib/ugc/auth';
import { failure, sameOrigin } from '@/lib/ugc/http';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return failure('BAD_ORIGIN', 'Invalid request origin.', 403);
  return (await refreshSession())
    ? Response.json({ authenticated: true }, { headers: { 'Cache-Control': 'no-store' } })
    : failure('AUTH_REQUIRED', 'Please sign in again.', 401);
}
