import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createModFollowersFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['limit']]);
};

export default createModFollowersFieldPolicy;
