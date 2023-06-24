import { describe, expect, test } from 'vitest';

import { TEST_URL } from '../constants';

describe('getOembed', () => {
  test('should return valid oembed response if url is provided', async () => {
    const url = 'https://github.com/lensterxyz/lenster';
    const getRequest = await fetch(`${TEST_URL}/?url=${url}`);
    const response: any = await getRequest.json();

    expect(response.success).toBeTruthy();
    expect(response.oembed.url).toBe(url);
    expect(response.oembed.title).toContain('GitHub - lensterxyz/lenster');
    expect(response.oembed.description).toContain(
      'Lenster is a decentralized and permissionless social media app'
    );
    expect(response.oembed.image).toContain('transform=large');
    expect(response.oembed.site).toBe('GitHub');
    expect(response.oembed.isLarge).toBeTruthy();
    expect(response.oembed.html).toBeNull();
  });

  test('should return valid oembed response if url supports iframe is provided', async () => {
    const url = 'https://www.youtube.com/watch?v=H5v3kku4y6Q';
    const getRequest = await fetch(`${TEST_URL}/?url=${url}`);
    const response: any = await getRequest.json();

    expect(response.success).toBeTruthy();
    expect(response.oembed.html).toContain(
      'https://www.youtube.com/embed/H5v3kku4y6Q'
    );
  });
});
