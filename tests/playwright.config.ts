import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './scripts',
  timeout: 30 * 1000,
  expect: { timeout: 30000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    actionTimeout: 0,
    trace: 'on-first-retry'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
};

export default config;
