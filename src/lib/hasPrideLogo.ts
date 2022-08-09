import { Profile } from '@generated/types';

import getAttribute from './getAttribute';

const hasPrideLogo = (profile: Profile): boolean =>
  getAttribute(profile?.attributes, 'hasPrideLogo') === 'true';

export default hasPrideLogo;
