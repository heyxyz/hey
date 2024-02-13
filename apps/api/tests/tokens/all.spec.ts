import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('tokens/all', () => {
  test('should return all tokens', async () => {
    const response = await axios.get(`${TEST_URL}/tokens/all`);

    expect(response.data.tokens).toBeInstanceOf(Array);
    expect(response.data.tokens[response.data.tokens.length - 1].name).toEqual(
      'Wrapped Matic'
    );
  });
});
