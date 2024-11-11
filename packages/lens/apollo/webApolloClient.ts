import type { ApolloLink } from "@apollo/client";
import { ApolloClient, from, split } from "@apollo/client";
import cache from "./cache";
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

const webApolloClient = (authLink?: ApolloLink) =>
  new ApolloClient({
    cache,
    link: authLink
      ? from([authLink, retryLink, requestLink])
      : from([retryLink, httpLink])
  });

export default webApolloClient;
