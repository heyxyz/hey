import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4783');
});

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle(/Lenster/);
});

test('has home hero', async ({ page }) => {
  await expect(page.getByTestId('home-hero')).toContainText('Welcome to Lenster 👋');
});

test('has explore feed', async ({ page }) => {
  await expect(page.getByTestId('explore-feed')).toBeVisible();
});
