import { ApolloClient, from } from '@apollo/client';

import cache from './cache';
import httpLink from './httpLink';
import retryLink from './retryLink';

const webClient = new ApolloClient({
  link: from([retryLink, httpLink]),
  cache: cache
});

export default webClient;
