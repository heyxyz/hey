import { TEST_LENS_ID } from '@good/data/constants';
import getAuthApiHeadersForTest from '@good/helpers/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/helpers/constants';
import { describe, expect, test } from 'vitest';

describe('drafts/update', () => {
  const collectModule = {
    amount: null,
    collectLimit: null,
    endsAt: '2024-05-17T14:32:36Z',
    followerOnly: true,
    recipient: null,
    recipients: [],
    referralFee: 0,
    type: 'SimpleCollectOpenActionModule'
  };
  const payload = {
    collectModule: JSON.stringify(collectModule),
    content: 'This is a draft',
    id: null
  };

  test('should create a draft', async () => {
    const response = await axios.post(
      `${TEST_URL}/drafts/update`,
      { ...payload, id: null },
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.result.content).toEqual(payload.content);
    expect(response.data.result.profileId).toEqual(TEST_LENS_ID);
  });

  test('should fail to create draft if not authenticated', async () => {
    try {
      const response = await axios.post(`${TEST_URL}/drafts/update`, {
        ...payload,
        id: null
      });

      expect(response.status).toEqual(401);
    } catch {}
  });
});
