import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('HexGL remains unpublished when the review flag is absent', async ({ request }) => {
  for (const path of ['/games/hexgl', '/play/hexgl/', '/play/hexgl/index.html', '/play/hexgl/launch.js', '/play/hexgl/textures.full/ships/feisar/diffuse.jpg']) {
    const response = await request.get(`http://127.0.0.1:3001${path}`);
    expect(response.status(), path).toBe(404);
    expect(response.headers()['x-robots-tag']).toContain('noindex');
  }
  for (const path of ['/', '/games', '/sitemap.xml']) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(await response.text()).not.toMatch(/\/games\/hexgl|\/play\/hexgl/);
  }
});

test('review detail, original assets, WebGL, controls, audio, collision and finish', async ({ page }, testInfo) => {
  const errors: string[] = [], warnings: string[] = [], failed: string[] = [], external: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); if (message.type() === 'warning') warnings.push(message.text()); });
  page.on('requestfailed', request => failed.push(`${request.url()} ${request.failure()?.errorText}`));
  page.on('response', response => { if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`); });
  page.on('request', request => { if (/^https?:/.test(request.url()) && !request.url().startsWith('http://127.0.0.1:3000/')) external.push(request.url()); });
  const observations: Record<string, unknown> = {};
  try {
    const detail = await page.goto('/games/hexgl');
    expect(detail?.headers()['x-robots-tag']).toContain('noindex');
    await expect(page.getByRole('heading', { name: 'HexGL: GameVado Edition', exact: true })).toBeVisible();
    await page.getByRole('link', { name: 'Launch original HexGL' }).click();
    await expect(page).toHaveTitle('HexGL: GameVado Edition — Review');
    await page.waitForLoadState('load');
    await page.waitForFunction(() => typeof document.getElementById('s-credits')?.onclick === 'function');
    expect(await page.locator('iframe').count()).toBe(0);
    // The original hover animation moves the target during Playwright stability checks.
    // Disable animation in this test only, without changing the game's CSS.
    await page.addStyleTag({ content: '* { animation: none !important; transition: none !important; }' });
    await page.locator('#s-credits').click({ force: true });
    await expect(page.locator('#credits')).toContainText('Thibaut Despoulain');
    await page.locator('#credits').click({ force: true });
    await page.locator('#start').click({ force: true });
    await expect(page.locator('#step-2')).toBeVisible();
    await page.locator('#step-2').click({ force: true });
    await page.waitForFunction(() => (window as any).hexGL?.gameplay?.step === 4, null, { timeout: 90_000 });
    observations.boot = await page.evaluate(() => {
      const h = (window as any).hexGL, audio = (window as any).bkcore.Audio;
      const gl = h.renderer.getContext();
      return { visibility: document.visibilityState, renderer: gl.getParameter(gl.RENDERER), version: gl.getParameter(gl.VERSION),
        geometries: h.renderer.info.memory.geometries, textures: h.renderer.info.memory.textures,
        sceneChildren: h.manager.get('game').scene.children.length, shipVertices: h.components.shipControls.mesh.geometry.vertices.length,
        audioState: audio._ctx.state, sounds: Object.fromEntries(Object.entries(audio.sounds).map(([id, value]) => [id, !!(value as any).src])), quality: h.quality };
    });
    expect((observations.boot as any).geometries).toBeGreaterThan(5);
    expect((observations.boot as any).textures).toBeGreaterThan(10);
    expect((observations.boot as any).audioState).toBe('running');
    expect(Object.values((observations.boot as any).sounds).every(Boolean)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath('hexgl-race.png') });
    const initial = await page.evaluate(() => ({ p: (window as any).hexGL.components.shipControls.dummy.position.clone(), time: (window as any).hexGL.gameplay.timer.time.elapsed }));
    await page.keyboard.down('ArrowUp');
    await page.waitForTimeout(700);
    observations.accelerate = await page.evaluate(() => { const h = (window as any).hexGL; return { speed: h.components.shipControls.speed, p: h.components.shipControls.dummy.position.clone(), time: h.gameplay.timer.time.elapsed, forward: h.components.shipControls.key.forward }; });
    expect((observations.accelerate as any).forward).toBe(true);
    expect((observations.accelerate as any).speed).toBeGreaterThan(0);
    expect((observations.accelerate as any).p).not.toEqual(initial.p);
    expect((observations.accelerate as any).time).toBeGreaterThan(initial.time);
    await page.keyboard.down('ArrowLeft'); await page.waitForTimeout(250);
    observations.steer = await page.evaluate(() => { const s = (window as any).hexGL.components.shipControls; return { angular: s.angular, left: s.key.left }; });
    expect((observations.steer as any).left).toBe(true);
    expect((observations.steer as any).angular).toBeGreaterThan(0);
    await page.keyboard.up('ArrowLeft'); await page.keyboard.up('ArrowUp');
    const brakeBefore = await page.evaluate(() => (window as any).hexGL.components.shipControls.speed);
    await page.keyboard.down('a'); await page.keyboard.down('d'); await page.waitForTimeout(250);
    observations.brake = await page.evaluate(() => { const s = (window as any).hexGL.components.shipControls; return { speed: s.speed, left: s.key.ltrigger, right: s.key.rtrigger }; });
    await page.keyboard.up('a'); await page.keyboard.up('d');
    expect((observations.brake as any).left && (observations.brake as any).right).toBe(true);
    expect((observations.brake as any).speed).toBeLessThan(brakeBefore);
    observations.audio = await page.evaluate(async () => {
      const audio = (window as any).bkcore.Audio, analyser = audio._ctx.createAnalyser();
      audio.sounds.bg.gainNode.connect(analyser); const samples = new Float32Array(analyser.fftSize);
      await new Promise(resolve => setTimeout(resolve, 150)); analyser.getFloatTimeDomainData(samples);
      analyser.disconnect(); return { state: audio._ctx.state, rms: Math.sqrt(samples.reduce((sum, v) => sum + v * v, 0) / samples.length) };
    });
    expect((observations.audio as any).rms).toBeGreaterThan(0);
    // Drive towards a wall with real keyboard input, without replacing collision logic.
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => (window as any).hexGL.gameplay.step === 4);
    await page.keyboard.down('ArrowUp'); await page.keyboard.down('ArrowLeft');
    await page.waitForFunction(() => { const s = (window as any).hexGL.components.shipControls; return s.shield < s.maxShield || s.destroyed; }, null, { timeout: 30_000 });
    observations.collision = await page.evaluate(() => { const s = (window as any).hexGL.components.shipControls; return { shield: s.shield, maxShield: s.maxShield, destroyed: s.destroyed, falling: s.falling }; });
    await page.keyboard.up('ArrowUp'); await page.keyboard.up('ArrowLeft');
    // Deterministic three-lap checkpoint integration check. This is not an automated
    // claim that a human/driver completed three laps using only keyboard steering.
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => (window as any).hexGL.gameplay.step === 4);
    observations.finish = await page.evaluate(() => {
      const h = (window as any).hexGL, g = h.gameplay, ship = h.components.shipControls;
      ship.active = false;
      const points: Record<number, { x: number; z: number }> = {};
      const map = g.analyser, width = map.pixels.width, height = map.pixels.height;
      for (let z = 0; z < height; z++) for (let x = 0; x < width; x++) {
        const c = map.getPixel(x, z);
        if (c.r === 255 && c.g === 255 && c.b <= 2 && !points[c.b]) points[c.b] = { x: (x - width / 2) / g.pixelRatio, z: (z - height / 2) / g.pixelRatio };
        if (Object.keys(points).length === 3) break;
      }
      for (let lap = 0; lap < 3; lap++) for (const cp of [1, 2, 0]) {
        ship.dummy.position.x = points[cp].x; ship.dummy.position.z = points[cp].z;
        g.timer.time.elapsed += 1000; g.modes.timeattack.call(g);
      }
      return { points, lap: g.lap, result: g.result, expectedFinish: g.results.FINISH, lapTimes: g.lapTimes, step: g.step };
    });
    expect((observations.finish as any).result).toBe((observations.finish as any).expectedFinish);
    expect((observations.finish as any).lapTimes).toHaveLength(3);
    await expect(page.locator('#step-5')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('#time')).not.toContainText('NaN');
    await page.locator('#step-5').click();
    await page.waitForLoadState('load');
    await expect(page.locator('#start')).toBeVisible();
    await page.getByRole('link', { name: 'Exit · GameVado review' }).click();
    await expect(page).toHaveURL(/\/games\/hexgl$/);
    expect(errors).toEqual([]); expect(failed).toEqual([]); expect(external).toEqual([]);
  } finally {
    await testInfo.attach('observations', { body: JSON.stringify({ observations, errors, warnings, failed, external }, null, 2), contentType: 'application/json' });
  }
});

test('original files are served from the review subtree', async ({ request }) => {
  const manifest = JSON.parse(await readFile('docs/hexgl/upstream-manifest.json', 'utf8'));
  for (const path of Object.keys(manifest.files)) {
    const response = await request.get(`/play/hexgl/${path}`);
    // Next deliberately refuses dotfiles; the original .gitignore is source metadata.
    if (path.startsWith('.')) continue;
    expect(response.status(), path).toBe(200);
  }
});
