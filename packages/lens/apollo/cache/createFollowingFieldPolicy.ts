import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createFollowingFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['for']]);
};

export default createFollowingFieldPolicy;
