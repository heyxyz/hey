import parseJwt from '@hey/lib/parseJwt';
import { hydrateAuthTokens } from 'src/store/useAuthPersistStore';

const getCurrentSessionId = (): string => {
  const { accessToken } = hydrateAuthTokens();

  const currentSession = parseJwt(accessToken || '');
  return currentSession?.authorizationId;
};

export default getCurrentSessionId;
