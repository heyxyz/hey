import { expect, test } from '@playwright/test';
import getUniswapURL from 'lib/getUniswapURL';

test.describe('getUniswapURL', () => {
  test('should return a valid URL', () => {
    const amount = 123.45;
    const outputCurrency = '0x0123456789abcdef';
    const expectedURL =
      'https://app.uniswap.org/#/swap?exactField=output&exactAmount=123.45&outputCurrency=0x0123456789abcdef&chain=polygon';
    const result = getUniswapURL(amount, outputCurrency);
    expect(result).toBe(expectedURL);
  });

  test('should handle zero amount', () => {
    const amount = 0;
    const outputCurrency = '0x0123456789abcdef';
    const expectedURL =
      'https://app.uniswap.org/#/swap?exactField=output&exactAmount=0&outputCurrency=0x0123456789abcdef&chain=polygon';
    const result = getUniswapURL(amount, outputCurrency);
    expect(result).toBe(expectedURL);
  });

  test('should handle empty output currency', () => {
    const amount = 123.45;
    const outputCurrency = '';
    // Note: The resulting URL will still contain "&outputCurrency=", but with an empty value.
    const expectedURL =
      'https://app.uniswap.org/#/swap?exactField=output&exactAmount=123.45&outputCurrency=&chain=polygon';
    const result = getUniswapURL(amount, outputCurrency);
    expect(result).toBe(expectedURL);
  });
});
