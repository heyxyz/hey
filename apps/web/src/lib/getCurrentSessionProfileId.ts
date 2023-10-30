import { Localstorage } from '@hey/data/storage';
import { parseJwt } from '@hey/lens/apollo/lib';

const getCurrentSessionProfileId = (): string | null => {
  const currentSession = parseJwt(
    localStorage.getItem(Localstorage.AccessToken) || ''
  );

  return currentSession.id.length ? currentSession.id : null;
};

export default getCurrentSessionProfileId;
