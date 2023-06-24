import { describe, expect, test } from 'vitest';

import hasGm from './hasGm';

describe('hasGm', () => {
  test('should return true if the inputText contains the word gm', () => {
    const input = 'hello gm';
    const output = hasGm(input);
    expect(output).toBeTruthy();
  });

  test('should return true if the inputText contains the word gm (case sensitive)', () => {
    const input = 'gm is great';
    const output = hasGm(input);
    expect(output).toBeTruthy();
  });

  test('should return false if the inputText does not contain the word gm', () => {
    const input = 'this is a test without';
    const output = hasGm(input);
    expect(output).toBeFalsy();
  });
});
