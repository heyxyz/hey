import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createNotificationsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination([
    'request',
    ['profileId', 'notificationTypes', 'highSignalFilter']
  ]);
};

export default createNotificationsFieldPolicy;
