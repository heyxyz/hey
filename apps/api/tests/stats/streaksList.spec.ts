import { TEST_ENDPOINT } from '@utils/constants';
import axios from 'axios';
import urlcat from 'urlcat';
import { describe, expect, test } from 'vitest';

describe('stats/streaksList', () => {
  test('should return streaks list stats', async () => {
    const { data } = await axios.get(
      urlcat(TEST_ENDPOINT, '/stats/streaksList', {
        id: '0x0d'
      })
    );
    const key = Object.keys(data.data[0]);
    expect(key[0]).toEqual('id');
    expect(key[1]).toEqual('event');
    expect(key[2]).toEqual('date');
  });
});
