import { expect, test } from '@playwright/test';
import { FeatureFlag } from 'data/feature-flags';
import isFeatureEnabled from 'lib/isFeatureEnabled';

test.describe('isFeatureEnabled', () => {
  test('should return false if profile id not exists in feature flag enabled array', () => {
    const output = isFeatureEnabled(FeatureFlag.GatedLocales, '0x123');
    expect(output).toEqual(false);
  });

  test('should return true if profile id exists in feature flag enabled array', () => {
    const output = isFeatureEnabled(FeatureFlag.GatedLocales, '0x0d');
    expect(output).toEqual(true);
  });

  test('should return false if feature not found', () => {
    const output = isFeatureEnabled('feature3', '0x0d');
    expect(output).toEqual(false);
  });
});
