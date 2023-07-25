import { IS_MAINNET } from '@lenster/data/constants';
import { verified } from '@lenster/data/verified';

/**
 * Checks whether a profile is verified or not.
 *
 * @param id The profile id to check.
 * @returns True if the profile is verified, false otherwise.
 */
const isVerified = (id: string): boolean =>
  IS_MAINNET ? verified.includes(id) : false;

export default isVerified;
