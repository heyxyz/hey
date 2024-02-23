import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('gardener/reports', () => {
  test('should return all gardener reports', async () => {
    const response = await axios.get(`${TEST_URL}/gardener/reports`, {
      headers: await getAuthApiHeadersForTest(),
      params: { id: '0x4cb1-0x39' }
    });

    expect(response.data.result.id).toEqual('0x4cb1-0x39');
    expect(response.data.result.both).toBeGreaterThan(0);
  });
});
