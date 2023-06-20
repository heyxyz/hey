import { describe, expect, test } from 'vitest';

import getFollowModule from './getFollowModule';

describe('getFollowModule', () => {
  test('should return correct module for ProfileFollowModuleSettings', () => {
    const result = getFollowModule('ProfileFollowModuleSettings');
    expect(result.description).toEqual('Only Lens profiles can follow');
  });

  test('should return correct module for FeeFollowModuleSettings', () => {
    const result = getFollowModule('FeeFollowModuleSettings');
    expect(result.description).toEqual('Charge to follow');
  });

  test('should return correct module for RevertFollowModuleSettings', () => {
    const result = getFollowModule('RevertFollowModuleSettings');
    expect(result.description).toEqual('No one can follow');
  });

  test('should return correct default module when name is undefined', () => {
    const result = getFollowModule();
    expect(result.description).toEqual('Anyone can follow');
  });

  test('should return correct default module when name does not match known modules', () => {
    const result = getFollowModule('InvalidModuleName');
    expect(result.description).toEqual('Anyone can follow');
  });
});
