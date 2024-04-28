import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createActedOnPublicationFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination([['request', ['where', 'on']]]);
};

export default createActedOnPublicationFieldPolicy;
