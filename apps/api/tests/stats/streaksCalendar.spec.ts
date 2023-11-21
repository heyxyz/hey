import { TEST_ENDPOINT } from '@utils/constants';
import axios from 'axios';
import urlcat from 'urlcat';
import { describe, expect, test } from 'vitest';

describe('stats/streaksCalendar', () => {
  test('should return streaks calendar stats', async () => {
    const { data } = await axios.get(
      urlcat(TEST_ENDPOINT, '/stats/streaksCalendar', {
        id: '0x0d'
      })
    );
    const keys = Object.keys(data.data);
    expect(keys.length).toEqual(366);
  });
});
