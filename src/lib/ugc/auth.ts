import 'server-only';
import { cookies } from 'next/headers';
import { supabaseRequest } from './http';

const accessName = 'gv_ugc_access';
const refreshName = 'gv_ugc_refresh';
type AuthUser = { id: string; email?: string };
type Session = { access_token: string; refresh_token: string; expires_in: number };

export async function currentUser(): Promise<{ user: AuthUser; token: string } | null> {
  const token = (await cookies()).get(accessName)?.value;
  if (!token) return null;
  try {
    const response = await supabaseRequest('/auth/v1/user', { method: 'GET' }, token);
    if (!response.ok) return null;
    const user = await response.json() as AuthUser;
    return user.id ? { user, token } : null;
  } catch { return null; }
}
export async function saveSession(session: Session) {
  const jar = await cookies();
  const common = { httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const, path: '/' };
  jar.set(accessName, session.access_token, { ...common, maxAge: Math.max(1, session.expires_in - 30) });
  jar.set(refreshName, session.refresh_token, { ...common, maxAge: 60 * 60 * 24 * 30 });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(accessName);
  jar.delete(refreshName);
}

export async function refreshSession(): Promise<boolean> {
  const refresh = (await cookies()).get(refreshName)?.value;
  if (!refresh) return false;
  try {
    const response = await supabaseRequest('/auth/v1/token?grant_type=refresh_token',
      { method: 'POST', body: JSON.stringify({ refresh_token: refresh }) });
    if (!response.ok) { await clearSession(); return false; }
    await saveSession(await response.json() as Session);
    return true;
  } catch { return false; }
}

export async function requireModerator() {
  const auth = await currentUser();
  if (!auth) return null;
  try {
    const response = await supabaseRequest(
      `/rest/v1/profiles?select=role&user_id=eq.${encodeURIComponent(auth.user.id)}&limit=1`,
      { method: 'GET' }, auth.token);
    if (!response.ok) return null;
    const rows = await response.json() as { role: string }[];
    return rows[0] && ['moderator', 'admin'].includes(rows[0].role) ? auth : null;
  } catch { return null; }
}
