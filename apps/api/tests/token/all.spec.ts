import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('token/all', () => {
  test('should return all tokens', async () => {
    const response = await axios.get(`${TEST_URL}/token/all`);

    expect(response.data.tokens).toHaveLength(5);
    expect(response.data.tokens[0].name).toEqual('Wrapped Matic');
  });
});
