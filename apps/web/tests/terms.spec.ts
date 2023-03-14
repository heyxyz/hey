import { expect, test } from '@playwright/test';
import { APP_NAME } from 'data/constants';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4783/terms');
});

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle(`Terms & Conditions • ${APP_NAME}`);
});
