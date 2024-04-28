import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createSearchProfilesFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination([['request', ['where', 'query']]]);
};

export default createSearchProfilesFieldPolicy;
