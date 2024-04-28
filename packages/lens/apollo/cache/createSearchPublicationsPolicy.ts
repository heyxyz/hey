import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createSearchPublicationsPolicy = (): FieldPolicy => {
  return cursorBasedPagination([['request', ['where', 'query']]]);
};

export default createSearchPublicationsPolicy;
