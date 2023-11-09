import { LEAFWATCH_WORKER_URL } from '@hey/data/constants';

import getCurrentSessionProfileId from './getCurrentSessionProfileId';

let worker: Worker;

if (typeof Worker !== 'undefined') {
  worker = new Worker(new URL('./leafwatchWorker', import.meta.url));
}

/**
 * Leafwatch analytics
 */
export const Leafwatch = {
  track: (name: string, properties?: Record<string, unknown>) => {
    const currentSessionProfileId = getCurrentSessionProfileId();
    const { referrer } = document;
    const referrerDomain = referrer ? new URL(referrer).hostname : null;

    worker.postMessage({
      name,
      properties,
      actor: currentSessionProfileId,
      referrer: referrerDomain,
      url: window.location.href,
      platform: 'web'
    });

    worker.onmessage = function (event: MessageEvent) {
      const response = event.data;
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${LEAFWATCH_WORKER_URL}/ingest`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(response));
    };
  }
};
