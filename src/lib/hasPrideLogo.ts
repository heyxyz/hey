import type { Profile } from '@generated/types';

import getAttribute from './getAttribute';

/**
 *
 * @param profile - Profile object
 * @returns hasPrideLogo attribute
 */
const hasPrideLogo = (profile: Profile): boolean =>
  getAttribute(profile?.attributes, 'hasPrideLogo') === 'true';

export default hasPrideLogo;
