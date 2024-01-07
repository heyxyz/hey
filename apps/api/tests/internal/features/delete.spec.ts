import getAuthWorkerHeadersForTest from '@hey/lib/getAuthWorkerHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('internal/features/delete', async () => {
  test('should delete a feature', async () => {
    const newFeatureResponse = await axios.post(
      `${TEST_URL}/internal/features/create`,
      { key: Math.random().toString() },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    const response = await axios.post(
      `${TEST_URL}/internal/features/delete`,
      { id: newFeatureResponse.data.feature.id },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    expect(response.data.success).toBeTruthy();
  });
});
