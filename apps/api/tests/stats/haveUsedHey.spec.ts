import { TEST_ENDPOINT } from '@utils/constants';
import axios from 'axios';
import urlcat from 'urlcat';
import { describe, expect, test } from 'vitest';

describe('stats/haveUsedHey', () => {
  test('should return have used hey or not', async () => {
    const { data } = await axios.get(
      urlcat(TEST_ENDPOINT, '/stats/haveUsedHey', {
        id: '0x0d'
      })
    );
    expect(data.haveUsedHey).toBeTruthy();
  });
});
