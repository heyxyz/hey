import { TEST_LENS_ID } from '@hey/data/constants';
import getAuthWorkerHeadersForTest from '@hey/lib/getAuthWorkerHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('internal/verified/updateVerified', () => {
  test('should update verified status', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/verified/updateVerified`,
      { enabled: true, id: TEST_LENS_ID },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    expect(response.data.enabled).toBeTruthy();
  });
});
