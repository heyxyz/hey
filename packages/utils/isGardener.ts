import { IS_MAINNET } from 'data/constants';
import { mainnetGardeners, testnetGardeners } from 'data/gardeners';

/**
 * Determines whether a given profile ID belongs to a Gardener on the current network.
 *
 * @param id The profile ID to check.
 * @returns True if the given profile ID belongs to a Gardener, false otherwise.
 */
const isGardener = (id: string): boolean =>
  IS_MAINNET ? mainnetGardeners.includes(id) : testnetGardeners.includes(id);

export default isGardener;
