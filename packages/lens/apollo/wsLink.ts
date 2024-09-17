import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { LENS_API_URL } from "@hey/data/constants";
import { createClient } from "graphql-ws";

const wsLink = new GraphQLWsLink(
  createClient({
    keepAlive: 10000,
    url: LENS_API_URL.replace("http", "ws")
  })
);

export default wsLink;
