import { TEST_LENS_ID } from '@hey/data/constants';
import getAuthWorkerHeadersForTest from '@hey/lib/getAuthWorkerHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('preferences/getPreferences', () => {
  test('should return profile preferences', async () => {
    const response = await axios.get(`${TEST_URL}/preferences/getPreferences`, {
      headers: await getAuthWorkerHeadersForTest(),
      params: { id: TEST_LENS_ID }
    });

    expect(response.data.result.features).toBeInstanceOf(Array);
    expect(response.data.result.membershipNft).toHaveProperty(
      'dismissedOrMinted'
    );
    expect(response.data.result.pro).toHaveProperty('enabled');
    expect(response.data.result.preference.id).toEqual(TEST_LENS_ID);
    expect(
      response.data.result.preference.highSignalNotificationFilter
    ).toBeTruthy();
    expect(response.data.result.preference.isPride).toBeTruthy();
  });
});
