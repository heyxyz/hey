import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('preferences/updateNftStatus', () => {
  test('should update profile membership nft status', async () => {
    const response = await axios.post(
      `${TEST_URL}/preferences/updateNftStatus`,
      undefined,
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.result.dismissedOrMinted).toBeTypeOf('boolean');
  });
});
