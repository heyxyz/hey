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
        postUrl: '', // TODO: Lens Open Frame with of:accepts:lens tag
        publicationId: '0x00-0x00'
      },
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.portal.version).toEqual('vLatest');
    expect(response.data.portal.buttons[0].button).toEqual('A');
    expect(response.data.portal.buttons[0].action).toEqual('post');
  });
});
