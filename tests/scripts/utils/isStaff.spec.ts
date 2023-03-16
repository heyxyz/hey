import { expect, test } from '@playwright/test';
import isStaff from 'utils/isStaff';

test.describe('isStaff', async () => {
  test('should return true if the ID is included in the staff list', async () => {
    await expect(isStaff('0x0d')).toBe(true);
  });

  test('should return false if the ID is not included in the staff list', async () => {
    await expect(isStaff('unknownID')).toBe(false);
  });
});
