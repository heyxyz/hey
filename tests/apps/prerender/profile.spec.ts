import { APP_NAME } from '@lenster/data/constants';
import { expect, test } from '@playwright/test';
import { PRERENDER_BASE_URL } from 'test/constants';

test.beforeEach(async ({ page }) => {
  await page.goto(`${PRERENDER_BASE_URL}/u/yoginth`);
});

test('should have page title', async ({ page }) => {
  await expect(page).toHaveTitle(`Yoginth (@yoginth.lens) • ${APP_NAME}`);
});

test('should have name', async ({ page }) => {
  await expect(page.getByTestId('profile-name')).toContainText('Yoginth');
});

test('should have handle', async ({ page }) => {
  await expect(page.getByTestId('profile-handle')).toContainText('@yoginth');
});

test('should have bio', async ({ page }) => {
  await expect(page.getByTestId('profile-bio')).toContainText(
    'opinions are mine'
  );
});

test('should have feed', async ({ page }) => {
  await expect(page.getByTestId('profile-feed')).toBeVisible();
});
