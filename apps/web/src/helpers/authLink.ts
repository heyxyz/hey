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

let refreshPromise: Promise<string> | null = null;

const executeTokenRefresh = async (refreshToken: string): Promise<string> => {
  try {
    const response = await axios.post(
      LENS_API_URL,
      {
        operationName: "Refresh",
        query: REFRESH_AUTHENTICATION_MUTATION,
        variables: { request: { refreshToken } }
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const {
      accessToken,
      refreshToken: newRefreshToken,
      idToken
    } = response?.data?.data?.refresh ?? {};

    if (!accessToken || !newRefreshToken) {
      signOut();
      throw new Error("Invalid refresh response");
    }

    signIn({ accessToken, idToken, refreshToken: newRefreshToken });
    return accessToken;
  } catch (error) {
    signOut();
    throw error;
  } finally {
    refreshPromise = null;
  }
};

const refreshTokens = (refreshToken: string): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = executeTokenRefresh(refreshToken);
  }
  return refreshPromise;
};

const authLink = new ApolloLink((operation, forward) => {
  const { accessToken, refreshToken } = hydrateAuthTokens();

  if (!accessToken || !refreshToken) {
    signOut();
    return forward(operation);
  }

  const tokenData = parseJwt(accessToken);
  const isExpiringSoon =
    tokenData?.exp && Date.now() >= tokenData.exp * 1000 - 2 * 60 * 1000;

  if (!isExpiringSoon) {
    operation.setContext({
      headers: { "X-Access-Token": accessToken }
    });
    return forward(operation);
  }

  return fromPromise(
    refreshTokens(refreshToken)
      .then((newAccessToken) => {
        operation.setContext({
          headers: { "X-Access-Token": newAccessToken }
        });
        return toPromise(forward(operation));
      })
      .catch(() => toPromise(forward(operation)))
  );
});

export default authLink;
