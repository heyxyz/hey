import { expect, test } from '@playwright/test';

import { HomePage } from './pages/home.page';

test.describe('Lenster Home page E2E Test', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.open();
    await expect(page).toHaveURL('/');
    await expect(page).toHaveTitle(/Lenster/);
  });

  test('should be able to search user', async ({ page }) => {
    let keyword = 'test';
    await homePage.search(keyword);
    await expect(page).toHaveURL(`/search?q=${keyword}&type=profiles`);
  });
});
