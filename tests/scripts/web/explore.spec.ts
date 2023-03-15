import { expect, test } from '@playwright/test';
import { APP_NAME } from 'data/constants';

import { BASE_URL } from '../../constants';

test.beforeEach(async ({ page }) => {
  await page.goto(`${BASE_URL}/explore`);
});

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle(`Explore • ${APP_NAME}`);
});

test('has explore feed', async ({ page }) => {
  await expect(page.getByTestId('explore-feed')).toBeVisible();
});

test('explore feed tab', async ({ page }) => {
  for (let i = 0; i < 3; i++) {
    const selectedTab = page.getByTestId(`explore-tab-${i}`);
    await selectedTab.click();
    await expect(selectedTab).toHaveAttribute('aria-selected', 'true');
  }
});

test('explore feed type', async ({ page }) => {
  for (const feedType of ['all_posts', 'text_only', 'video', 'audio', 'image']) {
    const selectedFeedType = page.getByTestId(`feed-type-${feedType}`);
    await selectedFeedType.click();
    await expect(selectedFeedType).toHaveAttribute('aria-selected', 'true');
  }
});
