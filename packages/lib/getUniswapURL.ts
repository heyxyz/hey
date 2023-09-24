import { IS_MAINNET } from '@lenster/data/constants';

/**
 * Returns the Uniswap URL for the specified amount and output currency symbol.
 *
 * @param amount The amount to swap.
 * @param outputCurrency The output currency symbol.
 * @returns The Uniswap URL.
 */
const getUniswapURL = (amount: number, outputCurrency: string): string => {
  const chain = IS_MAINNET ? 'polygon' : 'polygon_mumbai';
  return `https://app.uniswap.org/#/swap?exactField=output&exactAmount=${amount}&outputCurrency=${outputCurrency}&chain=${chain}`;
};

export default getUniswapURL;
