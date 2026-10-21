import 'server-only';
import { cookies } from 'next/headers';
import { allowLoginAttempt, signSession, verifySession } from './auth-core';

export const sessionCookie = 'gv_editorial_session';
export const stateCookie = 'gv_editorial_oauth_state';

export function editorialOrigin(): string | null {
  const configured = process.env.EDITORIAL_ORIGIN;
  if (!configured) return null;
  try {
    const url = new URL(configured);
    if (url.pathname !== '/' || url.search || url.hash || (url.protocol !== 'https:' &&
      !(process.env.NODE_ENV !== 'production' && url.hostname === 'localhost'))) return null;
    return url.origin;
  } catch { return null; }
}

export function sameOrigin(request: Request): boolean {
  const allowed = editorialOrigin();
  return !!allowed && request.headers.get('origin') === allowed;
}

export function loginAllowed(request: Request): boolean {
  // GitHub protects credential attempts; this provides a local backstop.
  const ip = request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') || 'unknown';
  return allowLoginAttempt(ip.slice(0, 100));
}

export async function isEditorialAdmin(): Promise<boolean> {
  const secret = process.env.EDITORIAL_SESSION_SECRET || '';
  const adminId = Number(process.env.EDITORIAL_ADMIN_GITHUB_ID);
  return verifySession((await cookies()).get(sessionCookie)?.value, secret, adminId);
}

export async function setEditorialSession(userId: number): Promise<void> {
  const signed = signSession(userId, process.env.EDITORIAL_SESSION_SECRET || '');
  (await cookies()).set(sessionCookie, signed, { httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', path: '/', maxAge: 12 * 60 * 60 });
}

export async function clearEditorialSession(): Promise<void> {
  (await cookies()).delete(sessionCookie);
}
