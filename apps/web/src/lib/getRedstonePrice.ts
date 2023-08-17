import axios from 'axios';

/**
 * Get the price of a token from Redstone API based on symbol.
 *
 * @param address The address of the token.
 * @returns The price of the token, or 0 if the API call fails.
 */
const getRedstonePrice = async (symbol: string) => {
  try {
    const response = await axios('https://api.redstone.finance/prices', {
      params: {
        symbol,
        provider: 'redstone',
        limit: 1
      }
    });

    return response.data[0].value;
  } catch {
    return 0;
  }
};

export default getRedstonePrice;
