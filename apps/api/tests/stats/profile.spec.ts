import { TEST_ENDPOINT } from '@utils/constants';
import axios from 'axios';
import urlcat from 'urlcat';
import { describe, expect, test } from 'vitest';

describe('stats/profile', () => {
  test('should return profile stats', async () => {
    const { data } = await axios.get(
      urlcat(TEST_ENDPOINT, '/stats/profile', {
        id: '0x0d',
        handle: 'yoginth'
      })
    );
    const keys = Object.keys(data.result);
    expect(keys).toEqual([
      'impressions',
      'profile_views',
      'follows',
      'likes',
      'mirrors',
      'comments',
      'link_clicks',
      'collects'
    ]);
  });
});
