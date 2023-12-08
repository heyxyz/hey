import { describe, expect, test } from 'vitest';

import getUnlonelyNfc from './getUnlonelyNfc';

describe('getUnlonelyNfc', () => {
  test('should return unlonely nfc', () => {
    expect(getUnlonelyNfc('https://www.unlonely.app/nfc/50')).contains({
      id: '50'
    });
  });

  test('should return null if no unlonely nfc id is found', () => {
    expect(getUnlonelyNfc('https://www.unlonely.app/nfc/')).toBeNull();
  });
});
