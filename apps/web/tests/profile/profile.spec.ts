import {
  APP_NAME,
  AVATAR,
  COVER,
  LENS_MEDIA_SNAPSHOT_URL
} from '@lenster/data/constants';
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
      `${LENS_MEDIA_SNAPSHOT_URL}/${AVATAR}/9ab05cc018d5976f8454278742fca49e77ffd86bdaee7bb30644ad842c9b8381.png`
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
