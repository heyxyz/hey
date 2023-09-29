import { describe, expect, test } from 'vitest';

import { TEST_URL } from '../constants';

describe('getBasePaintCanvas', () => {
  test('should return valid basepaint nft response if id is provided', async () => {
    const getRequest = await fetch(`${TEST_URL}/basepaint?id=44`);
    const response: any = await getRequest.json();

    expect(response.success).toBeTruthy();
    expect(response.canContribute).toBeFalsy();
    expect(response.canMint).toBeFalsy();
    expect(response.canvas.theme).toBe('Lens Garden');
  });
});
