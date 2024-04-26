import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createMutualFollowersProfilesFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['viewing', 'observer']]);
};

export default createMutualFollowersProfilesFieldPolicy;
