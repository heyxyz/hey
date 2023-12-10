import { describe, expect, test } from 'vitest';

import getUnlonelyChannel from './getUnlonelyChannel';

describe('getUnlonelyChannel', () => {
  test('should return unlonely channel', () => {
    expect(
      getUnlonelyChannel('https://www.unlonely.app/channels/hey')
    ).contains({ slug: 'hey' });
  });

  test('should return null if no unlonely channel slug is found', () => {
    expect(getUnlonelyChannel('https://www.unlonely.app/channels/')).toBeNull();
  });
});
