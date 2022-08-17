import { Profile } from '@generated/types';

import getAttribute from './getAttribute';

/**
 *
 * @param profile - Profile object
 * @returns isBeta attribute
 */
const isBeta = (profile: Profile): boolean => getAttribute(profile?.attributes, 'isBeta') === 'true';

export default isBeta;
