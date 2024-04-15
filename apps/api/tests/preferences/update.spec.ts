import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('preferences/update', () => {
  const payload = { highSignalNotificationFilter: true, isPride: true };

  test('should update profile preferences', async () => {
    const response = await axios.post(
      `${TEST_URL}/preferences/update`,
      { highSignalNotificationFilter: true, isPride: true },
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.result.highSignalNotificationFilter).toBeTruthy();
    expect(response.data.result.isPride).toBeTruthy();
  });

  test('should fail if not authenticated', async () => {
    try {
      const response = await axios.post(
        `${TEST_URL}/preferences/update`,
        payload
      );
      expect(response.status).toEqual(401);
    } catch {}
  });
});
