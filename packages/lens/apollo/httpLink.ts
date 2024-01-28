import { HttpLink } from '@apollo/client';
import { APP_NAME, LENS_API_URL } from '@hey/data/constants';

const httpLink = new HttpLink({
  fetch,
  fetchOptions: 'no-cors',
  headers: {
    'x-requested-from': APP_NAME.toLowerCase()
  },
  uri: LENS_API_URL
});

export default httpLink;
