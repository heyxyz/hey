import { expect, test } from '@playwright/test';
import { APP_NAME } from 'data/constants';

import { BASE_URL } from '../../constants';

test.beforeEach(async ({ page }) => {
  await page.goto(`${BASE_URL}/u/yoginth`);
});

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle(`Yoginth (@yoginth) • ${APP_NAME}`);
});
