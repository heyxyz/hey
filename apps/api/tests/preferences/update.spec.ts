import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('preferences/update', () => {
  test('should update profile preferences', async () => {
    const response = await axios.post(
      `${TEST_URL}/preferences/update`,
      { highSignalNotificationFilter: true, isPride: true },
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.result.highSignalNotificationFilter).toBeTruthy();
    expect(response.data.result.isPride).toBeTruthy();
  });
});
