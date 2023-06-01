import { APP_NAME } from '@lenster/data/constants';
import { expect, test } from '@playwright/test';
import { WEB_BASE_URL } from 'test/constants';

// Check footer is present
test('should have footer', async ({ page }) => {
  await page.goto(WEB_BASE_URL);
  await expect(page.getByTestId('footer')).toContainText(
    `© ${new Date().getFullYear()} ${APP_NAME}`
  );
});

// Check locale selector is present
test('should have locale selector', async ({ page }) => {
  await page.goto(WEB_BASE_URL);
  const localeSelector = page.getByTestId('locale-selector');
  await expect(localeSelector).toContainText('English');

  // click locale selector and expect locale dropdown to be visible and contain Chinese
  await localeSelector.click();
  const localeSelectorMenu = page.getByTestId('locale-selector-menu');
  await expect(localeSelectorMenu).toContainText('Chinese');
});
