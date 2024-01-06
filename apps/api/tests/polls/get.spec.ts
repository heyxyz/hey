import getAuthWorkerHeadersForTest from '@hey/lib/getAuthWorkerHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('polls/get', async () => {
  const id = '76018d99-0dcb-4b54-8fc1-7782b63f3055';

  test('should return a poll without authentification', async () => {
    const response = await axios.get(`${TEST_URL}/polls/get`, {
      params: { id }
    });

    expect(response.data.result.id).toEqual(id);
    expect(response.data.result.options).toHaveLength(2);
    expect(response.data.result.options[0].voted).toBeFalsy();
  });

  test('should return a poll with authentification', async () => {
    const response = await axios.get(`${TEST_URL}/polls/get`, {
      headers: await getAuthWorkerHeadersForTest(),
      params: { id }
    });

    expect(response.data.result.options[0].voted).toBeTruthy();
  });
});
