import { ApolloClient, from } from '@apollo/client';

import authLink from './authLink';
import cache from './cache';
import httpLink from './httpLink';
import retryLink from './retryLink';

const lensApolloWebClient = new ApolloClient({
  link: from([authLink, retryLink, httpLink]),
  cache
});

const lensApolloNodeClient = new ApolloClient({
  link: from([retryLink, httpLink]),
  cache
});

export { lensApolloNodeClient, lensApolloWebClient };
