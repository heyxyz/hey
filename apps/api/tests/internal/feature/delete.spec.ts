import getAuthWorkerHeadersForTest from '@hey/lib/getAuthWorkerHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('internal/feature/delete', async () => {
  test('should delete a feature', async () => {
    const newFeatureResponse = await axios.post(
      `${TEST_URL}/internal/feature/create`,
      { key: Math.random().toString() },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    const response = await axios.post(
      `${TEST_URL}/internal/feature/delete`,
      { id: newFeatureResponse.data.feature.id },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    expect(response.data.success).toBeTruthy();
  });
});
