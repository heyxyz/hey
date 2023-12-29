import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('nft/unlonely/getUnlonelyNfc', async () => {
  test('should return unlonely nfc', async () => {
    const response = await axios.get(
      `${TEST_URL}/nft/unlonely/getUnlonelyNfc`,
      { params: { id: 700 } }
    );

    expect(response.data.nfc.id).toEqual('700');
    expect(response.data.nfc.title).toEqual('supercast is cool');
  });
});
