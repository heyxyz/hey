import { APP_NAME } from '@lenster/data/constants';
import { expect, test } from '@playwright/test';
import { WEB_BASE_URL } from 'test/constants';

test.beforeEach(async ({ page }) => {
  await page.goto(`${WEB_BASE_URL}/contact`);
});

test('should have page title', async ({ page }) => {
  await expect(page).toHaveTitle(`Contact • ${APP_NAME}`);
});
