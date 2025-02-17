import type { FieldPolicy } from '@apollo/client';
import cursorBasedPagination from '../helpers/cursorBasedPagination';

const createPostBookmarksFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(["request", ["pageSize"]]);
};

export default createPostBookmarksFieldPolicy;
