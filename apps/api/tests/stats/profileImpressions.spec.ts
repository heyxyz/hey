import { TEST_ENDPOINT } from '@utils/constants';
import axios from 'axios';
import urlcat from 'urlcat';
import { describe, expect, test } from 'vitest';

describe('stats/profileImpressions', () => {
  test('should return profile impressions stats', async () => {
    const { data } = await axios.get(
      urlcat(TEST_ENDPOINT, '/stats/profileImpressions', {
        id: '0x0d',
        handle: 'yoginth'
      })
    );
    expect(data.totalImpressions).toBeGreaterThan(1000);
  });
});
