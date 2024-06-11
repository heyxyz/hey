import axios from 'axios';
import { TEST_URL } from 'src/helpers/constants';
import { describe, expect, test } from 'vitest';

describe('stats/publication/views', () => {
  test('should return publication views', async () => {
    const response = await axios.post(`${TEST_URL}/stats/publication/views`, {
      ids: ['0x01-0x01', '0x01-0x02', '0x01-0x03']
    });

    expect(response.data.views).toHaveLength(3);
  });
});
