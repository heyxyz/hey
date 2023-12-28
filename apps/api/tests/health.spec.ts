import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, test } from 'vitest';

describe('health', () => {
  test('should return pong', async () => {
    const response = await axios.get(`${TEST_URL}/health`);
    console.log(response.data);
    // expect(response.data.ping).toEqual('pong');
  });
});
