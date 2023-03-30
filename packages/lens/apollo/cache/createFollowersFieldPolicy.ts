import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createFollowersFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['profileId']]);
};

export default createFollowersFieldPolicy;
