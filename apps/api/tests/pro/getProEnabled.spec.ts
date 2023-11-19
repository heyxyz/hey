import { TEST_ENDPOINT } from '@utils/constants';
import axios from 'axios';
import urlcat from 'urlcat';
import { describe, expect, test } from 'vitest';

describe('pro/getProEnabled', () => {
  test('should return pro is enabled', async () => {
    const { data } = await axios.get(
      urlcat(TEST_ENDPOINT, '/pro/getProEnabled', {
        id: '0x0d'
      })
    );
    expect(data.enabled).toBeTruthy();
  });

  test('should return pro is disabled', async () => {
    const { data } = await axios.get(
      urlcat(TEST_ENDPOINT, '/pro/getProEnabled', {
        id: '0x01'
      })
    );
    expect(data.enabled).toBeFalsy();
  });
});
