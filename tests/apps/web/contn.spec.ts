import { test, expect } from '../../fixtures';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import { WEB_BASE_URL } from 'test/constants';

test.beforeEach(async ({ page }) => {
  // baseUrl is set in playwright.config.ts
  await page.goto(`${WEB_BASE_URL}/`);
});

test('connect wallet using default metamask account', async ({ page }) => {
  await page.click('#connectButton');
  await metamask.acceptAccess();
  await expect(page.locator('#accounts')).toHaveText(process.env.ADDRESS);
});

test('import private key and connect wallet using imported metamask account', async ({
  page
}) => {
  await metamask.importAccount(process.env.SEED_PHRASE);
  await page.click('#connectButton');
  await metamask.acceptAccess();
  await expect(page.locator('#accounts')).toHaveText(process.env.ADDRESS);
});
