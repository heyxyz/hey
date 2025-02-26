import { hydrateAuthTokens } from "src/store/persisted/useAuthStore";

/**
 * Get common auth API headers.
 * @returns Auth API headers
 */
export const getAuthApiHeaders = () => {
  return { "X-Id-Token": hydrateAuthTokens()?.idToken };
};
