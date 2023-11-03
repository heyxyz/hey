import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createFollowingFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['for']]);
};

export default createFollowingFieldPolicy;
