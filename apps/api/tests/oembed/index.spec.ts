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
      params: { url: 'https://www.sound.xyz/yo/good-the-revolution-begins' }
    });

    expect(response.data.oembed.nft.collectionName).toEqual(
      'Good, The Revolution Begins'
    );
    expect(response.data.oembed.nft.creatorAddress).toEqual(
      '0x03ba34f6ea1496fa316873cf8350a3f7ead317ef'
    );
    expect(response.data.oembed.nft.mediaUrl).toEqual(
      'https://opengraph.sound.xyz/v1/release/e080681f-acc0-44c5-9191-802b4d298174'
    );
    expect(response.data.oembed.nft.sourceUrl).toEqual(
      'https://www.sound.xyz/yo/good-the-revolution-begins'
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
