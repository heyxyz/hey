import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { LENS_API_URL } from "@hey/data/constants";

const batchLink = new BatchHttpLink({
  uri: LENS_API_URL,
  fetch,
  fetchOptions: "no-cors",
  batchMax: 5,
  headers: { "x-lens-app-hey": "djcmi8NsEhjS5yDr8kTqdLfBrFYNKyjrmH9pcTYp" },
  batchInterval: 200
});

export default batchLink;
