import { expect, test } from '@playwright/test';
import getFollowModule from 'utils/getFollowModule';

test.describe('getFollowModule', async () => {
  test('should return correct module for ProfileFollowModuleSettings', async () => {
    const result = getFollowModule('ProfileFollowModuleSettings');
    await expect(result.description).toEqual('Only Lens profiles can follow');
  });

  test('should return correct module for FeeFollowModuleSettings', async () => {
    const result = getFollowModule('FeeFollowModuleSettings');
    await expect(result.description).toEqual('Charge to follow');
  });

  test('should return correct module for RevertFollowModuleSettings', async () => {
    const result = getFollowModule('RevertFollowModuleSettings');
    await expect(result.description).toEqual('No one can follow');
  });

  test('should return correct default module when name is undefined', async () => {
    const result = getFollowModule();
    await expect(result.description).toEqual('Anyone can follow');
  });

  test('should return correct default module when name does not match known modules', async () => {
    const result = getFollowModule('InvalidModuleName');
    await expect(result.description).toEqual('Anyone can follow');
  });
});
