import { ugcConfig } from '@/lib/ugc/config';
import { failure, jsonBody, sameOrigin, supabaseRequest } from '@/lib/ugc/http';
import { email } from '@/lib/ugc/validation';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return failure('BAD_ORIGIN', 'Invalid request origin.', 403);
  if (!ugcConfig()) return failure('NOT_CONFIGURED', 'Community login is not configured.', 503);
  const body = await jsonBody(request);
  const address = email(body?.email);
  if (!address) return failure('INVALID_INPUT', 'Enter a valid email address.', 400);
  const captchaToken = typeof body?.captchaToken === 'string' ? body.captchaToken : '';
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
    return failure('NOT_CONFIGURED', 'Login protection is not configured.', 503);
  if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (!captchaToken || captchaToken.length > 2048))
    return failure('CAPTCHA_REQUIRED', 'Complete the security check.', 400);
  try {
    const response = await supabaseRequest('/auth/v1/otp', {
      method: 'POST', body: JSON.stringify({ email: address, create_user: true, captcha_token: captchaToken || undefined }),
    });
    if (!response.ok) return failure('AUTH_UNAVAILABLE', 'Please try again later.', response.status === 429 ? 429 : 502);
    return Response.json({ sent: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return failure('AUTH_UNAVAILABLE', 'Please try again later.', 502); }
}
