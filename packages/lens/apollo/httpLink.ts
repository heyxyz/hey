import { HttpLink } from '@apollo/client';
import { LENS_API_URL } from '@hey/data/constants';

const httpLink = new HttpLink({
  uri: LENS_API_URL,
  fetchOptions: 'no-cors',
  fetch
});

export default httpLink;
