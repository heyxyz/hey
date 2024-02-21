import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('staff-picks/index', () => {
  test('should return all staff picks', async () => {
    const response = await axios.get(`${TEST_URL}/staff-picks`);

    expect(response.data.result).toHaveLength(5);
  });
});
