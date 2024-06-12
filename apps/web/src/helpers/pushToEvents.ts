import { IS_MAINNET } from '@hey/data/constants';

const pushToEvents = (event: any): void => {
  if (IS_MAINNET && navigator.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'EVENT', ...event });
  }

  return;
};

export default pushToEvents;
