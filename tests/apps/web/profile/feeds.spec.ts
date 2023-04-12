import { expect, test } from '@playwright/test';
import { WEB_BASE_URL } from 'test/constants';

test.describe('Profile feeds', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${WEB_BASE_URL}/u/yoginth`);
  });

  test('should have main feed', async ({ page }) => {
    const feed = page.getByTestId('profile-feed-type-feed');
    await expect(feed).toBeVisible();
  });

  test('should have replies feed', async ({ page }) => {
    const repliesTab = page.getByTestId('tab-button-replies');
    await repliesTab.click();

    const feed = page.getByTestId('profile-feed-type-replies');
    await expect(feed).toBeVisible();
  });

  test('should have media feed', async ({ page }) => {
    const mediaTab = page.getByTestId('tab-button-media');
    await mediaTab.click();

    const feed = page.getByTestId('profile-feed-type-media');
    await expect(feed).toBeVisible();
  });

  test('should have collected feed', async ({ page }) => {
    const collectedTab = page.getByTestId('tab-button-collected');
    await collectedTab.click();

    const feed = page.getByTestId('profile-feed-type-collects');
    await expect(feed).toBeVisible();
  });
});
