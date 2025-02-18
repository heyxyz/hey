import type { ApolloLink } from "@apollo/client";
import { ApolloClient, from } from "@apollo/client";
import batchLink from "./batchLink";
import cache from "./cache";
import retryLink from "./retryLink";

const apolloClient = (authLink: ApolloLink) =>
  new ApolloClient({
    cache,
    connectToDevTools: true,
    link: from([authLink, retryLink, batchLink])
  });

export default apolloClient;
