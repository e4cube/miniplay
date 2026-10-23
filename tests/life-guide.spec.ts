import { expect, test } from './fixtures';

const path = '/guides/1-in-8-billion';
const canonical = 'https://gamevado.com' + path;

test('life guide has accurate SEO, accessible content and real related games', async ({ page, request, context }) => {
  // Keep third-party ad transport out of page correctness checks.
  await context.route('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js*', route => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const response = await page.goto(path);
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle('1 in 8 Billion Guide: How to Play & Tips | GameVado');
  await expect(page.locator('h1')).toHaveText("1 in 8 Billion:Complete Beginner's Guide");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Learn how to play 1 in 8 Billion, explore life simulation features, discover beginner tips, and try more free games on GameVado.');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical);
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByText('This is an independent fan-made guide. GameVado is not affiliated with the creators of 1 in 8 Billion.')).toBeVisible();
  const official = page.getByRole('link', { name: /Play on Official Website/ });
  await expect(official).toHaveAttribute('href', 'https://1in8b.life/');
  await expect(official).toHaveAttribute('rel', 'noopener noreferrer');
  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  const nodes = schemas.flatMap(value => JSON.parse(value));
  expect(nodes.find(node => node['@type'] === 'Article')).toMatchObject({ mainEntityOfPage: canonical, inLanguage: 'en' });
  expect(nodes.find(node => node['@type'] === 'BreadcrumbList').itemListElement.at(-1).item).toBe(canonical);
  expect(nodes.some(node => node['@type'] === 'FAQPage')).toBe(false);
  expect(await page.locator('link[hreflang="zh-CN"]').count()).toBe(0);
  for (const width of [320, 375, 768, 1366]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('article#article').evaluate(element => [...element.querySelectorAll('*')].every(child => {
      const rect = child.getBoundingClientRect();
      return getComputedStyle(child).position === 'absolute' || rect.right <= innerWidth + 1;
    }))).toBe(true);
  }
  await expect(page.getByRole('link', { name: 'Chinese homepage' })).toHaveAttribute('href', '/zh');
  expect((await request.get('/zh')).status()).toBe(200);
  const cards = page.locator('#related-games .game-cover-link');
  expect(await cards.count()).toBe(3);
  expect(await cards.evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual([
    '/games/starlight-keeper', '/games/battle-tanks', '/games/neon-rain',
  ]);
  for (const link of await cards.all()) {
    const href = (await link.getAttribute('href'))!;
    expect((await request.get(href)).status()).toBe(200);
    const image = link.locator('img');
    expect((await request.get((await image.getAttribute('src'))!)).status()).toBe(200);
  }
  for (const anchor of await page.getByRole('navigation', { name: 'On this page' }).locator('a').all()) {
    expect(await page.locator((await anchor.getAttribute('href'))!).count()).toBe(1);
  }
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain(`<loc>${canonical}</loc>`);
  expect(xml).not.toContain('/zh/guides/1-in-8-billion');
  await page.goto('/');
  await expect(page.getByRole('contentinfo').getByRole('link', { name: '1 in 8 Billion guide' })).toHaveAttribute('href', path);
  expect(errors).toEqual([]);
});
