import getAuthWorkerHeadersForTest from '@hey/lib/getAuthWorkerHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('preference/updateHeyMemberNftStatus', () => {
  test('should update profile membership nft status', async () => {
    const response = await axios.post(
      `${TEST_URL}/preference/updateHeyMemberNftStatus`,
      undefined,
      { headers: await getAuthWorkerHeadersForTest() }
    );

    expect(response.data.result.dismissedOrMinted).toBeTypeOf('boolean');
  });
});
