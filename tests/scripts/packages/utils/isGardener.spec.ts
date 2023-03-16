import { expect, test } from '@playwright/test';
import isGardener from 'utils/isGardener';

test.describe('isGardener', async () => {
  test('should return true if the ID is included in the gardener list', async () => {
    await expect(isGardener('0x0d')).toBe(true);
  });

  test('should return false if the ID is not included in the gardener list', async () => {
    await expect(isGardener('unknownID')).toBe(false);
  });
});
