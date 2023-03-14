import { expect, test } from '@playwright/test';
import { APP_NAME } from 'data/constants';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4783/contact');
});

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle(`Contact • ${APP_NAME}`);
});
