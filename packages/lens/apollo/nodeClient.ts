import { ApolloClient, from, InMemoryCache } from '@apollo/client';

import httpLink from './httpLink';

const nodeClient = new ApolloClient({
  link: from([httpLink]),
  cache: new InMemoryCache()
});

export default nodeClient;
