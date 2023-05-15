import { expect, test } from '@playwright/test';
import isVerified from 'lib/isVerified';

test.describe('isVerified', () => {
  test('should return true if the ID is included in the verified list', () => {
    expect(isVerified('0x03')).toBeTruthy();
  });

  test('should return false if the ID is not included in the verified list', () => {
    expect(isVerified('unknownID')).toBeFalsy();
  });
});
