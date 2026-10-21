import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

type Session = { userId: number; expiresAt: number };
const windowMs = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

export function allowLoginAttempt(ip: string, now = Date.now()): boolean {
  for (const key of ['global', `ip:${ip}`]) {
    const current = attempts.get(key);
    if (!current || current.resetAt <= now) attempts.set(key, { count: 0, resetAt: now + windowMs });
  }
  const global = attempts.get('global')!;
  const perIp = attempts.get(`ip:${ip}`)!;
  if (global.count >= 30 || perIp.count >= 5) return false;
  global.count++;
  perIp.count++;
  return true;
}

export function randomState(): string { return randomBytes(32).toString('base64url'); }

export function sameState(actual: string, expected: string): boolean {
  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function signSession(userId: number, secret: string, now = Date.now()): string {
  if (secret.length < 32) throw new Error('SESSION_SECRET_NOT_CONFIGURED');
  const payload = Buffer.from(JSON.stringify({ userId, expiresAt: now + 12 * 60 * 60 * 1000 } satisfies Session))
    .toString('base64url');
  const signature = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifySession(cookie: string | undefined, secret: string, adminId: number, now = Date.now()): boolean {
  if (!cookie || secret.length < 32 || !Number.isSafeInteger(adminId) || adminId < 1) return false;
  const [payload, signature, extra] = cookie.split('.');
  if (!payload || !signature || extra) return false;
  const expected = createHmac('sha256', secret).update(payload).digest('base64url');
  if (!sameState(signature, expected)) return false;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Session;
    return session.userId === adminId && Number.isFinite(session.expiresAt) && session.expiresAt > now;
  } catch { return false; }
}
