import { STATIC_ASSETS } from 'src/constants';

/**
 *
 * @param symbol - Token symbol
 * @returns token image url
 */
const getTokenImage = (symbol: string): string => `${STATIC_ASSETS}/tokens/${symbol?.toLowerCase()}.svg`;

export default getTokenImage;
