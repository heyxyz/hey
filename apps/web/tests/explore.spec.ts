import { expect, test } from '@playwright/test';
import { APP_NAME } from 'data/constants';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4783/explore');
});

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle(`Explore • ${APP_NAME}`);
});

test('has explore feed', async ({ page }) => {
  await expect(page.getByTestId('explore-feed')).toBeVisible();
});
