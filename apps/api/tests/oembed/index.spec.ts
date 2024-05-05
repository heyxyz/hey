import axios from 'axios';
import { TEST_URL } from 'src/helpers/constants';
import { describe, expect, test } from 'vitest';

describe('oembed/index', () => {
  test('should return basic oembed', async () => {
    const response = await axios.get(`${TEST_URL}/oembed`, {
      params: { url: 'https://github.com' }
    });

    expect(response.data.oembed.description).contains('GitHub');
    expect(response.data.oembed.favicon).contains(
      'https://www.google.com/s2/favicons?domain=github.com&sz=128'
    );
    expect(response.data.oembed.site).contains('GitHub');
    expect(response.data.oembed.title).contains('GitHub');
    expect(response.data.oembed.url).contains('https://github.com');
  });

  test('should return rich oembed', async () => {
    const response = await axios.get(`${TEST_URL}/oembed`, {
      params: { url: 'https://www.youtube.com/watch?v=SXK6NHp09jE' }
    });

    expect(response.data.oembed.html).toEqual(
      '<iframe src="https://www.youtube.com/embed/SXK6NHp09jE" width="100%" height="415" allow="accelerometer; encrypted-media" allowfullscreen></iframe>'
    );
  });

  test('should return nft', async () => {
    const response = await axios.get(`${TEST_URL}/oembed`, {
      params: { url: 'https://app.manifold.xyz/c/totesemosh' }
    });

    expect(response.data.oembed.nft.collectionName).toEqual(
      'Totes Emosh (Scene 2)'
    );
    expect(response.data.oembed.nft.creatorAddress).toEqual(
      '0x3585ca22df80d70f6d1cc0867d8387c360181349'
    );
    expect(response.data.oembed.nft.mediaUrl).toEqual(
      'https://d1updk8hq321rl.cloudfront.net/optimized/85ae2690f4fa0c82f2e66334c20ad64df02ea18865319130a8aecf6b917fdb7c/w_1024.jpg'
    );
    expect(response.data.oembed.nft.sourceUrl).toEqual(
      'https://app.manifold.xyz/c/totesemosh'
    );
  });

  test('should return frame nft', async () => {
    const response = await axios.get(`${TEST_URL}/oembed`, {
      params: {
        url: 'https://zora.co/collect/base:0xbb89e4e207d447242260dea7cf0da86ce76d49cd/1'
      }
    });

    expect(response.data.oembed.nft.collectionName).toEqual('Intern Card');
    expect(response.data.oembed.nft.chain).toEqual('base');
    expect(response.data.oembed.nft.mediaUrl).toEqual(
      'https://zora.co/api/thumbnail/fc/8453/0xbb89e4e207d447242260dea7cf0da86ce76d49cd/1'
    );
    expect(response.data.oembed.nft.sourceUrl).toEqual(
      'https://zora.co/collect/base:0xbb89e4e207d447242260dea7cf0da86ce76d49cd/1'
    );
  });
});
