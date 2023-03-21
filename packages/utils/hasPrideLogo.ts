import type { Profile } from 'lens';
import getProfileAttribute from 'utils/getProfileAttribute';

/**
 *
 * @param profile Profile object
 * @returns hasPrideLogo attribute
 */
const hasPrideLogo = (profile: Profile): boolean =>
  getProfileAttribute(profile?.attributes, 'hasPrideLogo') === 'true';

export default hasPrideLogo;
