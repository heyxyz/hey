import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('pro/get', () => {
  test('should return pro details', async () => {
    const response = await axios.get(`${TEST_URL}/pro/get`, {
      params: { id: '0x05' }
    });

    expect(response.data.result.isPro).toBeTruthy();
    expect(response.data.result.expiresAt).toEqual('2027-05-16T11:56:00.000Z');
    expect(response.data.success).toBeTruthy();
  });
});
