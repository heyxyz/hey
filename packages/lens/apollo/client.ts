import type { ApolloLink } from '@apollo/client';
import { ApolloClient, from } from '@apollo/client';

import cache from './cache';
import httpLink from './httpLink';
import retryLink from './retryLink';

const lensApolloClient = (authLink?: ApolloLink) =>
  new ApolloClient({
    link: authLink
      ? from([authLink, retryLink, httpLink])
      : from([retryLink, httpLink]),
    cache
  });

export default lensApolloClient;
