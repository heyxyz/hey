import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createPublicationsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination([['request', ['where', 'orderBy']]]);
};

export default createPublicationsFieldPolicy;
