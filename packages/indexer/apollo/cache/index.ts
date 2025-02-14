import { InMemoryCache } from '@apollo/client';
import result from '../../generated';
import createPostReactionsFieldPolicy from './createPostReactionsFieldPolicy';
import createPostReferencesFieldPolicy from './createPostReferencesFieldPolicy';
import createPostsFieldPolicy from './createPostsFieldPolicy';

const cache = new InMemoryCache({
  possibleTypes: result.possibleTypes,
  typePolicies: {
    Query: {
      fields: {
        posts: createPostsFieldPolicy(),
        postReferences: createPostReferencesFieldPolicy(),
        postReactions: createPostReactionsFieldPolicy()
      }
    }
  }
});

export default cache;
