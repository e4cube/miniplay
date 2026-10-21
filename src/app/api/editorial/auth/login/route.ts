import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { editorialOrigin, loginAllowed, stateCookie } from '@/lib/editorial/auth';
import { randomState } from '@/lib/editorial/auth-core';

export async function GET(request: Request) {
  const origin = editorialOrigin();
  const clientId = process.env.EDITORIAL_OAUTH_CLIENT_ID;
  if (!origin || !clientId || !process.env.EDITORIAL_OAUTH_CLIENT_SECRET ||
    !process.env.EDITORIAL_SESSION_SECRET || !process.env.EDITORIAL_ADMIN_GITHUB_ID)
    return new Response('Administrator login is not configured.', { status: 503 });
  if (!loginAllowed(request)) return new Response('Too many login attempts. Try again later.', { status: 429 });
  const state = randomState();
  (await cookies()).set(stateCookie, state, { httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', path: '/', maxAge: 600 });
  const target = new URL('https://github.com/login/oauth/authorize');
  target.searchParams.set('client_id', clientId);
  target.searchParams.set('redirect_uri', `${origin}/api/editorial/auth/callback`);
  target.searchParams.set('state', state);
  target.searchParams.set('scope', '');
  return NextResponse.redirect(target);
}
