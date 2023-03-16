import { expect, test } from '@playwright/test';
import { APP_NAME } from 'data/constants';
import { WEB_BASE_URL } from 'test/constants';

test.beforeEach(async ({ page }) => {
  await page.goto(WEB_BASE_URL);
});

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle(APP_NAME);
});

test('has hero', async ({ page }) => {
  await expect(page.getByTestId('home-hero')).toContainText('Welcome to Lenster 👋');
});

test('has explore feed', async ({ page }) => {
  await expect(page.getByTestId('explore-feed')).toBeVisible();
});
