import { describe, expect, test } from 'vitest';

import { TEST_URL } from '../constants';

describe('proxyIpfs', () => {
  test('should render ipfs image if hash is provided', async () => {
    const getRequest = await fetch(
      `${TEST_URL}/ipfs/QmY5RhMhYUzMacBPxqsoWaEB3Ki43rZDDv3LFDD2cVAfdA`
    );
    const response: any = await getRequest.body;

    expect(response).toBeTruthy();
  });
});
