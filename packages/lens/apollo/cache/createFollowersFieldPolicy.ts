import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createFollowersFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['of']]);
};

export default createFollowersFieldPolicy;
