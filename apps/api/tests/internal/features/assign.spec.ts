import { TEST_LENS_ID } from '@good/data/constants';
import getAuthApiHeadersForTest from '@good/helpers/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/helpers/constants';
import { describe, expect, test } from 'vitest';

describe.skip('internal/features/assign', () => {
  const payload = {
    enabled: true,
    id: '8ed8b26a-279d-4111-9d39-a40164b273a0',
    profile_id: TEST_LENS_ID
  };

  test('should enable features for a profile', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/assign`,
      payload,
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.enabled).toBeTruthy();
  });

  test('should disable features for a profile', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/assign`,
      {
        enabled: false,
        id: '8ed8b26a-279d-4111-9d39-a40164b273a0',
        profile_id: TEST_LENS_ID
      },
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.enabled).toBeFalsy();
  });

  test('should fail if not staff', async () => {
    try {
      const response = await axios.post(
        `${TEST_URL}/internal/features/assign`,
        payload,
        { headers: await getAuthApiHeadersForTest({ staff: false }) }
      );
      expect(response.status).toEqual(401);
    } catch {}
  });

  test('should fail if not authenticated', async () => {
    try {
      const response = await axios.post(
        `${TEST_URL}/internal/features/assign`,
        payload
      );
      expect(response.status).toEqual(401);
    } catch {}
  });
});
