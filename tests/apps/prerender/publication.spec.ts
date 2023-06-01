import { APP_NAME } from '@lenster/data/constants';
import { expect, test } from '@playwright/test';
import { PRERENDER_BASE_URL } from 'test/constants';

test.beforeEach(async ({ page }) => {
  await page.goto(`${PRERENDER_BASE_URL}/posts/0x0d-0x01`);
});

test('should have page title', async ({ page }) => {
  await expect(page).toHaveTitle(`Post by @yoginth.lens • ${APP_NAME}`);
});

test('should have publication', async ({ page }) => {
  await expect(page.getByTestId('publication-0x0d-0x01')).toContainText(
    'gm frens 👋'
  );
});

test('should have comment feed', async ({ page }) => {
  await expect(page.getByTestId('comment-feed')).toBeVisible();
});
