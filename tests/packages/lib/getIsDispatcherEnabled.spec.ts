import { expect, test } from '@playwright/test';
import { OLD_LENS_RELAYER_ADDRESS } from '@lenster/data';
import getIsDispatcherEnabled from 'lib/getIsDispatcherEnabled';

test.describe('getIsDispatcherEnabled', () => {
  test('returns false when profile is null', () => {
    expect(getIsDispatcherEnabled(null)).toBeFalsy();
  });

  test('returns false when profile does not have relay enabled', () => {
    const profileWithoutRelay: any = {
      dispatcher: { canUseRelay: false, address: null }
    };

    expect(getIsDispatcherEnabled(profileWithoutRelay)).toBeFalsy();
  });

  test('returns true when profile has relay enabled and a different relayer address', () => {
    const profileWithRelay: any = {
      dispatcher: {
        canUseRelay: true,
        address: '0x1234567890123456789012345678901234567890'
      }
    };

    expect(getIsDispatcherEnabled(profileWithRelay)).toBeTruthy();
  });

  test('returns false when profile has relay enabled but an old relayer address', () => {
    const profileWithOldRelayer: any = {
      dispatcher: { canUseRelay: true, address: OLD_LENS_RELAYER_ADDRESS }
    };

    expect(getIsDispatcherEnabled(profileWithOldRelayer)).toBeFalsy();
  });
});
