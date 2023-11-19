import { TEST_ENDPOINT } from '@utils/constants';
import axios from 'axios';
import urlcat from 'urlcat';
import { describe, expect, test } from 'vitest';

describe('preference/getHeyMemberNftStatus', () => {
  test('should return hey member nft status', async () => {
    const { data } = await axios.get(
      urlcat(TEST_ENDPOINT, '/preference/getHeyMemberNftStatus', {
        id: '0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF'
      })
    );
    expect(data.result.dismissedOrMinted).toBeTruthy();
  });
});
