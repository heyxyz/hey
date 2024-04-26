import { PAGEVIEW } from '@hey/data/tracking';
import axios from 'axios';
import { TEST_URL } from 'src/helpers/constants';
import { describe, expect, test } from 'vitest';

describe('leafwatch/events', () => {
  test('should push event to leafwatch', async () => {
    const response = await axios.post(`${TEST_URL}/leafwatch/events`, {
      actor: '0x0d',
      name: PAGEVIEW,
      platform: 'web',
      properties: { page: 'explore' },
      referrer: null,
      url: 'https://hey.xyz/explore'
    });

    expect(response.data.id).toHaveLength(36);
  });
});
