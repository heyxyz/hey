import { describe, expect, test } from 'vitest';

import hasOwnedLensProfiles from './hasOwnedLensProfiles';

describe('hasOwnedLensProfiles', () => {
  test('should return true if the ID has a lens profile', async () => {
    expect(
      await hasOwnedLensProfiles(
        '0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3',
        '0x0d',
        true
      )
    ).toBeTruthy();
  });

  test('should return false if the ID is not has a lens profile', async () => {
    expect(
      await hasOwnedLensProfiles(
        '0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3',
        '0x05',
        true
      )
    ).toBeFalsy();
  });
});
