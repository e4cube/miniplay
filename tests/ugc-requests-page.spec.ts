import { expect, test } from '@playwright/test';

for (const [path, heading, closed] of [
  ['/requests', 'Game Requests', 'Submitting requests and voting are not open yet.'],
  ['/zh/requests', '游戏愿望清单', '目前尚未开放提交和投票。'],
] as const) {
  test(`${path} is a read-only, noindex mobile-friendly preview`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    await expect(page.getByRole('status')).toContainText(closed);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('button[disabled]')).toHaveCount(await page.locator('li button').count());
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
}
