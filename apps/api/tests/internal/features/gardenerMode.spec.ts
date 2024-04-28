import getAuthApiHeadersForTest from '@hey/helpers/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/helpers/constants';
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

  test('should fail if not gardener', async () => {
    try {
      const response = await axios.post(
        `${TEST_URL}/internal/features/gardenerMode`,
        { enabled: true },
        { headers: await getAuthApiHeadersForTest({ staff: false }) }
      );
      expect(response.status).toEqual(401);
    } catch {}
  });

  test('should fail if not authenticated', async () => {
    try {
      const response = await axios.post(
        `${TEST_URL}/internal/features/gardenerMode`,
        { enabled: true }
      );
      expect(response.status).toEqual(401);
    } catch {}
  });
});
