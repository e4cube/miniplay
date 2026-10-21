import { defineConfig, devices } from '@playwright/test';

const editorialEnv = {
  NEXT_PUBLIC_SITE_URL: 'https://gamevado.com',
  EDITORIAL_ORIGIN: 'http://localhost:3100',
  EDITORIAL_ADMIN_GITHUB_ID: '123',
  EDITORIAL_SESSION_SECRET: 'editorial-test-secret-12345678901234567890',
  EDITORIAL_OAUTH_CLIENT_ID: 'test-client',
  EDITORIAL_OAUTH_CLIENT_SECRET: 'test-secret',
};

export default defineConfig({
  testDir: './tests', testMatch: 'editorial*.spec.ts', fullyParallel: false,
  workers: 1, retries: 0, reporter: 'list',
  use: { baseURL: 'http://localhost:3100', channel: 'chrome' },
  projects: [{ name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } }],
  webServer: { command: 'pnpm exec next dev -p 3100', url: 'http://localhost:3100', reuseExistingServer: false,
    timeout: 120000, env: editorialEnv },
});
