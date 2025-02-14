import type { FieldPolicy } from '@apollo/client';
import cursorBasedPagination from '../helpers/cursorBasedPagination';

const createPostBookmarksFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['pageSize']);
};

export default createPostBookmarksFieldPolicy;
