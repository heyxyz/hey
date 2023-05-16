import { ApolloClient, from } from '@apollo/client';

import authLink from './authLink';
import cache from './cache';
import httpLink from './httpLink';
import retryLink from './retryLink';

const webClient = new ApolloClient({
  link: from([authLink, retryLink, httpLink]),
  cache: cache
});

export default webClient;
