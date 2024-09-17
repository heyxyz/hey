import axios from "axios";

/**
 * Get the price of a token from Redstone API based on symbol.
 *
 * @param address The address of the token.
 * @returns The price of the token, or 0 if the API call fails.
 */
const getRedstonePrice = async (symbol: null | string) => {
  if (!symbol) {
    return 0;
  }

  try {
    const response = await axios.get("https://api.redstone.finance/prices", {
      params: { limit: 1, provider: "redstone", symbol }
    });

    return response.data[0].value;
  } catch {
    return 0;
  }
};

export default getRedstonePrice;
