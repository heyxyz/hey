import parseJwt from "@hey/helpers/parseJwt";
import { hydrateAuthTokens } from "src/store/persisted/useAuthStore";

/**
 * Get current session
 * @returns {Object} Current session
 */
const getCurrentSession = (): {
  owner: string;
  address: string;
} => {
  const { accessToken } = hydrateAuthTokens();
  const currentSession = parseJwt(accessToken || "");

  return {
    owner: currentSession?.sub,
    address: currentSession?.act.sub
  };
};

export default getCurrentSession;
