/**
 *
 * @param symbol - The symbol of the token
 * @returns the address and decimal of the token
 */
const getChainlinkAddress = (symbol: string) => {
  switch (symbol) {
    case 'WMATIC':
      return {
        decimals: 10 ** 8,
        address: '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0'
      };
    case 'WETH':
      return {
        decimals: 10 ** 8,
        address: '0xF9680D99D6C9589e2a93a78A04A279e509205945'
      };
    default:
      return {
        decimals: 10 ** 8,
        address: '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0'
      };
  }
};

export default getChainlinkAddress;
