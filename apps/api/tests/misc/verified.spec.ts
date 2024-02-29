import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('misc/verified', () => {
  test('should return all verified users', async () => {
    const response = await axios.get(`${TEST_URL}/misc/verified`);

    expect(response.data.result).toHaveLength(6);
  });
});
