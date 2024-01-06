import getAuthWorkerHeadersForTest from '@hey/lib/getAuthWorkerHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('internal/features/updateStaffMode', () => {
  test('should enable staff mode', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/updateStaffMode`,
      { enabled: true },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    expect(response.data.enabled).toBeTruthy();
  });

  test('should disabe staff mode', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/updateStaffMode`,
      { enabled: false },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    expect(response.data.enabled).toBeFalsy();
  });
});
