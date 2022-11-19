import { mainnetGardeners, testnetGardeners } from 'data/gardeners';
import { IS_MAINNET } from 'src/constants';

/**
 *
 * @param id - Profile id
 * @returns is gardener or not
 */
const isGardener = (id: string): boolean =>
  IS_MAINNET ? mainnetGardeners.includes(id) : testnetGardeners.includes(id);

export default isGardener;
