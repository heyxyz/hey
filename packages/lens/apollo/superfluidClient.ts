import { ApolloClient, InMemoryCache } from '@apollo/client';

import superfluidLink from './superfluidLink';

const superfluidClient = new ApolloClient({
  link: superfluidLink,
  cache: new InMemoryCache()
});

export default superfluidClient;
