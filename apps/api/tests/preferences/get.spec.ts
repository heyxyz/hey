import type { Preferences } from '@hey/types/hey';

import { TEST_LENS_ID } from '@hey/data/constants';
import getAuthWorkerHeadersForTest from '@hey/lib/getAuthWorkerHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('preferences/get', () => {
  test('should return profile preferences', async () => {
    const response: {
      data: { result: Preferences };
    } = await axios.get(`${TEST_URL}/preferences/get`, {
      headers: await getAuthWorkerHeadersForTest(),
      params: { id: TEST_LENS_ID }
    });

    expect(response.data.result.features).toBeInstanceOf(Array);
    expect(response.data.result.hasDismissedOrMintedMembershipNft).toBeTruthy();
    expect(response.data.result.isPro).toBeTruthy();
    expect(response.data.result.isTrusted).toBeTruthy();
    expect(response.data.result.highSignalNotificationFilter).toBeTruthy();
    expect(response.data.result.isPride).toBeTruthy();
    expect(response.data.result.isFlagged).toBeFalsy();
    expect(response.data.result.isSuspended).toBeFalsy();
  });
});
