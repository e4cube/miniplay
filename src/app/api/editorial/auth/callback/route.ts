import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { editorialOrigin, setEditorialSession, stateCookie } from '@/lib/editorial/auth';
import { sameState } from '@/lib/editorial/auth-core';
import { exchangeGitHubIdentity } from '@/lib/editorial/oauth';

export async function GET(request: Request) {
  const origin = editorialOrigin();
  if (!origin) return new Response('Administrator login is not configured.', { status: 503 });
  const url = new URL(request.url);
  const state = url.searchParams.get('state') || '';
  const code = url.searchParams.get('code') || '';
  const jar = await cookies();
  const expected = jar.get(stateCookie)?.value || '';
  jar.delete(stateCookie);
  if (!code || !state || !expected || !sameState(state, expected))
    return NextResponse.redirect(`${origin}/admin/editorial?auth_error=invalid`);
  const id = await exchangeGitHubIdentity(code, `${origin}/api/editorial/auth/callback`);
  if (!id || id !== Number(process.env.EDITORIAL_ADMIN_GITHUB_ID))
    return NextResponse.redirect(`${origin}/admin/editorial?auth_error=denied`);
  try { await setEditorialSession(id); }
  catch { return NextResponse.redirect(`${origin}/admin/editorial?auth_error=config`); }
  return NextResponse.redirect(`${origin}/admin/editorial`);
}
