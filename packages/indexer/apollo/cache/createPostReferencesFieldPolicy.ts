import type { FieldPolicy } from '@apollo/client';
import cursorBasedPagination from '../helpers/cursorBasedPagination';

const createPostReferencesFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['referencedPost', 'referenceTypes', 'visibilityFilter']);
};

export default createPostReferencesFieldPolicy;
