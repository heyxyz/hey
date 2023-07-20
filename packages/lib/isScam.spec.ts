import { describe, expect, test } from 'vitest';

import isScam from './isScam';

describe('isScam', () => {
  test('should return true if the ID is included in the scam list', () => {
    expect(isScam('0x011c4c')).toBeTruthy();
  });

  test('should return false if the ID is not included in the scam list', () => {
    expect(isScam('unknownID')).toBeFalsy();
  });
});
