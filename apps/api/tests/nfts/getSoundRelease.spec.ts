import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('nfts/getSoundRelease', async () => {
  test('should return sound nft', async () => {
    const response = await axios.get(`${TEST_URL}/nfts/getSoundRelease`, {
      params: { handle: 'annikarose', slug: 'just-like-you' }
    });

    expect(response.data.release.title).toEqual('Just Like You');
  });
});
