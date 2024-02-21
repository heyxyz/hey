import { HEY_API_URL } from '@hey/data/constants';
import { describe, expect, test } from 'vitest';

import getLennyURL from './getLennyURL';

describe('getLennyURL', () => {
  test('should return the correct lenny avatar URL', () => {
    const id = '0x0d';
    const expectedURL = `${HEY_API_URL}/avatar?id=${id}`;
    const result = getLennyURL(id);

    expect(result).toBe(expectedURL);
  });
});
