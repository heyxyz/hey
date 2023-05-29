import axios from 'axios';

/**
 * Get the price of a token from Coingecko API based on its address on the Polygon network.
 *
 * @param address The address of the token.
 * @returns The price of the token, or 0 if the API call fails.
 */
const getCoingeckoPrice = async (address: string) => {
  try {
    const response = await axios(
      'https://api.coingecko.com/api/v3/simple/token_price/polygon-pos',
      {
        params: {
          contract_addresses: address,
          vs_currencies: 'usd'
        }
      }
    );

    return response.data[address].usd;
  } catch (error) {
    console.error('Failed to get price from Coingecko API', error);
    return 0;
  }
};

export default getCoingeckoPrice;
