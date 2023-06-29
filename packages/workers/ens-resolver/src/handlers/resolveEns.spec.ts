import { describe, expect, test } from 'vitest';

import { TEST_URL } from '../constants';

describe('resolveEns', () => {
  test('should return welcome message', async () => {
    const getRequest = await fetch(TEST_URL);
    const response = await getRequest.text();

    expect(response).toContain('gm, ens resolver service 👋');
  });

  test('should return resolved address', async () => {
    const postRequest = await fetch(TEST_URL, {
      method: 'POST',
      body: JSON.stringify({
        addresses: [
          '0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3',
          '0x01d79BcEaEaaDfb8fD2F2f53005289CFcF483464',
          '0x82aae03e76290a4aed2c63ed7740ab5ef7c07b66',
          '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
        ]
      })
    });
    const response = await postRequest.json();

    expect(response).toEqual({
      success: true,
      data: ['yoginth.eth', 'sasi.eth', '', 'vitalik.eth']
    });
  });
});
