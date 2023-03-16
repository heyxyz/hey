import { expect, test } from '@playwright/test';
import getAppName from 'utils/getAppName';

test.describe('getAppName', async () => {
  test('should capitalize first character and replace hyphen with a space in a string', async () => {
    const inputString = 'my-app';
    const expectedOutput = 'My app';
    await expect(getAppName(inputString)).toBe(expectedOutput);
  });

  test('should handle empty string as input', async () => {
    const inputString = '';
    const expectedOutput = '';
    await expect(getAppName(inputString)).toBe(expectedOutput);
  });

  test('should handle single character as input', async () => {
    const inputString = 'a';
    const expectedOutput = 'A';
    await expect(getAppName(inputString)).toBe(expectedOutput);
  });

  test('should handle input with no hyphens and only a single character', async () => {
    const inputString = 'word';
    const expectedOutput = 'Word';
    await expect(getAppName(inputString)).toBe(expectedOutput);
  });

  test('should handle input with multiple hyphens', async () => {
    const inputString = 'one-two-three-four';
    const expectedOutput = 'One two three four';
    await expect(getAppName(inputString)).toBe(expectedOutput);
  });
});
