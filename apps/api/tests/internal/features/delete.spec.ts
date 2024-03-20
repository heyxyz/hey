import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('internal/features/delete', () => {
  test('should delete a feature', async () => {
    const newFeatureResponse = await axios.post(
      `${TEST_URL}/internal/features/create`,
      { key: Math.random().toString() },
      { headers: await getAuthApiHeadersForTest() }
    );

    const response = await axios.post(
      `${TEST_URL}/internal/features/delete`,
      { id: newFeatureResponse.data.feature.id },
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.success).toBeTruthy();
  });
});
