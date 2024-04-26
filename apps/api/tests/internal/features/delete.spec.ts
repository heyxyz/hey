import getAuthApiHeadersForTest from '@hey/helpers/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/helpers/constants';
import { describe, expect, test } from 'vitest';

describe('internal/features/delete', async () => {
  const createNewFeature = async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/create`,
      { key: Math.random().toString() },
      { headers: await getAuthApiHeadersForTest() }
    );

    return response.data.feature.id;
  };

  const payload = { id: await createNewFeature() };

  test('should delete a feature', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/delete`,
      payload,
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.success).toBeTruthy();
  });

  test('should fail if not staff', async () => {
    try {
      const response = await axios.post(
        `${TEST_URL}/internal/features/delete`,
        payload,
        { headers: await getAuthApiHeadersForTest({ staff: false }) }
      );
      expect(response.status).toEqual(401);
    } catch {}
  });

  test('should fail if not authenticated', async () => {
    try {
      const response = await axios.post(
        `${TEST_URL}/internal/features/delete`,
        payload
      );
      expect(response.status).toEqual(401);
    } catch {}
  });
});
