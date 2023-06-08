import { ApolloClient, from, HttpLink } from '@apollo/client';

import {
  MAINNET_SNAPSHOT_HUB_URL,
  TESTNET_SNAPSHOT_HUB_URL
} from '../constants';
import cache from './cache';
import retryLink from './retryLink';

const client = (isMainnet: boolean): ApolloClient<any> => {
  return new ApolloClient({
    link: from([
      retryLink,
      new HttpLink({
        uri: `${
          isMainnet ? MAINNET_SNAPSHOT_HUB_URL : TESTNET_SNAPSHOT_HUB_URL
        }/graphql`,
        fetchOptions: 'no-cors',
        fetch
      })
    ]),
    cache: cache
  });
};

export default client;
