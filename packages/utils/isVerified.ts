import { IS_MAINNET } from 'data/constants';
import { mainnetVerified, testnetVerified } from 'data/verified';

/**
 *
 * @param id - Profile id
 * @returns is verified or not
 */
const isVerified = (id: string): boolean =>
  IS_MAINNET ? mainnetVerified.includes(id) : testnetVerified.includes(id);

export default isVerified;
