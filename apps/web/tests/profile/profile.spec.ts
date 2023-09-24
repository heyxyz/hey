import {
  APP_NAME,
  AVATAR,
  COVER,
  LENS_MEDIA_SNAPSHOT_URL
} from '@hey/data/constants';
import { expect, test } from '@playwright/test';
import { WEB_BASE_URL } from 'tests/constants';

test.describe('Profile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${WEB_BASE_URL}/u/yoginth`);
  });

  test('should have page title', async ({ page }) => {
    await expect(page).toHaveTitle(`Yoginth (@yoginth) • ${APP_NAME}`);
  });

  test('should have avatar', async ({ page }) => {
    const avatar = page.getByTestId('profile-avatar');

    await expect(avatar).toHaveAttribute(
      'src',
      `${LENS_MEDIA_SNAPSHOT_URL}/${AVATAR}/7ba81615d40f3421e3ef3ee510afee6a6e8c26a9d0e6c2bee924436b04b6b295.png`
    );
  });

  test('should have cover', async ({ page }) => {
    const cover = page.getByTestId('profile-cover');
    const style = await cover.getAttribute('style');

    await expect(style).toContain(
      `${LENS_MEDIA_SNAPSHOT_URL}/${COVER}/344d357eeca656d8c075a31dff8d2fc635aa8ff9c75c055764e79670e3a93e36.jpg`
    );
  });
});
