import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('metadata/index', () => {
  test('should return ens names', async () => {
    const response = await axios.post(`${TEST_URL}/metadata`, {
      ping: 'pong'
    });

    expect(response.data.id).toHaveLength(43);
  });
});
