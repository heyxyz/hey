import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createSearchPublicationsPolicy = (): FieldPolicy => {
  return cursorBasedPagination([['request', ['where', 'query']]]);
};

export default createSearchPublicationsPolicy;
