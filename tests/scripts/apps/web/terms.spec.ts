import { expect, test } from '@playwright/test';
import { APP_NAME } from 'data/constants';
import { WEB_BASE_URL } from 'test/constants';

test.beforeEach(async ({ page }) => {
  await page.goto(`${WEB_BASE_URL}/terms`);
});

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle(`Terms & Conditions • ${APP_NAME}`);
});
