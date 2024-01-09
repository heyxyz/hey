import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('internal/features/staffMode', () => {
  test('should enable staff mode', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/staffMode`,
      { enabled: true },
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.enabled).toBeTruthy();
  });

  test('should disable staff mode', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/staffMode`,
      { enabled: false },
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.enabled).toBeFalsy();
  });
});
