import getAuthWorkerHeadersForTest from '@hey/lib/getAuthWorkerHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('internal/features/updateGardenerMode', () => {
  test('should enable gardener mode', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/updateGardenerMode`,
      { enabled: true },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    expect(response.data.enabled).toBeTruthy();
  });

  test('should disabe gardener mode', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/updateGardenerMode`,
      { enabled: false },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    expect(response.data.enabled).toBeFalsy();
  });
});
