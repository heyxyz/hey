import { HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'https://api.zora.co/graphql',
  fetchOptions: 'no-cors',
  fetch
});

export default httpLink;
