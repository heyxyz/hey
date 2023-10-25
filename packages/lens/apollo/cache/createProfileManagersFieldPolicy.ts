import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createProfileManagersFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['cursor', 'for']]);
};

export default createProfileManagersFieldPolicy;
