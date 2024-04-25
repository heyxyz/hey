import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createModLatestReportsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination([
    'request',
    ['limit', 'forPublication', 'forProfileId']
  ]);
};

export default createModLatestReportsFieldPolicy;
