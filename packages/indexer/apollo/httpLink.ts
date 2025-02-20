import { HttpLink } from "@apollo/client";
import { LENS_API_URL } from "@hey/data/constants";

const httpLink = new HttpLink({
  uri: LENS_API_URL,
  fetch,
  fetchOptions: "no-cors",
  headers: { "x-lens-app-hey": "djcmi8NsEhjS5yDr8kTqdLfBrFYNKyjrmH9pcTYp" }
});

export default httpLink;
