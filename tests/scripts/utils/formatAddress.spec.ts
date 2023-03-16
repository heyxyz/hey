import { expect, test } from '@playwright/test';
import formatAddress from 'utils/formatAddress';

test.describe('formatAddress', async () => {
  test('returns an empty string if null is passed in', async () => {
    const result = formatAddress(null);
    await expect(result).toBe('');
  });

  test('matches the expected format and shortens middle characters with ellipsis', async () => {
    const result = formatAddress('0x7b9AB70D065f7bA8c57bC819B10E35DdB7A41008');
    // should shorten address so it only shows first 4 characters and last 4
    await expect(result).toBe('0x7b…1008');
  });

  test('matches the expected format with 5 on each side and shortens middle characters with ellipsis', async () => {
    const result = formatAddress('0x7b9AB70D065f7bA8c57bC819B10E35DdB7A41008', 5);
    // should shorten address so it only shows first 4 characters and last 4
    await expect(result).toBe('0x7b9…41008');
  });

  test("doesn't make any modifications if the address doesn't match the regex", async () => {
    const input = 'not-an-address';
    const result = formatAddress(input);

    await expect(result).toBe(input);
  });
});
