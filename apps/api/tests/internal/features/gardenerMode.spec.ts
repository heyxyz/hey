import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('internal/features/gardenerMode', () => {
  test('should enable gardener mode', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/gardenerMode`,
      { enabled: true },
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.enabled).toBeTruthy();
  });

  test('should disable gardener mode', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/gardenerMode`,
      { enabled: false },
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.enabled).toBeFalsy();
  });
});
