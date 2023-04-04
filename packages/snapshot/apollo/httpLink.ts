import { HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'https://hub.snapshot.org/graphql',
  fetchOptions: 'no-cors',
  fetch
});

export default httpLink;
