import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createProfilesFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['where']]);
};

export default createProfilesFieldPolicy;
