import { Localstorage } from '@hey/data/storage';
import { parseJwt } from '@hey/lens/apollo/lib';

const getCurrentSessionProfileId = (): string => {
  const currentSession = parseJwt(
    localStorage.getItem(Localstorage.AccessToken) || ''
  );

  return currentSession.id;
};

export default getCurrentSessionProfileId;
