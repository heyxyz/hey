import type { Profile } from 'lens';
import getProfileAttribute from 'utils/getProfileAttribute';

/**
 * Returns true if the specified profile has the "hasPrideLogo" attribute set to true.
 * @param profile - The profile object.
 * @returns True if the profile has the "hasPrideLogo" attribute set to true, false otherwise.
 */
const hasPrideLogo = (profile: Profile): boolean =>
  getProfileAttribute(profile?.attributes, 'hasPrideLogo') === 'true';

export default hasPrideLogo;
