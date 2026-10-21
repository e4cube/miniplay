import { ugcConfig } from '@/lib/ugc/config';
import { saveSession } from '@/lib/ugc/auth';
import { failure, jsonBody, sameOrigin, supabaseRequest } from '@/lib/ugc/http';
import { email } from '@/lib/ugc/validation';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return failure('BAD_ORIGIN', 'Invalid request origin.', 403);
  if (!ugcConfig()) return failure('NOT_CONFIGURED', 'Community login is not configured.', 503);
  const body = await jsonBody(request);
  const address = email(body?.email);
  const code = typeof body?.code === 'string' && /^\d{6,8}$/.test(body.code) ? body.code : null;
  if (!address || !code) return failure('INVALID_INPUT', 'Enter your email and code.', 400);
  try {
    const response = await supabaseRequest('/auth/v1/verify', {
      method: 'POST', body: JSON.stringify({ type: 'email', email: address, token: code }),
    });
    if (!response.ok) return failure('INVALID_CODE', 'The code is invalid or expired.', 401);
    const session = await response.json() as { access_token?: string; refresh_token?: string; expires_in?: number };
    if (!session.access_token || !session.refresh_token || !session.expires_in) return failure('AUTH_UNAVAILABLE', 'Login could not be completed.', 502);
    await saveSession({ access_token: session.access_token, refresh_token: session.refresh_token, expires_in: session.expires_in });
    return Response.json({ authenticated: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return failure('AUTH_UNAVAILABLE', 'Please try again later.', 502); }
}
