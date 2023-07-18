import { scam } from '@lenster/data/scam';
import { describe, expect, test } from 'vitest';

import getScamDetails from './getScamDetails';

describe('getScamDetails', () => {
  test('should return scam details if found', () => {
    const id = '0x011c4c';
    const result = getScamDetails(id);

    expect(result).toEqual(scam[1]);
  });

  test('should return null if scam details are not found', () => {
    const id = '3';
    const result = getScamDetails(id);

    expect(result).toBeNull();
  });

  test('should return null if scam details are not provided', () => {
    const id = '2';
    const result = getScamDetails(id);

    expect(result).toBeNull();
  });
});
