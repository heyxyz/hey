import type { FieldPolicy } from '@apollo/client';
import cursorBasedPagination from '../helpers/cursorBasedPagination';

const createPostsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(["request", ['filter', 'forFeeds']]);
};

export default createPostsFieldPolicy;
