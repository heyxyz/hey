import getAuthApiHeadersForTest from '@hey/helpers/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/helpers/constants';
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
  const createNewToken = async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/tokens/create`,
      {
        contractAddress: generateRandomEthereumAddress(),
        decimals: 18,
        name: 'Wrapped Matic',
        symbol: 'WMATIC'
      },
      { headers: await getAuthApiHeadersForTest() }
    );

    return response.data.token.id;
  };

  const payload = {
    id: await createNewToken()
  };

  test('should delete a token', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/tokens/delete`,
      payload,
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.success).toBeTruthy();
  });

  test('should fail if not staff', async () => {
    try {
      const response = await axios.post(
        `${TEST_URL}/internal/tokens/delete`,
        payload,
        { headers: await getAuthApiHeadersForTest({ staff: false }) }
      );
      expect(response.status).toEqual(401);
    } catch {}
  });

  test('should fail if not authenticated', async () => {
    try {
      const response = await axios.post(
        `${TEST_URL}/internal/tokens/delete`,
        payload
      );
      expect(response.status).toEqual(401);
    } catch {}
  });
});
