import { HttpLink } from '@apollo/client';
import { APP_NAME, LENS_API_URL } from '@hey/data/constants';
import { v4 as uuid } from 'uuid';

const httpLink = new HttpLink({
  fetch,
  fetchOptions: 'no-cors',
  headers: {
    'x-request-id': uuid(),
    'x-requested-from': APP_NAME.toLowerCase()
  },
  uri: LENS_API_URL
});

export default httpLink;
