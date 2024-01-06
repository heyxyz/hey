import { TEST_LENS_ID } from '@hey/data/constants';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('preferences/nftStatus', () => {
  test('should return profile membership nft status', async () => {
    const response = await axios.get(`${TEST_URL}/preferences/nftStatus`, {
      params: { id: TEST_LENS_ID }
    });

    expect(response.data.result.dismissedOrMinted).toBeTypeOf('boolean');
  });
});
