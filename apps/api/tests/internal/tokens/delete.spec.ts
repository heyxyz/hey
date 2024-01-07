import getAuthWorkerHeadersForTest from '@hey/lib/getAuthWorkerHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

const generateRandomEthereumAddress = () => {
  let address = '0x';
  const characters = '0123456789abcdef';
  for (let i = 0; i < 40; i++) {
    address += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return address;
};

describe('internal/tokens/delete', async () => {
  test('should delete a token', async () => {
    const newTokenResponse = await axios.post(
      `${TEST_URL}/internal/tokens/create`,
      {
        contractAddress: generateRandomEthereumAddress(),
        decimals: 18,
        name: 'Wrapped Matic',
        symbol: 'WMATIC'
      },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    const response = await axios.post(
      `${TEST_URL}/internal/tokens/delete`,
      { id: newTokenResponse.data.token.id },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    expect(response.data.success).toBeTruthy();
  });
});
