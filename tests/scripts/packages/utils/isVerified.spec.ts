import { expect, test } from '@playwright/test';
import isVerified from 'utils/isVerified';

test.describe('isVerified', async () => {
  test('should return true if the ID is included in the verified list', async () => {
    await expect(isVerified('0x0d')).toBe(true);
  });

  test('should return false if the ID is not included in the verified list', async () => {
    await expect(isVerified('unknownID')).toBe(false);
  });
});
