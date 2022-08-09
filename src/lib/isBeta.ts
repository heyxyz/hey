import { Profile } from '@generated/types';

import getAttribute from './getAttribute';

const isBeta = (profile: Profile): boolean => getAttribute(profile?.attributes, 'isBeta') === 'true';

export default isBeta;
