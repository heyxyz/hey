import { describe, expect, test } from 'vitest';

import { TEST_URL } from '../constants';

describe('getZoraNft', () => {
  test('should return valid mainnet nft response if chain and address is provided', async () => {
    const getRequest = await fetch(
      `${TEST_URL}/zora?chain=zora&address=0x4ad3cd57a68149a5c5d8a41919dc8ac02d00a366`
    );
    const response: any = await getRequest.json();

    expect(response.success).toBeTruthy();
    expect(response.nft.name).toBe('Guild on Zora');
  });

  test('should return valid testnet nft response if chain and address is provided', async () => {
    const getRequest = await fetch(
      `${TEST_URL}/zora?chain=zgor&address=0x276d3a444f2fe1a7d43c6716a630f3a2760ad1c9`
    );
    const response: any = await getRequest.json();

    expect(response.success).toBeTruthy();
    expect(response.nft.name).toBe('VİKİNG');
  });
});
