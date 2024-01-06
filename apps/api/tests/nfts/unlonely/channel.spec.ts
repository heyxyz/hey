import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('nfts/unlonely/channel', async () => {
  test('should return unlonely channel', async () => {
    const response = await axios.get(`${TEST_URL}/nfts/unlonely/channel`, {
      params: { slug: 'pixelnunc' }
    });

    expect(response.data.channel.id).toEqual('145');
    expect(response.data.channel.slug).toEqual('pixelnunc');
  });
});
