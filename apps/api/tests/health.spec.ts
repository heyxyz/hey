import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('health', () => {
  test('should return pong', async () => {
    const response = await axios.get(`${TEST_URL}/health`);

    expect(response.data.ping).toEqual('pong');
  });
});
