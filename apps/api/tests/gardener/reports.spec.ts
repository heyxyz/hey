import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('gardener/reports', () => {
  test('should return all gardener reports', async () => {
    const response = await axios.get(`${TEST_URL}/gardener/reports`, {
      headers: await getAuthApiHeadersForTest(),
      params: { id: '0x8c9c-0x12-DA-b1a993ad' }
    });

    expect(response.data.result.id).toEqual('0x8c9c-0x12-DA-b1a993ad');
    expect(response.data.result.both).toBeGreaterThan(0);
  });
});
