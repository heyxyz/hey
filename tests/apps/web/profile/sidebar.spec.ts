import { expect, test } from '@playwright/test';
import { WEB_BASE_URL } from 'test/constants';

test.describe('Profile sidebar', () => {
  test.describe('Profile details', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${WEB_BASE_URL}/u/yoginth`);
    });

    test('should have name', async ({ page }) => {
      await expect(page.getByTestId('profile-name')).toContainText('Yoginth');
    });

    test('should have handle', async ({ page }) => {
      await expect(page.getByTestId('profile-handle')).toContainText('@yoginth');
    });

    test('should have bio', async ({ page }) => {
      await expect(page.getByTestId('profile-bio')).toContainText('opinions are mine');
    });

    test('should have meta id', async ({ page }) => {
      await expect(page.getByTestId('profile-meta-id')).toContainText('13');
    });

    test('should have meta location', async ({ page }) => {
      await expect(page.getByTestId('profile-meta-location')).toContainText('India');
    });
  });

  test.describe('Profile links', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${WEB_BASE_URL}/u/yoginth`);
    });

    test('should have meta ens', async ({ page }) => {
      await expect(page.getByTestId('profile-meta-ens')).toContainText('yoginth.eth');
    });

    test('should have meta website', async ({ page }) => {
      await expect(page.getByTestId('profile-meta-website')).toContainText('nf.td/yogi');
    });

    test('should have meta twitter', async ({ page }) => {
      await expect(page.getByTestId('profile-meta-twitter')).toContainText('yogicodes');
    });
  });

  test.describe('Profile verified badge', () => {
    test('should have verified badge', async ({ page }) => {
      await page.goto(`${WEB_BASE_URL}/u/yoginth`);
      const verifiedBadge = page.getByTestId('profile-verified-badge');
      await expect(verifiedBadge).toBeVisible();
    });

    test('should not have verified badge', async ({ page }) => {
      await page.goto(`${WEB_BASE_URL}/u/devlog`);
      const verifiedBadge = page.getByTestId('profile-verified-badge');
      await expect(verifiedBadge).not.toBeVisible();
    });
  });

  test.describe('Profile followerings', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${WEB_BASE_URL}/u/yoginth`);
    });

    test('should have followers', async ({ page }) => {
      const profileFollowers = page.getByTestId('profile-followers');
      await expect(profileFollowers).toContainText('Followers');

      // click on followers and check if it opens followers modal
      await profileFollowers.click();
      const followersModal = page.getByTestId('followers-modal');
      await expect(followersModal).toBeVisible();
    });

    test('should have followings', async ({ page }) => {
      const profileFollowings = page.getByTestId('profile-followings');
      await expect(profileFollowings).toContainText('Following');

      // click on followings and check if it opens followings modal
      await profileFollowings.click();
      const followingsModal = page.getByTestId('followings-modal');
      await expect(followingsModal).toBeVisible();
    });
  });

  // test for badges
  test.describe('Profile badges', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${WEB_BASE_URL}/u/yoginth`);
    });

    test('should have ens badge', async ({ page }) => {
      await expect(page.getByTestId('profile-ens-badge')).toBeVisible();
    });

    test('should have poh badge', async ({ page }) => {
      await expect(page.getByTestId('profile-poh-badge')).toBeVisible();
    });

    test('should have sybil badge', async ({ page }) => {
      await expect(page.getByTestId('profile-sybil-badge')).toBeVisible();
    });

    test('should have worldcoin badge', async ({ page }) => {
      await expect(page.getByTestId('profile-worldcoin-badge')).toBeVisible();
    });
  });
});
