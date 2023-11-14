import { IS_MAINNET } from '@hey/data/constants';
import { hydrateLeafwatchViewerId } from 'src/store/useLeafwatchPersistStore';

const pushToImpressions = (id: string): void => {
  const viewerId = hydrateLeafwatchViewerId();

  if (IS_MAINNET && id && navigator.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'PUBLICATION_VISIBLE',
      id,
      viewerId
    });
  }

  return;
};

export default pushToImpressions;
