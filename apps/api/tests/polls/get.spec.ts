import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/helpers/constants';
import { describe, expect, test } from 'vitest';

describe('polls/get', () => {
  const id = '0bc7fc23-fe6d-467f-b375-044c6cc1ad27';

  test('should return a poll without authentication', async () => {
    const response = await axios.get(`${TEST_URL}/polls/get`, {
      params: { id }
    });

    expect(response.data.result.id).toEqual(id);
    expect(response.data.result.options).toHaveLength(2);
    expect(response.data.result.options[0].voted).toBeFalsy();
  });

  test('should return a poll with authentication', async () => {
    const response = await axios.get(`${TEST_URL}/polls/get`, {
      headers: await getAuthApiHeadersForTest(),
      params: { id }
    });

    expect(response.data.result.options[0].voted).toBeTruthy();
  });
});
