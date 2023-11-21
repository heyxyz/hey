import { TEST_ENDPOINT } from '@utils/constants';
import axios from 'axios';
import urlcat from 'urlcat';
import { describe, expect, test } from 'vitest';

describe('staff-pick/getStaffPicks', () => {
  test('should return staff picked items', async () => {
    const { data } = await axios.get(
      urlcat(TEST_ENDPOINT, '/staff-pick/getStaffPicks', {
        id: '0x0d'
      })
    );
    expect(data.result.length).toBeGreaterThan(0);
  });
});
