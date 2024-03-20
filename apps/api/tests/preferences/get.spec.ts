import type { Preferences } from '@hey/types/hey';

import { TEST_LENS_ID } from '@hey/data/constants';
import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('preferences/get', () => {
  test('should return profile preferences', async () => {
    const response: {
      data: { result: Preferences };
    } = await axios.get(`${TEST_URL}/preferences/get`, {
      headers: await getAuthApiHeadersForTest(),
      params: { id: TEST_LENS_ID }
    });

    expect(response.data.result.features).toBeInstanceOf(Array);
    expect(response.data.result.hasDismissedOrMintedMembershipNft).toBeTypeOf(
      'boolean'
    );
    expect(response.data.result.highSignalNotificationFilter).toBeTruthy();
    expect(response.data.result.isPride).toBeTruthy();
  });
});
