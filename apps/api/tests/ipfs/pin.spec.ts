import { TEST_ENDPOINT } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('ipfs/pin', () => {
  test('should pin on lens ipfs', async () => {
    const cid = 'bafybeid7g3owl4owey7qjfcjfx7acmmimhaxtqka4pgt7tphcgqo5dwznu';
    const response = axios.get(`${TEST_ENDPOINT}/ipfs/pin`, {
      params: { cid }
    });
    expect((await response).data.cid).toBe(cid);
  });
});
