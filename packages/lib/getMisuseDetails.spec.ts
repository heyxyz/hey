import { misused } from '@lenster/data/misused';
import { describe, expect, test } from 'vitest';

import getMisuseDetails from './getMisuseDetails';

describe('getMisuseDetails', () => {
  test('should return scam details if found', () => {
    const id = '0x011c4c';
    const result = getMisuseDetails(id);

    expect(result).toEqual(misused[1]);
  });

  test('should return null if scam details are not found', () => {
    const id = '3';
    const result = getMisuseDetails(id);

    expect(result).toBeNull();
  });

  test('should return null if scam details are not provided', () => {
    const id = '2';
    const result = getMisuseDetails(id);

    expect(result).toBeNull();
  });
});
