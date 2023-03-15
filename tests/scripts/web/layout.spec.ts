import { expect, test } from '@playwright/test';

import { BASE_URL } from '../../constants';

test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
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

test.describe('navigation items', () => {
  test('home', async ({ page }) => {
    const navItemHome = page.getByTestId('nav-item-home');
    await navItemHome.click();
    await page.waitForLoadState('networkidle');
    await expect(page.url()).toBe(`${BASE_URL}/`);
  });

  test('explore', async ({ page }) => {
    const navItemExplore = page.getByTestId('nav-item-explore');
    await navItemExplore.click();
    await page.waitForLoadState('networkidle');
    await expect(page.url()).toBe(`${BASE_URL}/explore`);
  });

  test('more', async ({ page }) => {
    const navItemMore = page.getByTestId('nav-item-more');
    await navItemMore.click();

    // click more nav item and expect more nav items to be visible
    const moreItemMoreDropdown = page.getByTestId('nav-item-more-dropdown');
    await expect(moreItemMoreDropdown).toContainText('Contact');
    await expect(moreItemMoreDropdown).toContainText('Report a bug');
  });
});
