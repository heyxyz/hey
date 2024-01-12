import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('stats/profile', () => {
  test('should return profile stats', async () => {
    const response = await axios.get(`${TEST_URL}/stats/profile`, {
      params: { handle: 'stani', id: '0x05' }
    });

    expect(response.data.result).toHaveProperty('impressions');
    expect(response.data.result.impressions).toHaveProperty('last_14_days');
    expect(response.data.result.impressions).toHaveProperty('last_7_days');

    expect(response.data.result.impressions.last_14_days).greaterThanOrEqual(0);
    expect(response.data.result.impressions.last_7_days).greaterThanOrEqual(0);

    expect(response.data.result).toHaveProperty('profile_views');
    expect(response.data.result.profile_views).toHaveProperty('last_14_days');
    expect(response.data.result.profile_views).toHaveProperty('last_7_days');

    expect(response.data.result).toHaveProperty('follows');
    expect(response.data.result.follows).toHaveProperty('last_14_days');
    expect(response.data.result.follows).toHaveProperty('last_7_days');

    expect(response.data.result).toHaveProperty('likes');
    expect(response.data.result.likes).toHaveProperty('last_14_days');
    expect(response.data.result.likes).toHaveProperty('last_7_days');

    expect(response.data.result).toHaveProperty('mirrors');
    expect(response.data.result.mirrors).toHaveProperty('last_14_days');
    expect(response.data.result.mirrors).toHaveProperty('last_7_days');

    expect(response.data.result).toHaveProperty('comments');
    expect(response.data.result.comments).toHaveProperty('last_14_days');
    expect(response.data.result.comments).toHaveProperty('last_7_days');

    expect(response.data.result).toHaveProperty('link_clicks');
    expect(response.data.result.link_clicks).toHaveProperty('last_14_days');
    expect(response.data.result.link_clicks).toHaveProperty('last_7_days');

    expect(response.data.result).toHaveProperty('collects');
    expect(response.data.result.collects).toHaveProperty('last_14_days');
    expect(response.data.result.collects).toHaveProperty('last_7_days');
  });
});
