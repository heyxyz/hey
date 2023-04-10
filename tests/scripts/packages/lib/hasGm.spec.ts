import { expect, test } from '@playwright/test';
import hasGm from 'lib/hasGm';

test.describe('hasGm', () => {
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
