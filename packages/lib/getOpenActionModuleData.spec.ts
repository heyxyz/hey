import { OpenActionModuleType } from '@hey/lens';
import { describe, expect, test } from 'vitest';

import getOpenActionModuleData from './getOpenActionModuleData';

describe('getOpenActionModuleData', () => {
  test('should return the correct data for SimpleCollectOpenActionModule', () => {
    const module: any = {
      type: OpenActionModuleType.SimpleCollectOpenActionModule
    };
    const result = getOpenActionModuleData(module);
    expect(result).toEqual({ name: 'Simple Collect' });
  });

  test('should return the correct data for MultirecipientFeeCollectOpenActionModule', () => {
    const module: any = {
      type: OpenActionModuleType.MultirecipientFeeCollectOpenActionModule
    };
    const result = getOpenActionModuleData(module);
    expect(result).toEqual({ name: 'Multirecipient Fee Collect' });
  });

  test('should return the correct data for unknown modules', () => {
    const module = undefined;
    const result = getOpenActionModuleData(module);
    expect(result).toEqual({ name: 'Unknown Module' });
  });
});
