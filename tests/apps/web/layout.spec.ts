import { expect, test } from '@playwright/test';
import { WEB_BASE_URL } from 'test/constants';

test.beforeEach(async ({ page }) => {
  await page.goto(WEB_BASE_URL);
});

test('should have global search', async ({ page }) => {
  const globalSearch = page.getByTestId('global-search');
  await expect(globalSearch).toBeVisible();

  const input = globalSearch.getByPlaceholder('Search…');
  await input.fill('yoginth');

  const searchProfilesDropdown = page.getByTestId('search-profiles-dropdown');
  await expect(
    searchProfilesDropdown.getByTestId('search-profile-yoginth')
  ).toContainText('Yoginth');
});

test('should have login button', async ({ page }) => {
  const loginButton = page.getByTestId('login-button');
  await expect(loginButton).toContainText('Login');

  // click login button and expect login modal to be visible
  await loginButton.click();
  const loginModal = page.getByTestId('login-modal');
  await expect(loginModal).toBeVisible();
  await expect(loginModal).toContainText('Connect your wallet.');
});

test.describe('navigation items', () => {
  test('should have home menu', async ({ page }) => {
    const navItemHome = page.getByTestId('nav-item-home');
    await expect(navItemHome).toContainText('Home');
  });

  test('should have explore menu', async ({ page }) => {
    const navItemExplore = page.getByTestId('nav-item-explore');
    await expect(navItemExplore).toContainText('Explore');
  });

  test('should have more menu', async ({ page }) => {
    const navItemMore = page.getByTestId('nav-item-more');
    await navItemMore.click();

    // click more nav item and expect more nav items to be visible
    const moreItemMoreDropdown = page.getByTestId('nav-item-more-dropdown');
    await expect(moreItemMoreDropdown).toContainText('Contact');
    await expect(moreItemMoreDropdown).toContainText('Report a bug');
  });
});
