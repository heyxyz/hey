import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('internal/features/delete', () => {
  const createNewFeature = async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/create`,
      { key: Math.random().toString() },
      { headers: await getAuthApiHeadersForTest() }
    );

    return response.data.feature.id;
  };

  test('should delete a feature', async () => {
    const newFeature = await createNewFeature();

    const response = await axios.post(
      `${TEST_URL}/internal/features/delete`,
      { id: newFeature },
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.success).toBeTruthy();
  });

  test('should fail if not staff', async () => {
    try {
      const newFeature = await createNewFeature();

      const response = await axios.post(
        `${TEST_URL}/internal/features/delete`,
        { id: newFeature },
        { headers: await getAuthApiHeadersForTest({ staff: false }) }
      );
      expect(response.status).toEqual(401);
    } catch {}
  });

  test('should fail if not authenticated', async () => {
    try {
      const newFeature = await createNewFeature();

      const response = await axios.post(
        `${TEST_URL}/internal/features/delete`,
        { id: newFeature }
      );
      expect(response.status).toEqual(401);
    } catch {}
  });
});
