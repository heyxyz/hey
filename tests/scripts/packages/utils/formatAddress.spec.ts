import { expect, test } from '@playwright/test';
import formatAddress from 'lib/formatAddress';

test.describe('formatAddress', () => {
  test('should return an empty string if null is passed in', () => {
    const result = formatAddress(null);
    expect(result).toBe('');
  });

  test('should match the expected format and shortens middle characters with ellipsis', () => {
    const result = formatAddress('0x7b9AB70D065f7bA8c57bC819B10E35DdB7A41008');
    // should shorten address so it only shows first 4 characters and last 4
    expect(result).toBe('0x7b9A…1008');
  });

  test('should match the expected format with 5 on each side and shortens middle characters with ellipsis', () => {
    const result = formatAddress('0x7b9AB70D065f7bA8c57bC819B10E35DdB7A41008', 5);
    // should shorten address so it only shows first 4 characters and last 4
    expect(result).toBe('0x7b9A…41008');
  });

  test("doesn't make any modifications if the address doesn't match the regex", () => {
    const input = 'not-an-address';
    const result = formatAddress(input);

    expect(result).toBe(input);
  });
});
