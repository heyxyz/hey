import { expect, test } from '@playwright/test';
import { APP_NAME } from 'data/constants';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4783');
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
