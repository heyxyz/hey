import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createSearchProfilesFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination([['request', ['where', 'query']]]);
};

export default createSearchProfilesFieldPolicy;
