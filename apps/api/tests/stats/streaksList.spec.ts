import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('stats/streaksList', () => {
  test('should return streaks calendar', async () => {
    const response = await axios.get(`${TEST_URL}/stats/streaksList`, {
      params: { date: 'latest', id: '0x0d' }
    });

    expect(response.data.data).toBeInstanceOf(Array);
  });
});
