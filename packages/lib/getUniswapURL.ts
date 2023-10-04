import { IS_MAINNET } from '@hey/data/constants';
import urlcat from 'urlcat';

/**
 * Returns the Uniswap URL for the specified amount and output currency symbol.
 *
 * @param amount The amount to swap.
 * @param outputCurrency The output currency symbol.
 * @returns The Uniswap URL.
 */
const getUniswapURL = (amount: number, outputCurrency: string): string => {
  return urlcat('https://app.uniswap.org/#/swap', {
    exactField: 'output',
    exactAmount: amount,
    outputCurrency,
    chain: IS_MAINNET ? 'polygon' : 'polygon_mumbai'
  });
};

export default getUniswapURL;
