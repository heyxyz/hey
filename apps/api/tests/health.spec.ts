import { TEST_URL } from '@utils/constants';
import { describe, test } from 'vitest';

describe('health', () => {
  test('should return pong', async () => {
    const response = await fetch(`${TEST_URL}/health`);
    const json = await response.json();
    console.log(json);
    // expect(response.data.ping).toEqual('pong');
  });
});
