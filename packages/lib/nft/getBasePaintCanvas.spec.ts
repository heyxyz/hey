import { describe, expect, test } from 'vitest';

import getBasePaintCanvas from './getBasePaintCanvas';

describe('getBasePaintCanvas', () => {
  test('should return basepaint canvas id', () => {
    expect(getBasePaintCanvas('https://basepaint.art/mint/44')).contains({
      id: 44
    });
  });

  test('should return null if no basepaint canvas id is found', () => {
    expect(getBasePaintCanvas('https://basepaint.art/mint/')).toBeNull();
  });
});
