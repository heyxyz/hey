import { TEST_LENS_ID } from '@hey/data/constants';
import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('internal/features/assign', () => {
  test('should enable features for a profile', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/assign`,
      {
        enabled: true,
        id: '8ed8b26a-279d-4111-9d39-a40164b273a0',
        profile_id: TEST_LENS_ID
      },
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
});
