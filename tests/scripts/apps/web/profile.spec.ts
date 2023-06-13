import { expect, test } from '@playwright/test';
import { APP_NAME } from 'data/constants';
import { WEB_BASE_URL } from 'test/constants';

test.describe('Profile', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${WEB_BASE_URL}/u/alainnicolas`);
  });

  test('should have page title', async ({ page }) => {
    await expect(page).toHaveTitle(`Alain (@alainnicolas) • ${APP_NAME}`);
  });

  test.describe('Profile details', async () => {
    test('should have avatar', async ({ page }) => {
      await expect(page.getByTestId('profile-avatar')).toBeVisible();
    });

    test('should have name', async ({ page }) => {
      await expect(page.getByTestId('profile-name')).toContainText('Alain');
    });

    test('should have handle', async ({ page }) => {
      await expect(page.getByTestId('profile-handle')).toContainText('@alainnicolas');
    });

    test('should have bio', async ({ page }) => {
      await expect(page.getByTestId('profile-bio')).toContainText('Fullstack Dev @ ConsenSys');
    });

    test('should have meta id', async ({ page }) => {
      await expect(page.getByTestId('profile-meta-id')).toContainText('3');
    });

    test('should have meta location', async ({ page }) => {
      await expect(page.getByTestId('profile-meta-location')).toContainText('Paris');
    });

    test('should have meta ens', async ({ page }) => {
      await expect(page.getByTestId('profile-meta-ens')).toContainText('alainnicolas.eth');
    });

    test('should have meta Linea ens', async ({ page }) => {
      await expect(page.getByTestId('profile-meta-linea-ens')).toContainText('alain.linea-build.eth');
    });

    test('should have meta website', async ({ page }) => {
      await expect(page.getByTestId('profile-meta-website')).toContainText('alainnicolas.fr');
    });

    test('should have meta twitter', async ({ page }) => {
      await expect(page.getByTestId('profile-meta-twitter')).toContainText('Alain_Ncls');
    });
  });
});

test.describe('Profile verified badge', async () => {
  test('should have verified badge', async ({ page }) => {
    await page.goto(`${WEB_BASE_URL}/u/alainnicolas`);
    const verifiedBadge = page.getByTestId('profile-verified-badge');
    await expect(verifiedBadge).toBeVisible();
  });

  test('should not have verified badge', async ({ page }) => {
    await page.goto(`${WEB_BASE_URL}/u/devlog`);
    const verifiedBadge = page.getByTestId('profile-verified-badge');
    await expect(verifiedBadge).not.toBeVisible();
  });
});

test.describe('Profile followerings', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${WEB_BASE_URL}/u/alainnicolas`);
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
test.describe('Profile badges', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${WEB_BASE_URL}/u/alainnicolas`);
  });

  test('should have ens badge', async ({ page }) => {
    await expect(page.getByTestId('profile-ens-badge')).toBeVisible();
  });

  test.skip('should have poh badge', async ({ page }) => {
    await expect(page.getByTestId('profile-poh-badge')).toBeVisible();
  });

  test.skip('should have sybil badge', async ({ page }) => {
    await expect(page.getByTestId('profile-sybil-badge')).toBeVisible();
  });

  test.skip('should have worldcoin badge', async ({ page }) => {
    await expect(page.getByTestId('profile-worldcoin-badge')).toBeVisible();
  });
});
