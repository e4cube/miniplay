import {test,expect} from './fixtures';
test('guide exposes crawlable content and a working original sharing image',async({page,request})=>{
 const response=await page.goto('/guides/1-in-8-billion');
 expect(response?.status()).toBe(200);
 expect(response?.headers()['x-robots-tag']??'').not.toMatch(/noindex|none/i);
 const robots=await page.locator('meta[name=robots]').getAttribute('content');
 expect(robots).toContain('index');expect(robots).toContain('follow');expect(robots).not.toContain('noindex');
 expect(robots).toContain('max-image-preview:large');
 await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content','summary_large_image');
 const image=await page.locator('meta[property="og:image"]').getAttribute('content');
 expect(image).toContain('/guides/1-in-8-billion/opengraph-image');
 const png=await request.get(new URL(image!).pathname);
 expect(png.status()).toBe(200);
 expect(png.headers()['content-type']).toContain('image/png');
 const body=await png.body();
 expect(body.readUInt32BE(16)).toBe(1200);
 expect(body.readUInt32BE(20)).toBe(630);
 const nodes=(await page.locator('script[type="application/ld+json"]').allTextContents()).flatMap(s=>JSON.parse(s));
 expect(nodes.find(n=>n['@type']==='Article')).toMatchObject({datePublished:'2026-10-23',dateModified:'2026-10-24',image:{width:1200,height:630},author:{url:'https://gamevado.com/about'}});
 expect(await page.locator('time').getAttribute('datetime')).toBe('2026-10-24');
 const sitemap=await(await request.get('/sitemap.xml')).text();
 const entry=sitemap.split('<url>').find(s=>s.includes('<loc>https://gamevado.com/guides/1-in-8-billion</loc>'));
 expect(entry).toContain('2026-10-24');
 const robotText=await(await request.get('/robots.txt')).text();
 expect(robotText).toContain('Allow: /');expect(robotText).toContain('https://gamevado.com/sitemap.xml');
 await expect(page.getByRole('heading',{name:'Starting settings explained'})).toBeVisible();
 for(const home of ['/','/zh']){
  await page.goto(home);
  await expect(page.locator('section[aria-labelledby="life-guide-entry-title"] a')).toHaveAttribute('href','/guides/1-in-8-billion');
 }
});
