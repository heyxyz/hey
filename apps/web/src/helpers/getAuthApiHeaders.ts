import { hydrateAuthTokens } from "src/store/persisted/useAuthStore";

/**
 * Get auth API headers with access token.
 * @returns Auth API headers
 */
export const getAuthApiHeadersWithAccessToken = () => {
  const tokens = hydrateAuthTokens();
  return {
    "X-Access-Token": tokens.accessToken,
    "X-Id-Token": tokens.idToken
  };
};

/**
 * Get common auth API headers.
 * @returns Auth API headers
 */
export const getAuthApiHeaders = () => {
  return {
    "X-Id-Token": hydrateAuthTokens()?.idToken
  };
};
