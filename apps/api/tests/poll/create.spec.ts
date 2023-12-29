import getAuthWorkerHeadersForTest from '@hey/lib/getAuthWorkerHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('poll/create', async () => {
  test('should create a poll', async () => {
    const response = await axios.post(
      `${TEST_URL}/poll/create`,
      { length: 30, options: ['option 1', 'option 2'] },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    expect(response.data.id).toHaveLength(36);
  });
});
