import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('internal/features/kill', async () => {
  test('should kill a feature', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/kill`,
      { enabled: false, id: '0779d74f-0426-4988-b4c4-2b632f5de8e1' },
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.enabled).toBeFalsy();
  });

  test('should un-kill a feature', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/kill`,
      { enabled: true, id: '0779d74f-0426-4988-b4c4-2b632f5de8e1' },
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.enabled).toBeTruthy();
  });
});
