import { expect, test } from '@playwright/test';
import { AVATAR } from 'data';
import { APP_NAME, COVER, USER_CONTENT_URL } from 'data/constants';
import { WEB_BASE_URL } from 'test/constants';

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
      `${USER_CONTENT_URL}/${AVATAR}/https://gateway.ipfscdn.io/ipfs/bafybeibzzi2rfxlswibx7jqqahqmzurhnp643ytquvp4llys3urbdfttjq`
    );
  });

  test('should have cover', async ({ page }) => {
    const cover = page.getByTestId('profile-cover');
    const style = await cover.getAttribute('style');

    await expect(style).toContain(
      `${USER_CONTENT_URL}/${COVER}/https://gateway.ipfscdn.io/ipfs/bafybeicm2alelvjwawvv5ubn4g6flbyrrjay5ryxww3ulhnetmdy5ty4re`
    );
  });
});
