import { TEST_ENDPOINT } from '@utils/constants';
import axios from 'axios';
import urlcat from 'urlcat';
import { describe, expect, test } from 'vitest';

describe('oembed', () => {
  test('should return url oembed', async () => {
    const { data } = await axios.get(
      urlcat(TEST_ENDPOINT, '/oembed', {
        url: 'https://github.com/heyxyz/hey'
      })
    );
    expect(data.oembed.url).toContain('https://github.com/heyxyz/hey');
    expect(data.oembed.title).toContain('GitHub - heyxyz/hey');
    expect(data.oembed.site).toContain('GitHub');
  });
});
