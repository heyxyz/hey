import { expect, test } from '@playwright/test';
import { APP_NAME } from 'data/constants';
import { WEB_BASE_URL } from 'test/constants';

test.beforeEach(async ({ page }) => {
  await page.goto(`${WEB_BASE_URL}/explore`);
});

test('should have page title', async ({ page }) => {
  await expect(page).toHaveTitle(`Explore • ${APP_NAME}`);
});

test.skip('should have explore feed', async ({ page }) => {
  const selectedTab = page.getByTestId(`explore-tab-1`);
  await selectedTab.click();
  await expect(page.getByTestId('explore-feed')).toBeVisible();
});

test('should have explore feed tab', async ({ page }) => {
  for (let i = 0; i < 3; i++) {
    const selectedTab = page.getByTestId(`explore-tab-${i}`);
    await selectedTab.click();
    await expect(selectedTab).toHaveAttribute('aria-selected', 'true');
  }
});

test('should have explore feed type', async ({ page }) => {
  for (const feedType of ['all_posts', 'text_only', 'video', 'audio', 'image']) {
    const selectedFeedType = page.getByTestId(`feed-type-${feedType}`);
    await selectedFeedType.click();
    await expect(selectedFeedType).toHaveAttribute('aria-selected', 'true');
  }
});
