import { ApolloClient, from } from '@apollo/client';

import authLink from './authLink';
import cache from './cache';
import httpLink from './httpLink';
import retryLink from './retryLink';

// make useAuthLink optional and default to false
const lensApolloClient = ({ useAuthLink = false } = {}) => {
  const links = useAuthLink
    ? [authLink, retryLink, httpLink]
    : [retryLink, httpLink];

  return new ApolloClient({ link: from(links), cache });
};

export default lensApolloClient;
