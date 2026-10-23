import {test,expect,type Page} from './fixtures';

async function isolate(page:Page){
  await page.context().route('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js*',route=>route.fulfill({status:200,contentType:'application/javascript',body:''}));
}
async function begin(page:Page,locale=''){
  await isolate(page);await page.goto(locale+'/games/life-atlas');
  const game=page.getByTestId('life-atlas');
  await game.locator('#life-seed').fill('4312');
  await game.locator('#life-region').selectOption('0');
  await game.getByRole('button',{name:locale?'开始一段人生':'Begin a life'}).click();
  await game.getByRole('button',{name:locale?'暂停':'Pause',exact:true}).click();
  await expect(game.getByTestId('life-age')).toHaveText('0');
  return game;
}
test('manual play pauses at decisions, applies choices and restores after reload',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  const game=await begin(page);
  for(let i=0;i<6;i++)await game.getByRole('button',{name:'Next year'}).click();
  await expect(game.getByTestId('life-age')).toHaveText('6');
  await expect(game.getByRole('button',{name:'Next year'})).toBeDisabled();
  const before=Number(await game.getByTestId('stat-bonds').textContent());
  await game.getByRole('button',{name:/Say hello/}).click();
  expect(Number(await game.getByTestId('stat-bonds').textContent())).toBeGreaterThan(before);
  await game.getByRole('button',{name:'Next year'}).click();
  await page.reload();
  await expect(game.getByTestId('life-age')).toHaveText('7');
  await expect(game.getByRole('button',{name:'Resume',exact:true})).toBeVisible();
  await expect(game.getByRole('heading',{name:'The story so far'})).toBeVisible();
  expect(errors).toEqual([]);
});
test('autopilot finishes a complete life and records it exactly once',async({page})=>{
  const game=await begin(page);
  await page.clock.install();
  await game.getByRole('checkbox',{name:'Autopilot'}).check();
  await game.getByRole('combobox',{name:'Simulation speed'}).selectOption('10');
  await game.getByRole('button',{name:'Resume',exact:true}).click();
  await page.clock.runFor(35_000);
  await expect(game.getByRole('heading',{name:'A life, fully lived.'})).toBeVisible();
  await expect(game.locator('details')).toHaveCount(1);
  await page.reload();
  await expect(game.locator('details')).toHaveCount(1);
  await expect(game.getByRole('heading',{name:'A life, fully lived.'})).toBeVisible();
  await game.getByRole('button',{name:'Discover another life'}).click();
  await expect(game.locator('#life-seed')).toBeVisible();
  await game.getByRole('button',{name:'Return to current life'}).click();
  await expect(game.locator('details')).toHaveCount(1);
});
test('setup validates seeds and corrupted browser saves recover without crashing',async({page})=>{
  await isolate(page);await page.goto('/games/life-atlas');
  const game=page.getByTestId('life-atlas');
  await game.locator('#life-seed').fill('9999999999');
  await game.getByRole('button',{name:'Begin a life'}).click();
  await expect(game.getByRole('alert')).toContainText('Use a seed');
  await page.evaluate(()=>localStorage.setItem('miniplay:life-atlas:v1',JSON.stringify({version:1,life:{age:'invalid'},history:[]})));
  await page.reload();
  await expect(game.getByRole('button',{name:'Begin a life'})).toBeVisible();
});
test('both languages and narrow layouts have usable controls and real discovery links',async({page,request})=>{
  const game=await begin(page,'/zh');
  await expect(page.locator('h1')).toHaveText('人生图鉴');
  await expect(game.getByRole('button',{name:'下一年'})).toBeVisible();
  for(const width of [320,375,768,1366]){
    await page.setViewportSize({width,height:900});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    expect(await game.evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBe(true);
  }
  const xml=await(await request.get('/sitemap.xml')).text();
  expect(xml).toContain('/games/life-atlas</loc>');expect(xml).toContain('/zh/games/life-atlas</loc>');
  await page.goto('/category/casual');await expect(page.locator('.game-cover-link[href="/games/life-atlas"]')).toBeVisible();
  expect((await request.get('/assets/covers/life-atlas.svg')).status()).toBe(200);
});
