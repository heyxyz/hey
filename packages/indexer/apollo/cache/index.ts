import { InMemoryCache } from '@apollo/client';
import result from '../../generated';
import createPostBookmarksFieldPolicy from './createPostBookmarksFieldPolicy';
import createPostReactionsFieldPolicy from './createPostReactionsFieldPolicy';
import createPostReferencesFieldPolicy from './createPostReferencesFieldPolicy';
import createPostsFieldPolicy from './createPostsFieldPolicy';
import createTimelineFieldPolicy from './createTimelineFieldPolicy';
import createWhoReferencedPostFieldPolicy from './createWhoReferencedPostFieldPolicy';

const cache = new InMemoryCache({
  possibleTypes: result.possibleTypes,
  typePolicies: {
    Query: {
      fields: {
        timeline: createTimelineFieldPolicy(),
        posts: createPostsFieldPolicy(),
        postReferences: createPostReferencesFieldPolicy(),
        postReactions: createPostReactionsFieldPolicy(),
        whoReferencedPost: createWhoReferencedPostFieldPolicy(),
        postBookmarks: createPostBookmarksFieldPolicy(),
      }
    }
  }
});

export default cache;
