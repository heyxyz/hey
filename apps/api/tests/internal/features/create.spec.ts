import getAuthApiHeadersForTest from '@hey/helpers/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/helpers/constants';
import { describe, expect, test } from 'vitest';

describe('internal/features/create', () => {
  const payload = { key: Math.random().toString() };

  test('should create a feature', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/create`,
      payload,
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.feature.id).toHaveLength(36);
  });

  test('should fail if not staff', async () => {
    try {
      const response = await axios.post(
        `${TEST_URL}/internal/features/create`,
        payload,
        { headers: await getAuthApiHeadersForTest({ staff: false }) }
      );
      expect(response.status).toEqual(401);
    } catch {}
  });

  test('should fail if not authenticated', async () => {
    try {
      const response = await axios.post(
        `${TEST_URL}/internal/features/create`,
        payload
      );
      expect(response.status).toEqual(401);
    } catch {}
  });
});
