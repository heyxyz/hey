import getAuthApiHeadersForTest from '@hey/helpers/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/helpers/constants';
import { describe, expect, test } from 'vitest';

describe('internal/features/all', () => {
  test('should return all features', async () => {
    const response = await axios.get(`${TEST_URL}/internal/features/all`, {
      headers: await getAuthApiHeadersForTest()
    });

    expect(response.data.features).toBeInstanceOf(Array);
  });

  test('should fail if not staff', async () => {
    try {
      const response = await axios.get(`${TEST_URL}/internal/features/all`, {
        headers: await getAuthApiHeadersForTest({ staff: false })
      });
      expect(response.status).toEqual(401);
    } catch {}
  });

  test('should fail if not authenticated', async () => {
    try {
      const response = await axios.get(`${TEST_URL}/internal/features/all`);
      expect(response.status).toEqual(401);
    } catch {}
  });
});
