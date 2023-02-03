import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:4783');

  await expect(page).toHaveTitle(/Lenster/);
});
