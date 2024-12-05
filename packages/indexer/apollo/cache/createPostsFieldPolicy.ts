import type { FieldPolicy } from '@apollo/client';
import cursorBasedPagination from '../helpers/cursorBasedPagination';

const createPostsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['filter', 'forFeeds']);
};

export default createPostsFieldPolicy;
