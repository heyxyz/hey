import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('stats/streaksCalendar', () => {
  test('should return streaks calendar', async () => {
    const response = await axios.get(`${TEST_URL}/stats/streaksCalendar`, {
      params: { id: '0x0d' }
    });

    expect(Object.keys(response.data.data)).toBeInstanceOf(Array);
  });
});
