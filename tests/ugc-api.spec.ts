import { expect, test } from '@playwright/test';
import { email, locale, plainText, uuidPattern } from '../src/lib/ugc/validation';

test('UGC input validation rejects unsafe and malformed values', () => {
  expect(plainText('  A useful wish  ', 3, 80)).toBe('A useful wish');
  expect(plainText('<script>alert(1)</script>', 3, 80)).toBeNull();
  expect(plainText('a'.repeat(81), 3, 80)).toBeNull();
  expect(locale('zh-CN')).toBe('zh-CN');
  expect(locale('fr')).toBeNull();
  expect(email(' Player@Example.com ')).toBe('player@example.com');
  expect(uuidPattern.test('not-a-uuid')).toBe(false);
});

test('community writes are closed and admin page is noindex', async ({ request }) => {
  const admin = await request.get('/admin/ugc');
  expect(admin.status()).toBe(200);
  const adminHtml = await admin.text();
  expect(adminHtml).toMatch(/noindex/);
  const read = await request.get('/api/ugc/requests');
  if (adminHtml.includes('Supabase is not configured')) expect(read.status()).toBe(503);
  else {
    expect([200, 502]).toContain(read.status());
    if (read.status() === 502) expect((await read.json()).error.code).toBe('SERVICE_UNAVAILABLE');
  }
  const write = await request.post('/api/ugc/requests', {
    headers: { Origin: 'http://localhost:3000' },
    data: { title: 'New game', body: 'A game people would enjoy playing.', locale: 'en' },
  });
  expect(write.status()).toBe(adminHtml.includes('Supabase is not configured') ? 503 : 403);
  if (!adminHtml.includes('Supabase is not configured'))
    expect((await write.json()).error.code).toBe('NOT_OPEN');
});

test('cross-origin mutations are rejected before authentication', async ({ request }) => {
  const response = await request.post('/api/ugc/auth/request-code', {
    headers: { Origin: 'https://attacker.example' }, data: { email: 'player@example.com' },
  });
  expect(response.status()).toBe(403);
  expect((await response.json()).error.code).toBe('BAD_ORIGIN');
});

test('expired or absent session cannot refresh without a refresh token', async ({ request }) => {
  const response = await request.post('/api/ugc/auth/refresh', {
    headers: { Origin: 'http://localhost:3000' },
  });
  expect(response.status()).toBe(401);
  expect((await response.json()).error.code).toBe('AUTH_REQUIRED');
});

test('authentication endpoints reject malformed input when configured', async ({ request }) => {
  const headers = { Origin: 'http://localhost:3000' };
  const otp = await request.post('/api/ugc/auth/request-code', {
    headers, data: { email: 'not-an-email' },
  });
  const verify = await request.post('/api/ugc/auth/verify-code', {
    headers, data: { email: 'player@example.com', code: 'abc' },
  });
  expect(otp.status()).toBe(verify.status());
  expect([400, 503]).toContain(otp.status());
  if (otp.status() === 400) {
    expect((await otp.json()).error.code).toBe('INVALID_INPUT');
    expect((await verify.json()).error.code).toBe('INVALID_INPUT');
  }
});

test('anonymous caller cannot invoke moderation API', async ({ request }) => {
  const response = await request.post('/api/admin/ugc/moderate', {
    headers: { Origin: 'http://localhost:3000' },
    data: { type: 'request', id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', status: 'approved', reason: 'Looks good' },
  });
  expect(response.status()).toBe(403);
  expect((await response.json()).error.code).toBe('FORBIDDEN');
});

test('forged access cookie cannot invoke moderation API', async ({ request }) => {
  const response = await request.post('/api/admin/ugc/moderate', {
    headers: { Origin: 'http://localhost:3000', Cookie: 'gv_ugc_access=forged-token' },
    data: { type: 'request', id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', status: 'approved', reason: 'Looks good' },
  });
  expect(response.status()).toBe(403);
  expect((await response.json()).error.code).toBe('FORBIDDEN');
});

test('UGC and moderation routes are absent from the sitemap', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).not.toContain('/admin/ugc');
  expect(sitemap).not.toContain('/api/ugc');
  expect(sitemap).not.toContain('/requests');
});
