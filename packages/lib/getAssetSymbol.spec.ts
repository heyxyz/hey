import { describe, expect, test } from 'vitest';

import getAssetSymbol from './getAssetSymbol';

describe('getAssetSymbol', () => {
  test('should return MATIC for WMATIC', () => {
    const symbol = 'WMATIC';
    const result = getAssetSymbol(symbol);
    expect(result).toEqual('MATIC');
  });

  test('should return ETH for WETH', () => {
    const symbol = 'WETH';
    const result = getAssetSymbol(symbol);
    expect(result).toEqual('ETH');
  });

  test('should return USDC for USDC', () => {
    const symbol = 'USDC';
    const result = getAssetSymbol(symbol);
    expect(result).toEqual('USDC');
  });
});
