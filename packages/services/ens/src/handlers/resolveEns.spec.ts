import { describe, expect, test } from 'vitest';

import { TEST_URL } from '../constants';

describe('resolveEns', () => {
  test('should return ok for health', async () => {
    const getRequest = await fetch(`${TEST_URL}/health`);
    const response = await getRequest.text();

    expect(response).toContain('OK');
  });

  test('should return resolved address', async () => {
    const postRequest = await fetch(TEST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        addresses: [
          '0x03ba34f6ea1496fa316873cf8350a3f7ead317ef',
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
