import type { ApolloLink } from "@apollo/client";
import { ApolloClient, from } from "@apollo/client";
import { setVerbosity } from "ts-invariant";
import cache from "./cache";
import httpLink from "./httpLink";
import retryLink from "./retryLink";

setVerbosity((globalThis as any).__DEV__ !== false ? "log" : "silent");

const expoApolloClient = (authLink?: ApolloLink) =>
  new ApolloClient({
    cache,
    link: authLink
      ? from([authLink, retryLink, httpLink])
      : from([retryLink, httpLink])
  });

export default expoApolloClient;
