import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('internal/features/toggle', () => {
  test('should kill a feature', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/toggle`,
      { enabled: false, id: '8ed8b26a-279d-4111-9d39-a40164b273a0' },
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.enabled).toBeFalsy();
  });

  test('should un-kill a feature', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/features/toggle`,
      { enabled: true, id: '8ed8b26a-279d-4111-9d39-a40164b273a0' },
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.enabled).toBeTruthy();
  });
});
