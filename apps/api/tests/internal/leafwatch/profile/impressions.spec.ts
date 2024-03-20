import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('internal/leafwatch/profile/impressions', () => {
  test('should return profile impressions', async () => {
    const response = await axios.get(
      `${TEST_URL}/internal/leafwatch/profile/impressions`,
      { params: { id: '0x05' } }
    );

    expect(response.data.totalImpressions).greaterThan(0);
    expect(response.data.yearlyImpressions).toBeInstanceOf(Array);
  });

  test('should not return profile impressions', async () => {
    const response = await axios.get(
      `${TEST_URL}/internal/leafwatch/profile/impressions`,
      { params: { id: '0x00' } }
    );

    expect(response.data.totalImpressions).toBeNull();
    expect(response.data.yearlyImpressions).toHaveLength(0);
  });
});
