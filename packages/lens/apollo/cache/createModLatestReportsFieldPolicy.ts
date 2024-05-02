import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createModLatestReportsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination([
    'request',
    ['limit', 'forPublication', 'forProfileId']
  ]);
};

export default createModLatestReportsFieldPolicy;
