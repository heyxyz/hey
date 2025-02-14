import type { FieldPolicy } from '@apollo/client';
import cursorBasedPagination from '../helpers/cursorBasedPagination';

const createWhoReferencedPostFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['post', 'referenceTypes']);
};

export default createWhoReferencedPostFieldPolicy;
