import getAuthWorkerHeadersForTest from '@hey/lib/getAuthWorkerHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('internal/features/staffMode', () => {
  test('should enable staff mode', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/staffMode`,
      { enabled: true },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    expect(response.data.enabled).toBeTruthy();
  });

  test('should disabe staff mode', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/staffMode`,
      { enabled: false },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    expect(response.data.enabled).toBeFalsy();
  });
});
