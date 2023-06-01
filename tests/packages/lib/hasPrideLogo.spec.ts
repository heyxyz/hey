import type { Profile } from '@lenster/lens';
import { expect, test } from '@playwright/test';
import hasPrideLogo from 'lib/hasPrideLogo';

test.describe('hasPrideLogo', () => {
  test('should return true if profile has pride logo attribute set as true', () => {
    const profileWithPrideLogo = {
      attributes: [{ key: 'hasPrideLogo', value: 'true' }]
    };
    expect(hasPrideLogo(profileWithPrideLogo as Profile)).toBeTruthy();
  });

  test('should return false if profile does not have pride logo attribute', () => {
    const profileWithoutPrideLogo = { attributes: [{}] };
    expect(hasPrideLogo(profileWithoutPrideLogo as Profile)).toBeFalsy();
  });

  test('should return false if profile has pride logo attribute set as false', () => {
    const profileWithFalsePrideLogo = {
      attributes: [{ key: 'hasPrideLogo', value: 'false' }]
    };
    expect(hasPrideLogo(profileWithFalsePrideLogo as Profile)).toBeFalsy();
  });
});
