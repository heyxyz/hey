import { HttpLink } from "@apollo/client";
import { LENS_API_URL } from "@hey/data/constants";

const httpLink = new HttpLink({
  fetch,
  fetchOptions: "no-cors",
  uri: LENS_API_URL
});

export default httpLink;
