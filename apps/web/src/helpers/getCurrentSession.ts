import parseJwt from "@hey/helpers/parseJwt";
import { hydrateAuthTokens } from "src/store/persisted/useAuthStore";

/**
 * Get current session
 * @returns {Object} Current session
 */
const getCurrentSession = (): {
  authenticationId: string;
  evmAddress: string;
  id: string;
} => {
  const { accessToken } = hydrateAuthTokens();
  const currentSession = parseJwt(accessToken || "");

  return {
    authenticationId: currentSession?.authenticationId,
    evmAddress: currentSession?.evmAddress,
    id: currentSession?.id
  };
};

export default getCurrentSession;
