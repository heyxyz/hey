import { expect, test } from '@playwright/test';
import { APP_NAME } from 'data/constants';
import { PRERENDER_BASE_URL } from 'test/constants';

test.beforeEach(async ({ page }) => {
  await page.goto(`${PRERENDER_BASE_URL}/u/yoginth`);
});

test('should have page title', async ({ page }) => {
  await expect(page).toHaveTitle(`Yoginth (@yoginth.lens) • ${APP_NAME}`);
});

test('should have name', async ({ page }) => {
  await expect(page.getByTestId('name')).toContainText('Yoginth');
});

test('should have handle', async ({ page }) => {
  await expect(page.getByTestId('handle')).toContainText('@yoginth');
});

test('should have feed', async ({ page }) => {
  await expect(page.getByTestId('feed')).toBeVisible();
});
