import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('stats/profileImpressions', () => {
  test('should return profile impressions', async () => {
    const response = await axios.get(`${TEST_URL}/stats/profileImpressions`, {
      params: { id: '0x05' }
    });

    expect(response.data.totalImpressions).greaterThan(0);
    expect(response.data.yearlyImpressions).toBeInstanceOf(Array);
  });

  test('should not return profile impressions', async () => {
    const response = await axios.get(`${TEST_URL}/stats/profileImpressions`, {
      params: { id: '0x00' }
    });

    expect(response.data.totalImpressions).toBeNull();
    expect(response.data.yearlyImpressions).toHaveLength(0);
  });
});
