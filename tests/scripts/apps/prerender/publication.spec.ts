import { expect, test } from '@playwright/test';
import { APP_NAME } from 'data/constants';
import { PRERENDER_BASE_URL } from 'test/constants';

test.beforeEach(async ({ page }) => {
  await page.goto(`${PRERENDER_BASE_URL}/posts/0x03-0x16`);
});

test.skip('should have page title', async ({ page }) => {
  await expect(page).toHaveTitle(`Post by @yoginth.lens • ${APP_NAME}`);
});

test.skip('should have publication', async ({ page }) => {
  await expect(page.getByTestId('publication-0x03-0x16')).toContainText('gm frens 👋');
});

test.skip('should have comment feed', async ({ page }) => {
  await expect(page.getByTestId('comment-feed')).toBeVisible();
});
