import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('score/get', () => {
  test('should return ens names', async () => {
    const response = await axios.get(`${TEST_URL}/score/get`, {
      headers: { 'x-lens-network': 'testnet' },
      params: { address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' }
    });

    expect(response.data.result).toEqual(100);
  });
});
