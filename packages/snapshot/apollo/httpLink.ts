import { HttpLink } from '@apollo/client';
import { SNAPSHOT_HUB_URL } from 'data';

const httpLink = new HttpLink({
  uri: `${SNAPSHOT_HUB_URL}/graphql`,
  fetchOptions: 'no-cors',
  fetch
});

export default httpLink;
