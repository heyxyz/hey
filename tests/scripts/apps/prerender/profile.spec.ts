import { expect, test } from '@playwright/test';
import { APP_NAME } from 'data/constants';
import { PRERENDER_BASE_URL } from 'test/constants';

test.beforeEach(async ({ page }) => {
  await page.goto(`${PRERENDER_BASE_URL}/u/alainnicolas`);
});

test.skip('should have page title', async ({ page }) => {
  await expect(page).toHaveTitle(`Alain (@alainnicolas.test) • ${APP_NAME}`);
});

test.skip('should have name', async ({ page }) => {
  await expect(page.getByTestId('profile-name')).toContainText('Alain');
});

test.skip('should have handle', async ({ page }) => {
  await expect(page.getByTestId('profile-handle')).toContainText('@alainnicolas');
});

test.skip('should have bio', async ({ page }) => {
  await expect(page.getByTestId('profile-bio')).toContainText('');
});

test.skip('should have feed', async ({ page }) => {
  await expect(page.getByTestId('profile-feed')).toBeVisible();
});
