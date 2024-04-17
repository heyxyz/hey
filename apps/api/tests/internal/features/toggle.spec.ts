import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('internal/features/toggle', () => {
  const payload = {
    enabled: false,
    id: '8ed8b26a-279d-4111-9d39-a40164b273a0'
  };

  test('should kill a feature', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/toggle`,
      payload,
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.enabled).toBeFalsy();
  });

  test('should un-kill a feature', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/toggle`,
      { enabled: true, id: '8ed8b26a-279d-4111-9d39-a40164b273a0' },
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.enabled).toBeTruthy();
  });

  test('should fail if not staff', async () => {
    try {
      const response = await axios.post(
        `${TEST_URL}/internal/features/toggle`,
        payload,
        { headers: await getAuthApiHeadersForTest({ staff: false }) }
      );
      expect(response.status).toEqual(401);
    } catch {}
  });

  test('should fail if not authenticated', async () => {
    try {
      const response = await axios.post(
        `${TEST_URL}/internal/features/toggle`,
        payload
      );
      expect(response.status).toEqual(401);
    } catch {}
  });
});
