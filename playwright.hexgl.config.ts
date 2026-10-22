import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', testMatch: 'hexgl.spec.ts', workers: 1, retries: 0,
  timeout: 120_000, reporter: [['list'], ['json', { outputFile: 'test-results/hexgl-results.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:3000', channel: 'chrome', headless: true,
    viewport: { width: 1280, height: 720 }, trace: 'retain-on-failure',
    launchOptions: { args: ['--disable-backgrounding-occluded-windows'] },
  },
});
