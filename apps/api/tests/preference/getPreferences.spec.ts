import { TEST_ENDPOINT } from '@utils/constants';
import axios from 'axios';
import urlcat from 'urlcat';
import { describe, expect, test } from 'vitest';

describe('preference/getPreferences', () => {
  test('should return preference of a profile', async () => {
    const { data } = await axios.get(
      urlcat(TEST_ENDPOINT, '/preference/getPreferences', {
        id: '0x01b69c'
      })
    );
    expect(data.result.isPride).toBeTruthy();
    expect(data.result.highSignalNotificationFilter).toBeTruthy();
  });
});
