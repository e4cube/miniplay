import {test,expect} from './fixtures';
for(const slug of ['life-atlas','epoch-trails']){
 test(slug+' exposes bilingual server-rendered content, image SEO and real crosslinks',async({page,request,context})=>{
  await context.route('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js*',r=>r.fulfill({status:200,contentType:'application/javascript',body:''}));
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  for(const zh of [false,true]){
   const path=(zh?'/zh':'')+'/games/'+slug,url='https://gamevado.com'+path;
   const response=await request.get(path);expect(response.status()).toBe(200);
   const html=await response.text();expect(html).toContain('simulation-overview-title');expect(html).toContain(zh?'本地':'browser');
   await page.goto(path);
   await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href',url);
   await expect(page.locator('link[hreflang=en]')).toHaveAttribute('href','https://gamevado.com/games/'+slug);
   await expect(page.locator('link[hreflang="zh-CN"]')).toHaveAttribute('href','https://gamevado.com/zh/games/'+slug);
   await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content','https://gamevado.com/assets/covers/'+slug+'-og.webp');
   await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content','1200');
   await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content','630');
   await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content','summary_large_image');
   expect(await page.title()).toContain('GameVado');
   if(zh)expect(await page.title()).toContain('人生模拟器');
   const description=await page.locator('meta[name=description]').getAttribute('content');expect(description!.length).toBeGreaterThan(40);
   const section=page.locator('section[aria-labelledby="simulation-overview-title"]');await expect(section).toBeVisible();
   await expect(section).toContainText('人生模拟器');
   const other=slug==='life-atlas'?'epoch-trails':'life-atlas';await expect(section.locator('a').first()).toHaveAttribute('href',(zh?'/zh':'')+'/games/'+other);
   await expect(section.locator('a').last()).toHaveAttribute('href','/guides/1-in-8-billion');
   const nodes=(await page.locator('script[type="application/ld+json"]').allTextContents()).flatMap(s=>JSON.parse(s));
   expect(nodes.find(n=>n['@type']==='VideoGame')).toMatchObject({url,image:'https://gamevado.com/assets/covers/'+slug+'-v2.webp',isAccessibleForFree:true,offers:{price:0,priceCurrency:'USD'}});
   expect(nodes.some(n=>n['@type']==='FAQPage')).toBe(false);
   for(const suffix of ['v2','og']){const image=await request.get('/assets/covers/'+slug+'-'+suffix+'.webp');expect(image.status()).toBe(200);expect(image.headers()['content-type']).toContain('image/webp');expect((await image.body()).byteLength).toBeLessThan(300000);}
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
 });
}
