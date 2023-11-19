import { verifiedMembers } from 'src/store/useAppStore';

/**
 * Checks whether a profile is verified or not.
 *
 * @param id The profile id to check.
 * @returns True if the profile is verified, false otherwise.
 */
const isVerified = (id: string): boolean => {
  return verifiedMembers().includes(id);
};

export default isVerified;
