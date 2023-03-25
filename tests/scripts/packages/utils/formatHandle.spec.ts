import { expect, test } from '@playwright/test';
import { LENSPROTOCOL_HANDLE } from 'data/constants';
import formatHandle from 'lib/formatHandle';

test.describe('formatHandle', () => {
  test('should return empty string when handle is null', () => {
    expect(formatHandle(null)).toBe('');
  });

  test(`should return ${LENSPROTOCOL_HANDLE} when given handle is ${LENSPROTOCOL_HANDLE}`, () => {
    const output = formatHandle(LENSPROTOCOL_HANDLE);
    expect(output).toBe(LENSPROTOCOL_HANDLE);
  });

  test('should add handle suffix when keepSuffix is true and suffix not present', () => {
    expect(formatHandle('username123', true)).toBe('username123.lens');
  });

  test('should remove handle suffix when keepSuffix is false and suffix present', () => {
    expect(formatHandle('username123.lens', false)).toBe('username123');
  });

  test('should not modify handle when keepSuffix is false and suffix not present', () => {
    expect(formatHandle('username123', false)).toBe('username123');
  });

  test('should keep handle suffix when keepSuffix is true and suffix present', () => {
    expect(formatHandle('username123.lens', true)).toBe('username123.lens');
  });
});
