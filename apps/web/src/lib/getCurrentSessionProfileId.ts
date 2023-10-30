import { Localstorage } from '@hey/data/storage';
import parseJwt from '@hey/lib/parseJwt';

const getCurrentSessionProfileId = (): string | null => {
  const currentSession = parseJwt(
    localStorage.getItem(Localstorage.AccessToken) || ''
  );

  return currentSession.id.length ? currentSession.id : null;
};

export default getCurrentSessionProfileId;
