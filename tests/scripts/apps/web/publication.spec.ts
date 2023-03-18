import { expect, test } from '@playwright/test';
import { APP_NAME } from 'data/constants';
import { WEB_BASE_URL } from 'test/constants';

test.describe('Publication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${WEB_BASE_URL}/posts/0x0d-0x01`);
  });

  test('should have publication', async ({ page }) => {
    const publication = page.getByTestId('publication-0x0d-0x01');
    await expect(publication).toBeVisible();
  });

  test.describe('Publication header', async () => {
    test('should have profile', async ({ page }) => {
      const publication = page.getByTestId('publication-0x0d-0x01');
      await expect(publication).toContainText('@yoginth');
    });

    test('should have menu', async ({ page }) => {
      const publicationMenu = page.getByTestId('publication-0x0d-0x01-menu');
      await publicationMenu.click();
      const localeSelectorMenuItems = page.getByTestId('publication-0x0d-0x01-menu-items');
      await expect(localeSelectorMenuItems).toContainText('Report Post');
      await expect(localeSelectorMenuItems).toContainText('Embed');
      await expect(localeSelectorMenuItems).toContainText('Permalink');
    });
  });

  test.describe('Publication body', async () => {
    test('should have body', async ({ page }) => {
      const publication = page.getByTestId('publication-0x0d-0x01');
      await expect(publication).toContainText('gm frens 👋');
    });
  });

  test.describe('Publication meta', async () => {
    test('should have meta', async ({ page }) => {
      const publication = page.getByTestId('publication-0x0d-0x01');
      await expect(publication).toContainText('Posted via Lenster');
      await expect(publication).toContainText('May 18, 2022');
    });
  });
});

test.describe('Post', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${WEB_BASE_URL}/posts/0x0d-0x01`);
  });

  test('should have post title', async ({ page }) => {
    await expect(page).toHaveTitle(`Post by @yoginth • ${APP_NAME}`);
  });
});

test.describe('Comment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${WEB_BASE_URL}/posts/0x0d-0x037a`);
  });

  test('should have comment title', async ({ page }) => {
    await expect(page).toHaveTitle(`Comment by @yoginth • ${APP_NAME}`);
  });
});
