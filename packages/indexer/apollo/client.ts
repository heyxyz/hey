import type { ApolloLink } from "@apollo/client";
import { ApolloClient, InMemoryCache, from } from "@apollo/client";
import httpLink from "./httpLink";
import retryLink from "./retryLink";

const apolloClient = (authLink?: ApolloLink) =>
  new ApolloClient({
    cache: new InMemoryCache(),
    connectToDevTools: true,
    link: authLink
      ? from([authLink, retryLink, httpLink])
      : from([retryLink, httpLink])
  });

export default apolloClient;
