import { expect, test } from '@playwright/test';
import { parseVideoLink } from '../src/lib/editorial/video';

test('editorial video links use a strict platform allowlist', () => {
  expect(parseVideoLink('https://youtu.be/dQw4w9WgXcQ')?.embedUrl).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  expect(parseVideoLink('https://www.bilibili.com/video/BV1xx411c7mD')?.platform).toBe('Bilibili');
  expect(parseVideoLink('https://x.com/example/status/123456')?.embedUrl).toBeNull();
  expect(parseVideoLink('https://www.tiktok.com/@creator/video/123456')?.platform).toBe('TikTok');
  expect(parseVideoLink('https://youtube.com.evil.test/watch?v=dQw4w9WgXcQ')).toBeNull();
  expect(parseVideoLink('javascript:alert(1)')).toBeNull();
  expect(parseVideoLink('https://evil.test/video')).toBeNull();
});

test('there is no browser publishing endpoint', async ({ request }) => {
  const response = await request.post('/api/admin/editorial', {
    headers: { Origin: 'http://localhost:3000' },
    data: { slug: 'test', title: 'A test article', body: 'Test body' },
  });
  expect(response.status()).toBe(404);
});

test('editorial pages have safe empty state and no admin URLs in sitemap', async ({ page, request }) => {
  await page.goto('/blog');
  await expect(page.getByRole('heading', { level: 1, name: 'Game Journal' })).toBeVisible();
  await page.goto('/zh/blog');
  await expect(page.getByRole('heading', { level: 1, name: '游戏文章' })).toBeVisible();
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).not.toContain('/admin/editorial');
  expect(sitemap).not.toContain('/blog/');
  expect(sitemap).not.toContain('<loc>https://gamevado.com/blog</loc>');
});
