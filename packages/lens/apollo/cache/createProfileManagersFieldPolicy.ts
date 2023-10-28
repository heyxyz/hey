import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createProfileManagersFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['for']]);
};

export default createProfileManagersFieldPolicy;
