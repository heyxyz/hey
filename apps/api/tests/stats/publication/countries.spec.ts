import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('stats/publication/countries', () => {
  test('should return publication views', async () => {
    const response = await axios.get(
      `${TEST_URL}/stats/publication/countries`,
      { params: { id: '0x01-0x01' } }
    );

    expect(response.data.result).toBeInstanceOf(Array);
  });
});
