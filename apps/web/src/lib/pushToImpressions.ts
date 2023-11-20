import { IS_MAINNET } from '@hey/data/constants';
import { hydrateLeafwatchAnonymousId } from 'src/store/persisted/useLeafwatchPersistStore';

import getCurrentSession from './getCurrentSession';

const pushToImpressions = (id: string): void => {
  const anonymousId = hydrateLeafwatchAnonymousId();
  const { id: sessionProfileId } = getCurrentSession();

  if (IS_MAINNET && id && navigator.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'PUBLICATION_VISIBLE',
      id,
      viewerId: sessionProfileId || anonymousId
    });
  }

  return;
};

export default pushToImpressions;
