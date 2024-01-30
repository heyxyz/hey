import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
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
      params: {
        url: 'https://zora.co/collect/0x9d90669665607f08005cae4a7098143f554c59ef'
      }
    });

    expect(response.data.oembed.nft.collectionName).toEqual(
      'Stand with Crypto'
    );
    expect(response.data.oembed.nft.contractAddress).toEqual(
      '0x9d90669665607f08005cae4a7098143f554c59ef'
    );
    expect(response.data.oembed.nft.creatorAddress).toEqual(
      '0xc2a6116e9a1f9add1bb87eef308f216bb0304c38'
    );
    expect(response.data.oembed.nft.mediaUrl).toEqual(
      'https://zora.co/api/thumbnail/1/0x9d90669665607f08005cae4a7098143f554c59ef'
    );
    expect(response.data.oembed.nft.schema).toEqual('ERC721');
    expect(response.data.oembed.nft.sourceUrl).toEqual(
      'https://zora.co/collect/0x9d90669665607f08005cae4a7098143f554c59ef'
    );
  });

  test('should return hey portal', async () => {
    const response = await axios.get(`${TEST_URL}/oembed`, {
      params: {
        url: 'https://heyportals.vercel.app/q/90ca4789-0d81-4a22-a83c-4de26044d00b'
      }
    });

    expect(response.data.oembed.portal.version).toEqual('vLatest');
    expect(response.data.oembed.portal.buttons[0].button).toEqual('Start');
    expect(response.data.oembed.portal.buttons[0].type).toEqual('submit');
  });

  test('should return farcaster frame', async () => {
    const response = await axios.get(`${TEST_URL}/oembed`, {
      params: { url: 'https://punkf.vercel.app/api/p' }
    });

    expect(response.data.oembed.portal.version).toEqual('vNext');
    expect(response.data.oembed.portal.buttons[0].button).toEqual(
      'Gib Random Punk'
    );
    expect(response.data.oembed.portal.buttons[0].type).toEqual('submit');
  });
});
