import { expect, test } from '@playwright/test';
import { WEB_BASE_URL } from 'test/constants';

test.describe('Publication sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${WEB_BASE_URL}/posts/0x0d-0x037d`);
  });

  test('should have og poster profile', async ({ page }) => {
    const posterProfile = page.getByTestId('poster-profile');
    await expect(posterProfile).toContainText('@yoginth');
  });

  test('should have relevant profiles', async ({ page }) => {
    const relevantProfiles = page.getByTestId('relevant-profiles');
    await expect(relevantProfiles).toContainText('@lenster');
    await expect(relevantProfiles).toContainText('@sagargowda');
  });

  test('should have on chain meta', async ({ page }) => {
    const onChainMeta = page.getByTestId('onchain-meta');
    // Arweave transaction
    await expect(onChainMeta).toContainText(
      't0zAPjaeoh3M1TZQV0ZcbSCw_Q0wlQE4LgJuKnO1HLE'
    );
    // NFT address
    await expect(onChainMeta).toContainText(
      '0x89e19Acb4ac03FDf6a09dc299961F51059195612'
    );
  });
});
