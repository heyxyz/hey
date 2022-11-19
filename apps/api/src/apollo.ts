import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client';

import { API_URL } from './constants';

const httpLink = new HttpLink({
  uri: API_URL,
  fetchOptions: 'no-cors',
  fetch
});

const client = new ApolloClient({
  link: from([httpLink]),
  cache: new InMemoryCache({})
});

export default client;
