import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createNotificationsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['where']]);
};

export default createNotificationsFieldPolicy;
