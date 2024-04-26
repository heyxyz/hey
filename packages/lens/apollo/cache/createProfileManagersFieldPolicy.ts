import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createProfileManagersFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['for']]);
};

export default createProfileManagersFieldPolicy;
