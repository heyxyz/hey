import { InMemoryCache } from '@apollo/client';
import result from '../../generated';
import createPostsFieldPolicy from './createPostsFieldPolicy';

const cache = new InMemoryCache({
  possibleTypes: result.possibleTypes,
  typePolicies: {
    Query: {
      fields: {
        posts: createPostsFieldPolicy()
      }
    }
  }
});

export default cache;
