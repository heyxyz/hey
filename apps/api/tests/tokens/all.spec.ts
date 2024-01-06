import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('tokens/all', () => {
  test('should return all tokens', async () => {
    const response = await axios.get(`${TEST_URL}/tokens/all`);

    expect(response.data.tokens).toBeInstanceOf(Array);
    expect(response.data.tokens[0].name).toEqual('Wrapped Matic');
  });
});
