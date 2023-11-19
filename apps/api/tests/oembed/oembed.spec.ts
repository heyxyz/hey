import { TEST_ENDPOINT } from '@utils/constants';
import axios from 'axios';
import urlcat from 'urlcat';
import { describe, expect, test } from 'vitest';

describe('oembed', () => {
  test('should return hey member nft status', async () => {
    const { data } = await axios.get(
      urlcat(TEST_ENDPOINT, '/oembed', {
        url: 'https://github.com/heyxyz/hey'
      })
    );
    expect(data.oembed.url).toContain('https://github.com/heyxyz/hey');
    expect(data.oembed.title).toContain('GitHub - heyxyz/hey');
    expect(data.oembed.description).toContain(
      'decentralized and permissionless'
    );
    expect(data.oembed.image).toContain('https://ik.imagekit.io');
    expect(data.oembed.site).toContain('GitHub');
    expect(data.oembed.isLarge).toBeTruthy();
  });
});
