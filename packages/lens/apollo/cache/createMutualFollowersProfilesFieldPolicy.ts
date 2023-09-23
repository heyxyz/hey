import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createMutualFollowersProfilesFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['viewing', 'observer']]);
};

export default createMutualFollowersProfilesFieldPolicy;
