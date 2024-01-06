import { TEST_LENS_ID } from '@hey/data/constants';
import getAuthWorkerHeadersForTest from '@hey/lib/getAuthWorkerHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('internal/features/assign', () => {
  test('should enable features for a profile', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/assign`,
      {
        enabled: true,
        id: '0779d74f-0426-4988-b4c4-2b632f5de8e1',
        profile_id: TEST_LENS_ID
      },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    expect(response.data.enabled).toBeTruthy();
  });

  test('should disable features for a profile', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/assign`,
      {
        enabled: false,
        id: '0779d74f-0426-4988-b4c4-2b632f5de8e1',
        profile_id: TEST_LENS_ID
      },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    expect(response.data.enabled).toBeFalsy();
  });
});
