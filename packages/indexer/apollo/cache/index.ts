import { InMemoryCache } from '@apollo/client';
import result from '../../generated';
import createAccountsFieldPolicy from './createAccountsFieldPolicy';
import createBasicFieldPolicy from './createBasicFieldPolicy';
import createPostReactionsFieldPolicy from './createPostReactionsFieldPolicy';
import createPostReferencesFieldPolicy from './createPostReferencesFieldPolicy';
import createTimelineFieldPolicy from './createTimelineFieldPolicy';
import createWhoReferencedPostFieldPolicy from './createWhoReferencedPostFieldPolicy';

const cache = new InMemoryCache({
  possibleTypes: result.possibleTypes,
  typePolicies: {
    Query: {
      fields: {
        timeline: createTimelineFieldPolicy(),
        posts: createBasicFieldPolicy(),
        postReferences: createPostReferencesFieldPolicy(),
        postReactions: createPostReactionsFieldPolicy(),
        whoReferencedPost: createWhoReferencedPostFieldPolicy(),
        postBookmarks: createBasicFieldPolicy(),
        groups: createBasicFieldPolicy(),
        accounts: createAccountsFieldPolicy(),
        accountsBlocked: createBasicFieldPolicy(),
        accountManagers: createBasicFieldPolicy(),
        authenticatedSessions: createBasicFieldPolicy(),
        usernames: createBasicFieldPolicy(),
        notifications: createBasicFieldPolicy(),
      }
    }
  }
});

export default cache;
