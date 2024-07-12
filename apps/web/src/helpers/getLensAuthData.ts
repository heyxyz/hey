import parseJwt from '@hey/helpers/parseJwt';
import { hydrateAuthTokens } from 'src/store/persisted/useAuthStore';

/**
 * Get current session
 * @returns current session id
 */
const getLensAuthData = (): {
  evmAddress: null | string;
  id: null | string;
} => {
  const { accessToken } = hydrateAuthTokens();
  const currentSession = parseJwt(accessToken || '');

  return { evmAddress: currentSession?.evmAddress, id: currentSession?.id };
};

export default getLensAuthData;
