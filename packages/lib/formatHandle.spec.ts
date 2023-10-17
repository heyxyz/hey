import { LENSPROTOCOL_HANDLE } from '@hey/data/constants';
import { describe, expect, test } from 'vitest';

import formatHandle from './formatHandle';

describe('formatHandle', () => {
  test('should return empty string when handle is null', () => {
    expect(formatHandle(null)).toBeNull();
  });

  test(`should return ${LENSPROTOCOL_HANDLE} when given handle is ${LENSPROTOCOL_HANDLE}`, () => {
    const output = formatHandle(LENSPROTOCOL_HANDLE);
    expect(output).toBe(LENSPROTOCOL_HANDLE);
  });

  test('should remove handle prefix', () => {
    expect(formatHandle('lens/@username123')).toBe('username123');
  });

  test('should remove handle prefix for namespaces', () => {
    expect(formatHandle('hey/@username123')).toBe('hey/@username123');
  });
});
