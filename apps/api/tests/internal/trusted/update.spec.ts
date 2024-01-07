import getAuthWorkerHeadersForTest from '@hey/lib/getAuthWorkerHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('internal/trusted/update', () => {
  test('should update trusted profile status', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/trusted/update`,
      { enabled: true, id: Math.random().toString() },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    expect(response.data.enabled).toBeTruthy();
  });
});
