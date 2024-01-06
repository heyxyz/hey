import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('nfts/getBasePaintCanvas', async () => {
  test('should return basepaint canvas', async () => {
    const response = await axios.get(`${TEST_URL}/nfts/getBasePaintCanvas`, {
      params: { id: 44 }
    });

    expect(response.data.canvas.canContribute).toBeFalsy();
    expect(response.data.canvas.theme).toEqual('Lens Garden');
    expect(response.data.canvas.contributions).toHaveLength(645);
  });
});
