import { TEST_ENDPOINT } from '@utils/constants';
import axios from 'axios';
import urlcat from 'urlcat';
import { describe, expect, test } from 'vitest';

describe('stats/publicationViews', () => {
  test('should return publication views stats', async () => {
    const { data } = await axios.post(
      urlcat(TEST_ENDPOINT, '/stats/publicationViews'),
      {
        ids: [
          '0x326c-0x0aa8-DA-94178c47',
          '0x89dc-0x14d3-DA-a26564dd',
          '0x89dc-0x14c5-DA-cab6f9c6'
        ]
      }
    );
    expect(data.views.length).toEqual(3);
  });
});
