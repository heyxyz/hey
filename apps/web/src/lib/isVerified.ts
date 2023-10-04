import { IS_MAINNET } from '@hey/data/constants';
import { verifiedMembers } from 'src/store/app';

/**
 * Checks whether a profile is verified or not.
 *
 * @param id The profile id to check.
 * @returns True if the profile is verified, false otherwise.
 */
const isVerified = (id: string): boolean => {
  return IS_MAINNET ? verifiedMembers().includes(id) : false;
};

export default isVerified;
