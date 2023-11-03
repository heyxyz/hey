import parseJwt from '@hey/lib/parseJwt';
import { hydrateAuthTokens } from 'src/store/useAuthPersistStore';

const getCurrentSessionProfileId = (): string => {
  const { accessToken } = hydrateAuthTokens();

  const currentSession = parseJwt(accessToken || '');
  return currentSession?.id;
};

export default getCurrentSessionProfileId;
