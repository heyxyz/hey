import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('stats/publicationViews', () => {
  test('should return publication views', async () => {
    const response = await axios.post(`${TEST_URL}/stats/publicationViews`, {
      ids: ['0x01-0x01', '0x01-0x02', '0x01-0x03']
    });

    expect(response.data.views).toHaveLength(3);
  });
});
