import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('polls/get', async () => {
  const id = '76018d99-0dcb-4b54-8fc1-7782b63f3055';

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
