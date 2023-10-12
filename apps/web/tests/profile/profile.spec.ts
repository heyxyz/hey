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
      `${LENS_MEDIA_SNAPSHOT_URL}/${AVATAR}/9caf74be27cca70afabf170375626878e534d5266494a78462dac479a39ccf48.png`
    );
  });

  test('should have cover', async ({ page }) => {
    const cover = page.getByTestId('profile-cover');
    const style = await cover.getAttribute('style');

    await expect(style).toContain(
      `${LENS_MEDIA_SNAPSHOT_URL}/${COVER}/ed9609fb7d07a0b4d2515f9f06ba81bbaaf0cde484886295b50128555bb948b0.jpg`
    );
  });
});
