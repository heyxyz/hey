import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createMutualFollowersProfilesFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination([
    'request',
    ['viewingProfileId', 'yourProfileId', 'limit']
  ]);
};

export default createMutualFollowersProfilesFieldPolicy;
