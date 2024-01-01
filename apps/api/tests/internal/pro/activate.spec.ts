import getAuthWorkerHeadersForTest from '@hey/lib/getAuthWorkerHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('internal/pro/activate', () => {
  test('should activate pro for a profile', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/pro/activate`,
      { enabled: true, id: Math.random().toString(), trial: false },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    expect(response.data.enabled).toBeTruthy();
    expect(response.data.trial).toBeFalsy();
  });

  test('should activate pro trial for a profile', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/pro/activate`,
      { enabled: true, id: Math.random().toString(), trial: true },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    expect(response.data.enabled).toBeTruthy();
    expect(response.data.trial).toBeTruthy();
  });
});
