import { hydrateVerifiedMembers } from 'src/store/persisted/useVerifiedMembersStore';

/**
 * Checks whether a profile is verified or not.
 *
 * @param id The profile id to check.
 * @returns True if the profile is verified, false otherwise.
 */
const isVerified = (id: string): boolean => {
  const { verifiedMembers } = hydrateVerifiedMembers();

  return verifiedMembers.includes(id);
};

export default isVerified;
