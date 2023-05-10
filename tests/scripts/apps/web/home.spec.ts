import { expect, test } from '@playwright/test';
import { APP_NAME } from 'data/constants';
import { WEB_BASE_URL } from 'test/constants';

test.beforeEach(async ({ page }) => {
  await page.goto(WEB_BASE_URL);
});

test('should have page title', async ({ page }) => {
  await expect(page).toHaveTitle(APP_NAME);
});

test('should have hero', async ({ page }) => {
  await expect(page.getByTestId('home-hero')).toContainText(
    'Welcome to Lineaster 👋Lineaster is a decentralized, and permissionless social media app built with Lens Protocol 🌿'
  );
});

test.skip('should have explore feed', async ({ page }) => {
  await expect(page.getByTestId('explore-feed')).toBeVisible();
});
