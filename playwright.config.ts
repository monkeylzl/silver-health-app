import { defineConfig } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL ?? 'https://web-nu-blond-89.vercel.app';
const browserChannel = process.env.E2E_BROWSER_CHANNEL ?? (process.env.CI ? undefined : 'chrome');
const chromiumMobile = {
  browserName: 'chromium' as const,
  ...(browserChannel ? { channel: browserChannel } : {}),
  hasTouch: true,
  isMobile: true,
};

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'mobile-390',
      use: {
        ...chromiumMobile,
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'mobile-360',
      use: {
        ...chromiumMobile,
        viewport: { width: 360, height: 800 },
      },
    },
  ],
});
