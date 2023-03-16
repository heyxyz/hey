import { MAINNET_DEFAULT_TOKEN } from 'data/contracts';

/**
 *
 * @param symbol - The symbol of the token
 * @returns the address of the token
 */
const getAssetAddress = (symbol: string) => {
  switch (symbol) {
    case 'WMATIC':
      return MAINNET_DEFAULT_TOKEN;
    case 'WETH':
      return '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619';
    case 'USDC':
      return '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';
    case 'DAI':
      return '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063';
    case 'NCT':
      return '0xD838290e877E0188a4A44700463419ED96c16107';
    default:
      return MAINNET_DEFAULT_TOKEN;
  }
};

export default getAssetAddress;
