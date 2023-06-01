import isStaff from '@lenster/lib/isStaff';
import { expect, test } from '@playwright/test';

test.describe('isStaff', () => {
  test('should return true if the ID is included in the staff list', () => {
    expect(isStaff('0x0d')).toBeTruthy();
  });

  test('should return false if the ID is not included in the staff list', () => {
    expect(isStaff('unknownID')).toBeFalsy();
  });
});
