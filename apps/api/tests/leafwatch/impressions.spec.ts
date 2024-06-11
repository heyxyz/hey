import axios from 'axios';
import { TEST_URL } from 'src/helpers/constants';
import { describe, expect, test } from 'vitest';

describe('leafwatch/impressions', () => {
  test('should push impressions to leafwatch', async () => {
    const response = await axios.post(`${TEST_URL}/leafwatch/impressions`, {
      ids: ['0x0d-0x01', '0x0d-0x02'],
      viewer_id: '0x0d'
    });

    expect(response.data.id).toHaveLength(36);
  });
});
