import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('nfts/getZoraNft', async () => {
  test('should return zora nft without token', async () => {
    const response = await axios.get(`${TEST_URL}/nfts/getZoraNft`, {
      params: {
        address: '0x84021385852ac3660d847af215098a1ef1b1b5ed',
        chain: 'zora'
      }
    });

    expect(response.data.nft.contract.name).toEqual('Net AIrt');
  });

  test('should return zora nft with token', async () => {
    const response = await axios.get(`${TEST_URL}/nfts/getZoraNft`, {
      params: {
        address: '0x84021385852ac3660d847af215098a1ef1b1b5ed',
        chain: 'zora',
        token: 1
      }
    });

    expect(response.data.nft.name).toEqual('Hyperpop Bytes');
  });
});
