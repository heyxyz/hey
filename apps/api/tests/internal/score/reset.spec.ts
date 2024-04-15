import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('internal/score/reset', () => {
  const payload = {
    address: '0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF',
    availabePoints: 1
  };

  test('should enable features for a profile', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/score/reset`,
      payload,
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.success).toBeTruthy();
  });

  test('should fail if not staff', async () => {
    try {
      const response = await axios.post(
        `${TEST_URL}/internal/score/reset`,
        payload,
        { headers: await getAuthApiHeadersForTest({ staff: false }) }
      );
      expect(response.status).toEqual(401);
    } catch {}
  });

  test('should fail if not authenticated', async () => {
    try {
      const response = await axios.post(`${TEST_URL}/email/update`, payload);
      expect(response.status).toEqual(401);
    } catch {}
  });
});
