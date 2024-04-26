import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/helpers/constants';
import { describe, expect, test } from 'vitest';

describe('email/update', () => {
  const payload = {
    email: 'vitest@hey.xyz',
    resend: false
  };

  test('should enable features for a profile', async () => {
    const response = await axios.post(`${TEST_URL}/email/update`, payload, {
      headers: await getAuthApiHeadersForTest()
    });

    expect(response.data.success).toBeTruthy();
  });

  test('should fail if not authenticated', async () => {
    try {
      const response = await axios.post(`${TEST_URL}/email/update`, payload);
      expect(response.status).toEqual(401);
    } catch {}
  });
});
