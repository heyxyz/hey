/**
 * A mapping of token symbols to their respective addresses.
 */
type TokenSymbolMap = Record<string, string>;

/**
 * The addresses of commonly-used tokens on the Polygon.
 */
const TOKEN_SYMBOLS: TokenSymbolMap = {
  DAI: 'DAI',
  USDC: 'USDC',
  USDT: 'USDT',
  WETH: 'ETH',
  WMATIC: 'MATIC'
};

/**
 * Returns the symbol of a given token symbol.
 *
 * @param symbol The symbol of the token.
 * @returns The symbol of the token.
 */
const getAssetSymbol = (symbol: string): null | string => {
  return TOKEN_SYMBOLS[symbol] || null;
};

export default getAssetSymbol;
