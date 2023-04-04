import { expect, test } from '@playwright/test';
import isStaff from 'lib/isStaff';

test.describe('isStaff', () => {
  test('should return true if the ID is included in the staff list', () => {
    expect(isStaff('0x0d')).toBe(true);
  });

  test('should return false if the ID is not included in the staff list', () => {
    expect(isStaff('unknownID')).toBe(false);
  });
});
