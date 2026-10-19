import {test, expect} from './fixtures';
import {games} from '../src/data/games';
import {getGames} from '../src/i18n/games';

for (const locale of ['en', 'zh-CN'] as const) {
  test(`${locale} game descriptions and links exist before JavaScript runs`, async ({request}) => {
    const prefix = locale === 'en' ? '' : '/zh';
    for (const game of getGames(locale)) {
      const response = await request.get(`${prefix}/games/${game.slug}`);
      expect(response.status(), game.slug).toBe(200);
      const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
      expect(html.match(/<h1\b/g), game.slug).toHaveLength(1);
      expect(html, game.slug).toContain(locale === 'en' ? 'How to Play' : '游戏玩法');
      expect(html, game.slug).toContain(locale === 'en' ? 'Controls' : '操作方式');
      expect(html, game.slug).toContain(locale === 'en' ? 'Related Games' : '相关游戏');
      expect(html, game.slug).toMatch(new RegExp(`href="${prefix}/games/(?!${game.slug}")[a-z0-9-]+"`));
      expect(html, game.slug).not.toMatch(/name="robots"[^>]*noindex/);
    }
    const index = await (await request.get(`${prefix}/games`)).text();
    for (const game of games) expect(index).toContain(`href="${prefix}/games/${game.slug}"`);
  });
}

test('game loads with one heading and instructions after hydration', async ({page}) => {
  await page.goto('/games/snake');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', {name: 'How to Play', exact: true})).toHaveCount(1);
  await page.getByRole('button', {name: 'Pause', exact: true}).click();
  await expect(page.getByRole('button', {name: 'Resume', exact: true})).toBeVisible();
});
