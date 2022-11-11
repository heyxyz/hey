import axios from 'axios';

/**
 *
 * @param address - The address of the token
 * @returns the price of the token
 */
const getCoingeckoPrice = async (address: string) => {
  try {
    const response = await axios('https://api.coingecko.com/api/v3/simple/token_price/polygon-pos', {
      method: 'GET',
      params: {
        contract_addresses: address,
        vs_currencies: 'usd'
      }
    });

    return response.data[address].usd;
  } catch {
    return 0;
  }
};

export default getCoingeckoPrice;
