import { Localstorage } from '@hey/data/storage';
import { parseJwt } from '@hey/lens/apollo/lib';

const getCurrentSessionId = (): string => {
  const currentSession = parseJwt(
    localStorage.getItem(Localstorage.AccessToken) || ''
  );
  console.log(currentSession);
  const currentAuthorizationId = currentSession?.authorizationId;

  return currentAuthorizationId;
};

export default getCurrentSessionId;
