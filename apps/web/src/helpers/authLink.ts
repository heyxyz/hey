import { ApolloLink, fromPromise, toPromise } from "@apollo/client";
import { LENS_API_URL } from "@hey/data/constants";
import parseJwt from "@hey/helpers/parseJwt";
import axios from "axios";
import {
  hydrateAuthTokens,
  signIn,
  signOut
} from "src/store/persisted/useAuthStore";

const REFRESH_AUTHENTICATION_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      ... on AuthenticationTokens {
        accessToken
        refreshToken
        idToken
      }
    }
  }
`;

const authLink = new ApolloLink((operation, forward) => {
  const { accessToken, refreshToken } = hydrateAuthTokens();

  if (!accessToken || !refreshToken) {
    signOut();
    return forward(operation);
  }

  const tokenData = parseJwt(accessToken);
  const expiringSoon = tokenData?.exp
    ? Date.now() >= tokenData.exp * 1000 - 2 * 60 * 1000
    : true;

  if (!expiringSoon) {
    operation.setContext({
      headers: { "X-Access-Token": accessToken || "" }
    });

    return forward(operation);
  }

  return fromPromise(
    axios
      .post(
        LENS_API_URL,
        {
          operationName: "Refresh",
          query: REFRESH_AUTHENTICATION_MUTATION,
          variables: { request: { refreshToken } }
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .then(({ data }) => {
        const accessToken = data?.data?.refresh?.accessToken;
        const refreshToken = data?.data?.refresh?.refreshToken;
        const idToken = data?.data?.refresh?.idToken;
        operation.setContext({ headers: { "X-Access-Token": accessToken } });
        signIn({ accessToken, idToken, refreshToken });

        return toPromise(forward(operation));
      })
      .catch(() => {
        return toPromise(forward(operation));
      })
  );
});

export default authLink;
