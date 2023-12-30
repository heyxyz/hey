import getAuthWorkerHeadersForTest from '@hey/lib/getAuthWorkerHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('internal/feature/all', () => {
  test('should return all features', async () => {
    const response = await axios.get(`${TEST_URL}/internal/feature/all`, {
      headers: await getAuthWorkerHeadersForTest()
    });

    expect(response.data.features).toBeInstanceOf(Array);
  });
});
