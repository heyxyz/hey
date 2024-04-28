import { describe, expect, test } from 'vitest';

import getUniswapQuote from './getUniswapQuote';

describe('getUniswapQuote', () => {
  test('should return the correct uniswap quote', async () => {
    const tokenIn = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270';
    const tokenOut = '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359';
    const amount = 5;
    const chainId = 137;
    const result = await getUniswapQuote(tokenIn, tokenOut, amount, chainId);

    expect(result.amountOut).toBeTypeOf('string');
    expect(result.maxSlippage).toBeTypeOf('string');
    expect(result.routeString).contains('WMATIC --');
    expect(result.routeString).contains('--> USDC');
  });
});
