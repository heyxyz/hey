import { APP_NAME } from '@lenster/data/constants';
import { expect, test } from '@playwright/test';
import { WEB_BASE_URL } from 'test/constants';

test.beforeEach(async ({ page }) => {
  await page.goto(WEB_BASE_URL);
});

test('should have page title', async ({ page }) => {
  await expect(page).toHaveTitle(APP_NAME);
});

test('should have hero', async ({ page }) => {
  await expect(page.getByTestId('home-hero')).toContainText(
    'Welcome to Lenster 👋'
  );
});

test('should have explore feed', async ({ page }) => {
  await expect(page.getByTestId('explore-feed')).toBeVisible();
});
