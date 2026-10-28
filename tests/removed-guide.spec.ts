import {test,expect} from './fixtures';

test('retired guide is absent from discovery and returns not found',async({page,request})=>{
 const response=await request.get('/guides/1-in-8-billion');
 expect(response.status()).toBe(404);
 const image=await request.get('/guides/1-in-8-billion/opengraph-image');
 expect(image.status()).toBe(404);
 const sitemap=await request.get('/sitemap.xml');
 expect(await sitemap.text()).not.toContain('/guides/1-in-8-billion');
 for(const path of ['/','/zh']){
  await page.goto(path);
  await expect(page.locator('a[href*="1-in-8-billion"],a[href*="1in8b.life"]')).toHaveCount(0);
  expect(await page.locator('body').innerText()).not.toMatch(/1in8|1 in 8 Billion/i);
 }
});
