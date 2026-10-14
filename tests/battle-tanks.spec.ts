import { expect,test } from './fixtures';
test('Battle Tanks menu, levels, play, pause and editor work',async({page})=>{
 await page.goto('/games/battle-tanks');await page.getByRole('button',{name:'CAMPAIGN',exact:true}).click();
 await expect(page.getByRole('button',{name:/Level \d+:/})).toHaveCount(12);
 await expect(page.getByRole('button',{name:/Level 2:/})).toBeDisabled();
 await page.getByRole('button',{name:/Level 1:/}).click();await expect(page.getByLabel('Battle Tanks battlefield')).toBeVisible();
 await page.getByRole('button',{name:'Pause',exact:true}).click();await expect(page.getByRole('dialog',{name:'Pause menu'})).toBeVisible();
 await page.getByRole('button',{name:'RESUME',exact:true}).click();
 await page.getByRole('link',{name:'Open Map Editor'}).click();await expect(page.getByRole('heading',{name:'Battle Tanks Map Editor'})).toBeVisible();
});
test('mobile controls are touch sized',async({page},info)=>{
 test.skip(info.project.name!=='mobile');await page.goto('/games/battle-tanks');await page.getByRole('button',{name:'CAMPAIGN',exact:true}).click();await page.getByRole('button',{name:/Level 1:/}).click();
 const box=await page.getByRole('button',{name:'FIRE',exact:true}).boundingBox();expect(box!.width).toBeGreaterThanOrEqual(44);
});
test('editor draft survives actual return link and reload',async({page})=>{
 await page.goto('/games/battle-tanks/editor');await page.getByRole('button',{name:'BRICK',exact:true}).click();await page.getByRole('button',{name:'0,0 EMPTY',exact:true}).click();await page.getByRole('button',{name:'Test Map',exact:true}).click();
 await page.getByRole('button',{name:'PLAY TEST MAP',exact:true}).click();await expect(page.getByText(/First Defense · Enemies/)).toBeVisible();
 await page.getByRole('link',{name:'Return to editor',exact:true}).click();await expect(page.getByRole('button',{name:'0,0 BRICK',exact:true})).toBeVisible();await page.reload();await expect(page.getByRole('button',{name:'0,0 BRICK',exact:true})).toBeVisible();
});
test('required image failure is visible and blocks normal entry',async({page})=>{
 await page.route('**/tiles/runtime/ice.webp',route=>route.abort());await page.goto('/games/battle-tanks');
 await expect(page.getByRole('alert').filter({has:page.getByRole('heading',{name:'Art assets unavailable'})})).toContainText('required image');await expect(page.getByRole('button',{name:'CAMPAIGN',exact:true})).toHaveCount(0);
 await page.unroute('**/tiles/runtime/ice.webp');await page.getByRole('button',{name:'Retry',exact:true}).click();await expect(page.getByRole('button',{name:'CAMPAIGN',exact:true})).toBeVisible();
});

test('survival starts with data-driven first wave on first entry',async({page})=>{
 await page.goto('/games/battle-tanks');
 await page.getByRole('button',{name:'SURVIVAL',exact:true}).click();
 await expect(page.getByText('First Defense · Enemies 4', {exact:true})).toBeVisible();
});