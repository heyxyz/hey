import type { ApolloLink } from "@apollo/client";
import { ApolloClient, InMemoryCache, from, split } from "@apollo/client";
import httpLink from "./httpLink";
import retryLink from "./retryLink";
import wsLink from "./wsLink";

const requestLink = split(
  ({ query }) => {
    const { kind, operation } = query.definitions[0] as any;
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const apolloClient = (authLink?: ApolloLink) =>
  new ApolloClient({
    cache: new InMemoryCache(),
    connectToDevTools: true,
    link: authLink
      ? from([authLink, retryLink, requestLink])
      : from([retryLink, httpLink])
  });

export default apolloClient;
