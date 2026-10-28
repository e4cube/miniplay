import {test,expect} from './fixtures';
import {unpublishedGames} from '../src/data/games';
const slugs=['wanchao','epoch-trails','life-atlas','neon-rain','meow-cafe','starlight-keeper','battle-tanks'];

test('only seven published games appear in both catalogs and homepage recommendations',async({page})=>{
 for(const prefix of ['', '/zh']){
  for(const path of ['/games','']){
   await page.goto(prefix+path||'/',{waitUntil:'domcontentloaded'});
   const links=await page.locator('a[href]').evaluateAll(anchors=>anchors.map(a=>a.getAttribute('href')!));
   const gameLinks=[...new Set(links.filter(h=>/^\/(?:zh\/)?games\/[^/]+$/.test(h)).map(h=>h.split('/').pop()))];
   expect(gameLinks.sort()).toEqual([...slugs].sort());
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
 }
});

test('unpublished games return 404 in English and Chinese and stay out of the sitemap',async({request})=>{
 const sitemap=await (await request.get('/sitemap.xml')).text();
 for(const prefix of ['', '/zh']){
  for(const slug of [...unpublishedGames.map(g=>g.slug),'match-3']){
   expect((await request.get(prefix+'/games/'+slug)).status(),slug).toBe(404);
   expect(sitemap).not.toContain('<loc>https://gamevado.com'+prefix+'/games/'+slug+'</loc>');
  }
 }
 expect((await request.get('/games/battle-tanks/editor')).status()).toBe(200);
});

test('all seven game pages retain bilingual routes and original credit',async({request})=>{
 for(const prefix of ['', '/zh']){
  for(const slug of slugs){
   const response=await request.get(prefix+'/games/'+slug);expect(response.status()).toBe(200);
   const html=await response.text();expect(html).toContain('GameVado Original');
   expect(html).toContain('data-original-credit="gamevado"');
   expect(html).toContain('https://gamevado.com'+prefix+'/games/'+slug);
  }
 }
});
