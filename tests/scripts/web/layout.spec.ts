import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4783');
});

test('global search', async ({ page }) => {
  const globalSearch = page.getByTestId('global-search');
  await expect(globalSearch).toBeVisible();

  const input = globalSearch.getByPlaceholder('Search…');
  await input.fill('yoginth');

  const searchProfilesDropdown = page.getByTestId('search-profiles-dropdown');
  await expect(searchProfilesDropdown.getByTestId('search-profile-yoginth')).toContainText('Yoginth');
});

test('login button', async ({ page }) => {
  const loginButton = page.getByTestId('login-button');
  await expect(loginButton).toContainText('Login');

  // click login button and expect login modal to be visible
  await loginButton.click();
  const loginModal = page.getByTestId('login-modal');
  await expect(loginModal).toBeVisible();
  await expect(loginModal).toContainText('Connect your wallet.');
});
