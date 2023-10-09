import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createWhoCollectedPublicationFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination([['request', ['where', 'on']]]);
};

export default createWhoCollectedPublicationFieldPolicy;
