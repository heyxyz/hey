import getAuthWorkerHeadersForTest from '@hey/lib/getAuthWorkerHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('internal/verified/update', () => {
  test('should update verified status', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/verified/update`,
      { enabled: true, id: Math.random().toString() },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    expect(response.data.enabled).toBeTruthy();
  });
});
