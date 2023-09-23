import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createFollowersFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['of']]);
};

export default createFollowersFieldPolicy;
