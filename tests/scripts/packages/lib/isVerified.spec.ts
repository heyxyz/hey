import { expect, test } from '@playwright/test';
import isVerified from 'lib/isVerified';

test.describe('isVerified', () => {
  test('should return true if the ID is included in the verified list', () => {
    expect(isVerified('0x0d')).toBe(true);
  });

  test('should return false if the ID is not included in the verified list', () => {
    expect(isVerified('unknownID')).toBe(false);
  });
});
