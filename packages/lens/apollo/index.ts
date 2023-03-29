import { ApolloCache, ApolloProvider, gql, useApolloClient, useQuery } from '@apollo/client';

import nodeClient from './nodeClient';
import webClient from './webClient';

export { ApolloCache, ApolloProvider, gql, nodeClient, useApolloClient, useQuery, webClient };
