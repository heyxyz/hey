import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('score/leaderboard', () => {
  test('should return the leaderboard', async () => {
    const response = await axios.get(`${TEST_URL}/score/leaderboard`, {
      headers: { 'x-lens-network': 'testnet' }
    });

    expect(response.data.result).toHaveLength(5);
  });
});
