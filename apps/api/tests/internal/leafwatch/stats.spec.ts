import axios from 'axios';
import { TEST_URL } from 'src/helpers/constants';
import { describe, expect, test } from 'vitest';

describe('internal/leafwatch/stats', () => {
  test('should return leafwatch stats', async () => {
    const response = await axios.get(`${TEST_URL}/internal/leafwatch/stats`);

    expect(response.data.events).toHaveProperty('last_60_seconds');
    expect(response.data.events).toHaveProperty('today');
    expect(response.data.events).toHaveProperty('yesterday');
    expect(response.data.events).toHaveProperty('this_week');
    expect(response.data.events).toHaveProperty('this_month');
    expect(response.data.events).toHaveProperty('all_time');

    expect(response.data.impressions).toHaveProperty('last_60_seconds');
    expect(response.data.impressions).toHaveProperty('today');
    expect(response.data.impressions).toHaveProperty('yesterday');
    expect(response.data.impressions).toHaveProperty('this_week');
    expect(response.data.impressions).toHaveProperty('this_month');
    expect(response.data.impressions).toHaveProperty('all_time');

    expect(response.data.eventsToday).toBeInstanceOf(Array);
    expect(response.data.impressionsToday).toBeInstanceOf(Array);
    expect(response.data.topEvents).toBeInstanceOf(Array);
  });
});
