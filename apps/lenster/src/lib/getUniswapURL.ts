import { IS_MAINNET } from 'src/constants';

/**
 *
 * @param amount - Amount to swap
 * @param outputCurrency - Output currency symbol
 * @returns uniswap link
 */
const getUniswapURL = (amount: number, outputCurrency: string): string => {
  return `https://app.uniswap.org/#/swap?exactField=output&exactAmount=${amount}&outputCurrency=${outputCurrency}&chain=${
    IS_MAINNET ? 'polygon' : 'polygon_mumbai'
  }`;
};

export default getUniswapURL;
