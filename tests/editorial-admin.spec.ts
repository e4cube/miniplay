import { expect, test } from '@playwright/test';
import { signSession } from '../src/lib/editorial/auth-core';

const cookie = signSession(123, 'editorial-test-secret-12345678901234567890');
const longBody = 'Original hands-on context and useful details for the player. '.repeat(9);

test('anonymous visitor can view login but cannot publish; cross-origin requests fail', async ({ page, request }) => {
  await page.goto('/admin/editorial');
  await expect(page.getByRole('link', { name: 'Sign in with GitHub' })).toBeVisible();
  const denied = await request.post('/api/admin/editorial/publish', { headers: { Origin: 'http://localhost:3100' }, data: {} });
  expect(denied.status()).toBe(401);
  const csrf = await request.post('/api/admin/editorial/publish', { headers: { Origin: 'https://evil.example' }, data: {} });
  expect(csrf.status()).toBe(403);
  const html = await page.content();
  expect(html).not.toContain('EDITORIAL_GITHUB_TOKEN');
});

test('admin previews, validates, publishes and signs out without a browser GitHub token', async ({ page, context }) => {
  await context.addCookies([{ name: 'gv_editorial_session', value: cookie, domain: 'localhost', path: '/', httpOnly: true, sameSite: 'Strict' }]);
  await page.goto('/admin/editorial');
  await expect(page.getByRole('heading', { name: 'Editorial admin' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Published articles' })).toBeVisible();
  await page.getByLabel('Title').fill('An Original Game Report');
  await page.getByLabel('URL slug').fill('original-game-report');
  await page.getByLabel('Summary').fill('An original summary of the game and the details that players should know.');
  await page.getByLabel('Body (plain text; separate paragraphs with blank lines)').fill(`${longBody}\n\n${longBody}`);
  await page.getByRole('button', { name: 'Preview' }).click();
  await expect(page.getByRole('region', { name: 'Article preview' })).toContainText('An Original Game Report');
  let captured: unknown;
  await page.route('**/api/admin/editorial/publish', async route => {
    captured = route.request().postDataJSON();
    await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ mode: 'published', url: '/blog/original-game-report' }) });
  });
  await page.getByRole('button', { name: 'Publish article' }).click();
  await expect(page.getByRole('status')).toContainText('Commit created');
  await expect(page.getByRole('link', { name: 'Article link' })).toHaveAttribute('href', '/blog/original-game-report');
  expect(captured).toMatchObject({ locale: 'en', slug: 'original-game-report', kind: 'news' });
  await page.getByLabel('Language').selectOption('zh-CN');
  await page.getByRole('button', { name: 'Publish article' }).click();
  expect(captured).toMatchObject({ locale: 'zh-CN', slug: 'original-game-report' });
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByRole('link', { name: 'Sign in with GitHub' })).toBeVisible();
});

test('publisher API validates input before needing GitHub credentials', async ({ request }) => {
  const headers = { Origin: 'http://localhost:3100', Cookie: `gv_editorial_session=${cookie}` };
  const invalid = await request.post('/api/admin/editorial/publish', { headers, data: { slug: '../bad' } });
  expect(invalid.status()).toBe(400);
  expect((await invalid.json()).field).toBe('slug');
  const valid = { slug: 'original-game-report', locale: 'en', kind: 'news', title: 'An Original Game Report',
    excerpt: 'An original summary of the game and the details that players should know.', body: longBody,
    videoUrl: null, publishedAt: '2026-10-20', updatedAt: '2026-10-20' };
  const unconfigured = await request.post('/api/admin/editorial/publish', { headers, data: valid });
  expect(unconfigured.status()).toBe(503);
  expect((await unconfigured.json()).code).toBe('NOT_CONFIGURED');
});
