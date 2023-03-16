import { expect, test } from '@playwright/test';
import { APP_NAME } from 'data/constants';
import { PRERENDER_BASE_URL } from 'test/constants';

test.beforeEach(async ({ page }) => {
  await page.goto(`${PRERENDER_BASE_URL}/posts/0x0d-0x01`);
});

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle(`Post by @yoginth.lens • ${APP_NAME}`);
});
