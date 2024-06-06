import { GOOD_API_URL } from '@good/data/constants';
import { describe, expect, test } from 'vitest';

import getLennyURL from './getLennyURL';

describe('getLennyURL', () => {
  test('should return the correct lenny avatar URL', () => {
    const id = '0x0d';
    const expectedURL = `${GOOD_API_URL}/avatar?id=${id}`;
    const result = getLennyURL(id);

    expect(result).toBe(expectedURL);
  });
});
