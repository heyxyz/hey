import parseJwt from '@hey/lib/parseJwt';
import { hydrateAuthTokens } from 'src/store/persisted/useAuthStore';

/**
 * Get current session
 * @returns {Object} Current session
 */
const getCurrentSession = (): {
  authorizationId: string;
  id: string;
} => {
  const { accessToken } = hydrateAuthTokens();
  const currentSession = parseJwt(accessToken || '');

  return {
    authorizationId: currentSession?.authorizationId,
    id: currentSession?.id
  };
};

export default getCurrentSession;
