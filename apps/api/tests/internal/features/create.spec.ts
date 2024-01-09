import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('internal/features/create', async () => {
  test('should create a feature', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/create`,
      { key: Math.random().toString() },
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.feature.id).toHaveLength(36);
  });
});
