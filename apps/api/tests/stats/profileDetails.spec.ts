import { TEST_ENDPOINT } from '@utils/constants';
import axios from 'axios';
import urlcat from 'urlcat';
import { describe, expect, test } from 'vitest';

describe('stats/profileDetails', () => {
  test('should return profile details', async () => {
    const { data } = await axios.get(
      urlcat(TEST_ENDPOINT, '/stats/profileDetails', {
        id: '0x0d'
      })
    );
    expect(data.result.actor).toEqual('0x0d');
  });
});
