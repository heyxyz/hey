import { TOKEN_SYMBOLS } from '@hey/data/tokens-symbols';

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
