import 'server-only';
import { ugcConfig } from './config';

export type UGCError = { error: { code: string; message: string } };

export function failure(code: string, message: string, status: number) {
  return Response.json({ error: { code, message } } satisfies UGCError,
    { status, headers: { 'Cache-Control': 'no-store' } });
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try { return new URL(origin).origin === new URL(request.url).origin; }
  catch { return false; }
}

export async function jsonBody(request: Request): Promise<Record<string, unknown> | null> {
  if (!request.headers.get('content-type')?.startsWith('application/json')) return null;
  if (Number(request.headers.get('content-length') || 0) > 4096) return null;
  try {
    const text = await request.text();
    if (text.length > 4096) return null;
    const value: unknown = JSON.parse(text);
    return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
  } catch { return null; }
}

export async function supabaseRequest(path: string, init: RequestInit = {}, token?: string) {
  const config = ugcConfig();
  if (!config) throw new Error('UGC_NOT_CONFIGURED');
  return fetch(`${config.url}${path}`, {
    ...init,
    headers: {
      apikey: config.key,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
      ...init.headers,
    },
    cache: 'no-store',
  });
}

export async function rpc<T>(name: string, body: Record<string, unknown>, token: string): Promise<T> {
  const response = await supabaseRequest(`/rest/v1/rpc/${name}`, {
    method: 'POST', body: JSON.stringify(body),
  }, token);
  if (!response.ok) throw new Error(`UGC_RPC_${response.status}`);
  return response.json() as Promise<T>;
}
