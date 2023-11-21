import { TEST_ENDPOINT } from '@utils/constants';
import axios from 'axios';
import urlcat from 'urlcat';
import { describe, expect, test } from 'vitest';

describe('ipfs/pin', () => {
  test('should pin on lens ipfs', async () => {
    const cid = 'bafybeid7g3owl4owey7qjfcjfx7acmmimhaxtqka4pgt7tphcgqo5dwznu';
    const { data } = await axios.post(
      urlcat(TEST_ENDPOINT, '/ipfs/pin', { cid })
    );
    expect(data.cid).toBe(cid);
  });
});
