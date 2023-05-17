import { expect, test } from '@playwright/test';
import isGardener from 'lib/isGardener';

test.describe('isGardener', () => {
  test('should return true if the ID is included in the gardener list', () => {
    expect(isGardener('0x0d')).toBeTruthy();
  });

  test('should return false if the ID is not included in the gardener list', () => {
    expect(isGardener('unknownID')).toBeFalsy();
  });
});
