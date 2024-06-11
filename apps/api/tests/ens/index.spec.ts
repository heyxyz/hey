import axios from 'axios';
import { TEST_URL } from 'src/helpers/constants';
import { describe, expect, test } from 'vitest';

describe('ens/index', () => {
  test('should return ens names', async () => {
    const response = await axios.post(`${TEST_URL}/ens`, {
      addresses: [
        '0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF',
        '0x01d79BcEaEaaDfb8fD2F2f53005289CFcF483464',
        '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
      ]
    });

    expect(response.data.result).toEqual([
      'yoginth.eth',
      'sasi.eth',
      'vitalik.eth'
    ]);
  });
});
