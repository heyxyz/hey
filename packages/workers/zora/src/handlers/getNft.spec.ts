import { describe, expect, test } from 'vitest';

import { TEST_URL } from '../constants';

describe('getNft', () => {
  test('should return valid nft response if chain and address is provided', async () => {
    console.log(
      `${TEST_URL}/nft?chain=zora&address=0x4ad3cd57a68149a5c5d8a41919dc8ac02d00a366`
    );
    const getRequest = await fetch(
      `${TEST_URL}/nft?chain=zora&address=0x4ad3cd57a68149a5c5d8a41919dc8ac02d00a366`
    );
    const response: any = await getRequest.json();

    expect(response.success).toBeTruthy();
    expect(response.nft.name).toBe('Guild on Zora');
  });
});
