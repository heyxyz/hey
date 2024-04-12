import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('frame/post', () => {
  test('should return Lens frame', async () => {
    const response = await axios.post(
      `${TEST_URL}/frame/post`,
      {
        buttonIndex: 1,
        postUrl:
          'https://lens-guestbook-frame.vercel.app/guestbooks/ee8486ff-57bd-4549-8576-d44bae2526b0',
        publicationId: '0x00-0x00'
      },
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.frame.version).toEqual('1.0.0');
    expect(response.data.frame.buttons[0].button).toEqual('Sign Guestbook');
  });
});
