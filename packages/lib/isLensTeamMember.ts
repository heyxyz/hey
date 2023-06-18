import { mainnetLensTeamMembers } from '@lenster/data';

/**
 * Checks whether a profile is a Lens team member or not.
 *
 * @param id The profile id to check.
 * @returns True if the profile is a Lens team member, false otherwise.
 */
const isLensTeamMember = (id: string): boolean =>
  mainnetLensTeamMembers.includes(id);

export default isLensTeamMember;
